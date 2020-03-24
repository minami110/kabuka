<template>
  <b-form @submit="submit" class="mt-3">
    <b-card>
      <template v-slot:header>
        <h5 class="mb-0">
          <span>カブ値の報告</span>
          <span>:</span>
          <span>{{ formDateStr }}</span>
          <span v-if="form.isPm">
            <b-badge pill variant="warning">PM</b-badge>
          </span>
          <span v-else>
            <b-badge pill variant="success">AM</b-badge>
          </span>
        </h5>
      </template>

      <b-form-row>
        <!-- カブ値入力フィールド -->
        <b-col cols="12">
          <b-form-group description="いまの買取価格を入力">
            <b-input-group prepend="$" append="ベル" size="sm" class="mr-2">
              <b-input
                size="sm"
                placeholder="100"
                v-model="form.value"
                type="number"
                min="1"
                required
              ></b-input>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <a href="#" @click="openDateForm" class="text-muted" style="font-size:0.6rem">
            <span v-show="!state.bShowDateForm">+</span>
            <span v-show="state.bShowDateForm">-</span>
            <span>日付の指定</span>
          </a>
        </b-col>

        <!-- 過去のデータを更新する場合は, 日付フィールドを表示 -->
        <b-col v-if="state.bShowDateForm" cols="12" sm="10" class="mt-2">
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
        <b-col v-if="state.bShowDateForm" cols="12" sm="2" class="mt-2">
          <b-form-checkbox v-model="form.isPm" class="mr-2">PM</b-form-checkbox>
        </b-col>
      </b-form-row>

      <template v-slot:footer>
        <div v-if="isDateSunday">
          <b-button size="sm" variant="primary" disabled>日曜日は送信できません</b-button>
        </div>
        <div v-else>
          <b-button v-if="state.bSubmitting" block size="sm" variant="primary" disabled>
            <b-spinner small type="grow"></b-spinner>送信中...
          </b-button>
          <b-button v-else block type="submit" size="sm" variant="primary">送信</b-button>
        </div>
      </template>
    </b-card>
  </b-form>
</template>


<script>
import { mapGetters } from "vuex";

// import date-fns functions
import format from "date-fns/format";
import ja from "date-fns/locale/ja";
import getHours from "date-fns/getHours";
import parse from "date-fns/parse";
import isValid from "date-fns/isValid";
import isBefore from "date-fns/isBefore";
import isSunday from "date-fns/isSunday";

export default {
  data() {
    return {
      form: {
        value: 100,
        date: new Date(),
        isPm: false
      },
      state: {
        date: null,
        bSubmitting: true,
        bShowDateForm: false
      },
      calender: {
        minDate: null,
        maxData: null
      }
    };
  },
  computed: {
    ...mapGetters({
      loginuser: "users/loginuser"
    }),
    formDateStr() {
      let dateStr = format(this.form.date, "MM/dd (E)", { locale: ja });
      return dateStr;
    },
    isDateSunday() {
      return isSunday(this.form.date);
    }
  },
  mounted() {
    // detect current time
    const now = new Date();
    const hours = getHours(now);
    if (hours > 11) {
      this.form.isPm = true;
    }

    // init data for form date
    this.calender.minDate = new Date();
    this.calender.minDate.setFullYear(2020);
    this.calender.minDate.setMonth(3 - 1);
    this.calender.minDate.setDate(20);

    this.calender.maxData = now;

    // init status
    this.state.bSubmitting = false;
  },
  methods: {
    openDateForm(e) {
      e.preventDefault();
      this.state.bShowDateForm = !this.state.bShowDateForm;
    },
    async submit(e) {
      e.preventDefault();

      this.state.bSubmitting = true;

      // clear prev state
      this.state.date = null;

      // get value from form
      const value = this.form.value;
      let date = this.form.date;
      const isPm = this.form.isPm;

      // date validation
      // vailid string format?
      if (!isValid(date)) {
        // invalid date string
        this.state.date = false;
        this.state.bSubmitting = false;
        return;
      }

      // 2020/03/20以前のデータではない?
      if (isBefore(date, new Date("2020/03/20"))) {
        this.state.date = false;
        this.state.bSubmitting = false;
        return;
      }

      // 日曜日ではない?
      if (isSunday(date)) {
        this.state.date = false;
        this.state.bSubmitting = false;
        return;
      }

      // send date
      const loginuserId = this.loginuser.id;
      if (!loginuserId) {
        // not loggined
        this.state.bSubmitting = false;
        return;
      }

      await this.$store.dispatch({
        type: "kabuValues/postKabuValue",
        date: date,
        isPm: isPm,
        userId: loginuserId,
        value: value
      });

      this.$bvToast.toast("現在のカブ値を報告", {
        title: "Send!",
        variant: "success",
        autoHideDelay: 3000
      });

      this.state.bSubmitting = false;
    }
  }
};
</script>