<template>
  <b-form @submit="submit">
    <b-card>
      <template v-slot:header>
        <h5 class="mb-0">
          <strong>{{ formDateStr }}</strong>
          <span v-show="!isDateSunday">
            <span v-show="form.isPm">
              <b-badge pill variant="warning">PM</b-badge>
            </span>
            <span v-show="!form.isPm">
              <b-badge pill variant="success">AM</b-badge>
            </span>
          </span>
          <span class="align-bottom">の🥬</span>
        </h5>
      </template>

      <b-form-row>
        <!-- カブ値入力フィールド -->
        <b-col cols="12">
          <b-form-group>
            <b-input-group prepend="💰" append="ベル" size="sm">
              <b-input
                v-model="form.value"
                type="number"
                size="sm"
                placeholder="???"
                :readonly="readOnlyValueInput"
                lazy
                required
                min="1"
                max="999"
                @input="onChangedValue"
              />
            </b-input-group>
            <template #label>
              <h6>{{ getLabelKabuValue }}</h6>
            </template>
            <template #description>
              <span class="text-muted small">{{ getDescKabuValue }}</span>
            </template>
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-link
            href="#"
            class="text-muted"
            style="font-size:0.6rem"
            @click="state.bShowDateForm = !state.bShowDateForm"
          >
            <span v-show="!state.bShowDateForm">+</span>
            <span v-show="state.bShowDateForm">-</span>
            <span>日付の指定</span>
          </b-link>
        </b-col>

        <!-- 過去のデータを更新する場合は, 日付フィールドを表示 -->
        <b-col v-show="state.bShowDateForm" cols="12" sm="10" class="mt-2">
          <b-form-datepicker
            id="datepicker-buttons"
            v-model="form.date"
            :min="calender.minDate"
            :max="calender.maxData"
            size="sm"
            dark
            value-as-date
          />
        </b-col>

        <b-col v-show="state.bShowDateForm" cols="12" sm="2" class="mt-2">
          <b-form-checkbox v-model="form.isPm" class="mr-2">PM</b-form-checkbox>
        </b-col>
      </b-form-row>

      <template v-if="state.bChangedValueByUser" v-slot:footer>
        <b-button
          block
          type="submit"
          size="sm"
          variant="primary"
          :disabled="getSubmitButtonDisabled"
        >
          <span>{{ getSubmitButtonText }}</span>
          <b-spinner v-show="getShowSubmitButtonSpinner" small />
        </b-button>
      </template>
    </b-card>
  </b-form>
</template>

<script>
import { mapGetters } from 'vuex'

// import date-fns functions
import format from 'date-fns/format'
import ja from 'date-fns/locale/ja'
import getHours from 'date-fns/getHours'
import isValid from 'date-fns/isValid'
import isBefore from 'date-fns/isBefore'
import isSunday from 'date-fns/isSunday'
import startOfWeek from 'date-fns/startOfWeek'

export default {
  props: {
    now: {
      type: Date,
      default: () => {
        return new Date()
      }
    }
  },
  data() {
    return {
      form: {
        value: null,
        date: new Date(),
        isPm: null
      },
      state: {
        bSubmitting: true,
        bShowDateForm: false,
        bMounted: false,
        bAlreadyPosted: false,
        bChangedValueByUser: false
      },
      calender: {
        minDate: null,
        maxData: null
      }
    }
  },

  computed: {
    ...mapGetters({
      loginuser: 'users/loginuser',
      kabuValues: 'kabuValues/kabuValues',
      store_bFetchingKabuValues: 'kabuValues/bFetchingKabuValues'
    }),
    formDateStr() {
      const dateStr = format(this.form.date, 'MM/dd (E)', { locale: ja })
      return dateStr
    },
    isDateSunday() {
      return isSunday(this.form.date)
    },
    isFetchingKabuValues() {
      if (!this.state.bMounted) {
        return true
      }
      if (this.store_bFetchingKabuValues) {
        return true
      }
      return false
    },
    readOnlyValueInput() {
      if (this.isFetchingKabuValues) {
        return true
      } else if (this.state.bSubmitting) {
        return true
      }
      return false
    },
    getSubmitButtonText() {
      if (this.isFetchingKabuValues) {
        return '通信中...'
      } else if (this.state.bSubmitting) {
        return '送信中...'
      } else if (this.state.bAlreadyPosted) {
        return '再送信'
      } else {
        return '送信'
      }
    },
    getSubmitButtonDisabled() {
      if (this.isFetchingKabuValues) {
        return true
      } else if (this.state.bSubmitting) {
        return true
      } else {
        return false
      }
    },
    getShowSubmitButtonSpinner() {
      if (this.isFetchingKabuValues) {
        return true
      } else if (this.state.bSubmitting) {
        return true
      } else {
        return false
      }
    },
    getLoginUserIslandName() {
      if (this.loginuser.islandName) {
        return this.loginuser.islandName + '島'
      } else {
        return 'NoName島'
      }
    },
    getLabelKabuValue() {
      // カブ値入力inputのラベル, 日曜と平日で切りかえる
      if (this.isDateSunday) {
        return '🐗の販売価格'
      } else {
        return '🐻の買取価格'
      }
    },
    getDescKabuValue() {
      // カブ入力inputのDescription, 日曜と平日で切り替える
      if (this.isDateSunday) {
        return `${this.getLoginUserIslandName}の🥬販売値を入力. 値動きの予測に必須です.`
      } else {
        return `${this.getLoginUserIslandName}の🥬買取価格を入力.`
      }
    }
  },
  watch: {
    'form.date'(val) {
      this.updateKabuValue()
    },
    'form.isPm'(val) {
      this.updateKabuValue()
    },
    store_bFetchingKabuValues(val) {
      if (!val) {
        if (!this.state.bSubmitting) {
          // update form.value
          this.updateKabuValue()
        }
      }
    }
  },
  mounted() {
    // set form default value
    this.form.date = this.now

    // detect current time
    const hours = getHours(this.now)
    if (hours < 5 || hours > 11) {
      this.form.isPm = true
    } else {
      this.form.isPM = false
    }

    // init data for form date
    this.calender.minDate = startOfWeek(this.now)
    this.calender.maxData = this.now

    // fetch KabuValues background
    this.$store.dispatch('kabuValues/getKabuValues')

    // init status
    this.state.bSubmitting = false
    this.state.bMounted = true
  },
  methods: {
    updateKabuValue() {
      // if fetching kabuValues, return
      if (this.isFetchingKabuValues) {
        return
      }

      // カブ値データの存在を確認するために, ユニークIDをローカルで作成する
      let uniqueId = format(this.form.date, 'yyyyMMdd')
      uniqueId += '-'
      // 日曜なら常にAMとする
      if (this.isDateSunday) {
        uniqueId += '0'
      } else {
        uniqueId += String(Number(this.form.isPm))
      }
      uniqueId += '-' + String(this.loginuser.id)

      // 株価を入力済みの値に変更
      if (this.kabuValues[uniqueId]) {
        // set to prev value
        this.form.value = this.kabuValues[uniqueId].value
        this.state.bAlreadyPosted = true
      } else {
        // set to default: null
        this.form.value = null
        this.state.bAlreadyPosted = false
      }

      // ユーザー入力による変更済みフラグをリセットする
      this.state.bChangedValueByUser = false
    },

    // カブ値を送信する
    async submit(e) {
      e.preventDefault()

      if (this.state.bSubmitting) {
        return
      } else {
        this.state.bSubmitting = true
      }

      // get value from form
      const value = this.form.value
      const date = this.form.date
      let isPm = this.form.isPm

      // ログイン中のユーザーIDを取得する
      const loginuserId = this.loginuser.id
      if (!loginuserId) {
        // not loggined
        this.state.bSubmitting = false
        return
      }

      // date validation
      // vailid string format?
      if (!isValid(date)) {
        // invalid date string
        this.state.bSubmitting = false
        return
      }

      // 2020/03/20以前のデータではない?
      if (isBefore(date, new Date('2020/03/20'))) {
        this.state.bSubmitting = false
        return
      }

      // 日曜日ならば, 強制的にAMとする
      if (isSunday(date)) {
        isPm = 0
      }

      // send date
      const params = {
        type: 'kabuValues/postKabuValue',
        date,
        isPm,
        userId: loginuserId,
        value
      }
      await this.$store.dispatch(params)

      // トーストを表示
      this.$bvToast.toast('現在のカブ値を報告', {
        title: 'Send!',
        variant: 'success',
        autoHideDelay: 2000
      })

      // 投稿後に, stateを初期に戻す
      this.state.bSubmitting = false
      this.state.bChangedValueByUser = false
    },
    // ユーザー入力により, カブ値が変更されたときのコールバック
    onChangedValue() {
      this.state.bChangedValueByUser = true
    }
  }
}
</script>
