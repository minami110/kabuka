<template>
  <b-form @submit="submit">
    <b-card>
      <template v-slot:header>
        <h5 class="mb-0">
          <span>{{ dateSundayStr }}</span>
          <span>の🥬情報</span>
        </h5>
      </template>

      <b-form-row>
        <b-col cols="12">
          <b-form-group>
            <b-input-group size="sm" prepend="💰" append="ベル">
              <b-form-input
                v-model="form.valueUriSell"
                type="number"
                size="sm"
                placeholder="???"
                :readonly="getIsFormDisabled"
                lazy
                required
                min="1"
                max="999"
                @input="onChangedValueUriSell"
              />
            </b-input-group>
            <template #label>
              <h6>🐗の販売値</h6>
            </template>
            <template #description>
              <span class="text-muted small"
                >{{ getLoginUserIslandName }}の, 🥬販売値を入力.
                値動きの予測に必須.</span
              >
            </template>
          </b-form-group>
        </b-col>
      </b-form-row>

      <!--
      <b-form-group>
        <b-form-row>
          <b-col cols="5">
            <b-input-group size="sm" prepend="$">
              <b-form-input type="number" size="sm" :value="100" readonly></b-form-input>
            </b-input-group>
          </b-col>
          <b-col class="text-center m-auto">
            <span>x</span>
          </b-col>
          <b-col cols="6">
            <b-input-group size="sm" append="カブ">
              <b-form-input type="number" size="sm" readonly></b-form-input>
            </b-input-group>
          </b-col>
        </b-form-row>
        <template #label>
          <h6>username さんの購入情報</h6>
        </template>
        <template #description>
          <span class="text-muted small">購入時の値段と, 購入した数を入力</span>
        </template>
      </b-form-group>
      -->

      <template v-if="state.bChangedValueByUser" v-slot:footer>
        <b-button
          block
          type="submit"
          size="sm"
          variant="primary"
          :disabled="getIsFormDisabled"
        >
          <span>{{ getSubmitButtonText }}</span>
          <b-spinner v-show="getShowSubmitButtonSpinner" small />
        </b-button>
      </template>
    </b-card>
  </b-form>
</template>

<script>
// import vuex functions
import { mapGetters } from 'vuex'

// import date-fns functions
import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import ja from 'date-fns/locale/ja'

export default {
  data() {
    return {
      form: {
        valueUriSell: null
      },
      state: {
        bMounted: false,
        bSubmitting: false,
        bChangedValueByUser: false
      }
    }
  },
  computed: {
    ...mapGetters({
      loginuser: 'users/loginuser',
      kabuValues: 'kabuValues/kabuValues',
      store_bFetchingKabuValues: 'kabuValues/bFetchingKabuValues'
    }),
    dateSundayStr() {
      const sunday = startOfWeek(new Date())
      const dateStr = format(sunday, 'MM/dd (E)', { locale: ja })
      return dateStr
    },
    isFetchingAPI() {
      if (!this.state.bMounted) {
        return true
      } else if (this.store_bFetchingKabuValues) {
        return true
      }
      return false
    },
    getSubmitButtonText() {
      if (this.state.bSubmitting) {
        return '送信中...'
      } else if (this.isFetchingAPI) {
        return '通信中...'
      }
      return '保存'
    },
    getIsFormDisabled() {
      if (this.state.bSubmitting) {
        return true
      } else if (this.isFetchingAPI) {
        return true
      }
      return false
    },
    // is show spinner in submit button
    getShowSubmitButtonSpinner() {
      if (this.state.bSubmitting) {
        return true
      } else if (this.isFetchingAPI) {
        return true
      }
      return false
    },
    // get loginuser island name
    getLoginUserIslandName() {
      if (this.loginuser.islandName) {
        return this.loginuser.islandName + '島'
      } else {
        return '島'
      }
    }
  },
  watch: {
    store_bFetchingKabuValues(val) {
      if (!val) {
        if (!this.state.bSubmitting) {
          // update form.value
          this.updateFormValue()
        }
      }
    }
  },
  mounted() {
    // fetch KabuValues background
    this.$store.dispatch('kabuValues/getKabuValues')
    this.state.bMounted = true
  },
  methods: {
    // user clicked submit button
    async submit(e) {
      e.preventDefault()

      // 現在送信処理中なら, return
      if (this.state.bSubmitting) {
        return
      } else {
        this.state.bSubmitting = true
      }

      // GoogleSpleadSheetに送信
      // loginUserIdが取得できなければ, やめる
      const loginuserId = this.loginuser.id
      if (!loginuserId) {
        // not loggined
        this.state.bSubmitting = false
        return
      }

      // ウリの販売価格を更新
      // 日曜日のAMの部分を使用する
      const thisSunday = startOfWeek(new Date())
      await this.$store.dispatch({
        type: 'kabuValues/postKabuValue',
        date: thisSunday,
        isPm: false, // 常にAM
        userId: loginuserId,
        value: this.form.valueUriSell
      })

      // ユーザーの購入情報を更新
      // NOT_IMPLEMENTED

      // すべて成功していたら, Toastを表示する
      this.$bvToast.toast('保存しました!', {
        title: 'Saved!',
        variant: 'success',
        autoHideDelay: 2000
      })

      // 投稿後に, stateを初期に戻す
      this.state.bSubmitting = false
      this.state.bChangedValueByUser = false
    },
    // データベース更新後に, フォームを更新する関数
    // mountedの最後に呼ばれる
    updateFormValue() {
      if (this.isFetchingAPI) {
        return
      }

      // generate kabuValue-id from current time
      const thisSunday = startOfWeek(new Date())
      const dateForId = format(thisSunday, 'yyyyMMdd')
      const id = dateForId + '-0-' + String(this.loginuser.id)

      if (this.kabuValues[id]) {
        // set to prev value
        this.form.valueUriSell = this.kabuValues[id].value
      } else {
        // set to default: null
        this.form.valueUriSell = null
      }
    },
    // ユーザー入力により, カブ値が変更されたときのコールバック
    onChangedValueUriSell() {
      this.state.bChangedValueByUser = true
    }
  }
}
</script>
