<template>
  <b-card>
    <b-card-title>
      <span>カブ価の投稿</span>
    </b-card-title>

    <b-form inline @submit="submit">
      <b-input-group prepend="$" class="mr-2">
        <b-input placeholder="100" v-model="form.value" type="number" min="1" required></b-input>
      </b-input-group>
      <b-input
        class="mr-2"
        v-model="form.date"
        :state="state.date"
        placeholder="2020/03/20"
        required
      ></b-input>
      <b-form-checkbox v-model="form.isPm" class="mr-2">PM</b-form-checkbox>

      <b-button v-if="state.bSubmitting" size="sm" variant="primary" disabled>
        <b-spinner small type="grow"></b-spinner>投稿中...
      </b-button>

      <b-button v-else type="submit" size="sm" variant="primary">投稿</b-button>
    </b-form>

    <div class="mt-2 text-muted small">
      <ul>
        <li>現在時刻(ja)をもとに, 日付は自動的に入力されます</li>
        <li>同じ日付でも, 午前と午後は別として扱われます.</li>
        <li>すでに投稿済みの日付の場合は, 新しい値に更新されます</li>
      </ul>
    </div>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

// import date-fns functions
import getHours from "date-fns/getHours";
import parse from "date-fns/parse";
import isValid from "date-fns/isValid";
import isBefore from "date-fns/isBefore";

export default {
  data() {
    return {
      form: {
        value: 100,
        date: "2020/03/20",
        isPm: false
      },
      state: {
        date: null,
        bSubmitting: true
      }
    };
  },
  computed: {
    ...mapGetters({
      loginuser: "users/loginuser"
    })
  },
  mounted() {
    // detect current time
    const now = new Date();
    const hours = getHours(now);
    if (hours > 11) {
      this.form.isPm = true;
    }
    this.form.date = this.$date_fns(now, "yyyy/MM/dd");

    // init status
    this.state.bSubmitting = false;
  },
  methods: {
    async submit(e) {
      e.preventDefault();

      this.state.bSubmitting = true;

      // clear prev state
      this.state.date = null;

      // get value from form
      const value = this.form.value;
      const date_str = this.form.date;
      const isPm = this.form.isPm;

      // date validation
      // vailid string format?
      let date = parse(date_str, "yyyy/MM/dd", new Date());
      if (!isValid(date)) {
        // invalid date string
        this.state.date = false;
        this.state.bSubmitting = false;
        return;
      }

      // after 2020/03/20 ?
      if (isBefore(date, new Date("2020/03/20"))) {
        // before 2020/03/20, error
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

      this.state.bSubmitting = false;
    }
  }
};
</script>