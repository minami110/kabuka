<template>
  <b-form @submit="submit">
    <b-card>
      <template v-slot:header>
        <h5 class="mb-0">
          <strong>{{ formDateStr }}</strong>
          <span v-if="form.isPm">
            <b-badge pill variant="warning">PM</b-badge>
          </span>
          <span v-else>
            <b-badge pill variant="success">AM</b-badge>
          </span>
          <span class="align-bottom">の🥬</span>
        </h5>
      </template>

      <b-form-row>
        <!-- カブ値入力フィールド -->
        <b-col cols="12">
          <b-form-group>
            <b-input-group prepend="💰" append="ベル" size="sm" class="mr-2">
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
              <h6>🐻の買取値</h6>
            </template>
            <template #description>
              <span class="text-muted small"
                >{{ getLoginUserIslandName }}の, 🥬買取値を入力</span
              >
            </template>
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <a
            href="#"
            class="text-muted"
            style="font-size:0.6rem"
            @click="openDateForm"
          >
            <span v-show="!state.bShowDateForm">+</span>
            <span v-show="state.bShowDateForm">-</span>
            <span>日付の指定</span>
          </a>
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

export default {
  data() {
    return {
      form: {
        value: null,
        date: new Date(),
        isPm: null
      },
      state: {
        date: null,
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
      } else if (this.isDateSunday) {
        return '日曜日は送信できません'
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
      } else if (this.isDateSunday) {
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
        return '島'
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
    // detect current time
    const now = new Date()
    const hours = getHours(now)
    if (hours > 11) {
      this.form.isPm = true
    } else {
      this.form.isPM = false
    }

    // init data for form date
    this.calender.minDate = new Date()
    this.calender.minDate.setFullYear(2020)
    this.calender.minDate.setMonth(3 - 1)
    this.calender.minDate.setDate(20)
    this.calender.maxData = now

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

      // generate kabuValue-id from current time
      const dateForId = format(this.form.date, 'yyyyMMdd')
      const id =
        dateForId +
        '-' +
        String(Number(this.form.isPm)) +
        '-' +
        String(this.loginuser.id)

      // 株価を入力済みの値に変更
      if (this.kabuValues[id]) {
        // set to prev value
        this.form.value = this.kabuValues[id].value
        this.state.bAlreadyPosted = true
      } else {
        // set to default: null
        this.form.value = null
        this.state.bAlreadyPosted = false
      }

      // ユーザー入力による変更済みフラグをリセットする
      this.state.bChangedValueByUser = false
    },
    openDateForm(e) {
      e.preventDefault()
      this.state.bShowDateForm = !this.state.bShowDateForm
    },
    async submit(e) {
      e.preventDefault()

      if (this.state.bSubmitting) {
        return
      } else {
        this.state.bSubmitting = true
      }

      // clear prev state
      this.state.date = null

      // get value from form
      const value = this.form.value
      const date = this.form.date
      const isPm = this.form.isPm

      // date validation
      // vailid string format?
      if (!isValid(date)) {
        // invalid date string
        this.state.date = false
        this.state.bSubmitting = false
        return
      }

      // 2020/03/20以前のデータではない?
      if (isBefore(date, new Date('2020/03/20'))) {
        this.state.date = false
        this.state.bSubmitting = false
        return
      }

      // 日曜日ではない?
      if (isSunday(date)) {
        this.state.date = false
        this.state.bSubmitting = false
        return
      }

      // send date
      const loginuserId = this.loginuser.id
      if (!loginuserId) {
        // not loggined
        this.state.bSubmitting = false
        return
      }

      await this.$store.dispatch({
        type: 'kabuValues/postKabuValue',
        date,
        isPm,
        userId: loginuserId,
        value
      })

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
