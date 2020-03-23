<template>
  <b-card>
    <b-card-title>こんにちは {{ loginuser.name }}さん</b-card-title>

    <h4>
      カブ価の投稿
      <b-badge variant="danger">工事中</b-badge>
    </h4>
    <div>
      <b-form inline>
        <b-input type="date" />
        <b-form-select
          value="AM"
          :options="[{ value: 'AM', text: 'AM' },{ value: 'PM', text: 'PM' }]"
        />
        <b-input type="number" value="100" />
      </b-form>
    </div>

    <template v-slot:footer>
      <b-form @submit="logout">
        <b-button type="submit" size="sm" variant="danger">ログアウト</b-button>
      </b-form>
    </template>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    logout(e) {
      e.preventDefault();
      this.$store.dispatch({
        type: "users/logout"
      });

      // user queryを削除
      let query = { ...this.$route.query };
      delete query["user"];
      // pushではなくreplaceを使用して, historyを残さない
      this.$router.replace({ query: query });
    }
  },
  computed: {
    ...mapGetters({
      loginuser: "users/loginuser"
    })
  }
};
</script>