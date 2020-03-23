<template>
  <b-card>
    <b-card-title>こんにちは {{ loginuser.name }}さん</b-card-title>

    <card-post-kabu-value />

    <card-post-kabu-having class="mt-3" />

    <template v-slot:footer>
      <b-form @submit="logout">
        <b-button type="submit" size="sm" variant="danger">ログアウト</b-button>
      </b-form>
    </template>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

// import components
import CardPostKabuValue from "~/components/CardPostKabuValue";
import CardPostKabuHaving from "~/components/CardPostKabuHaving";

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

      // logout-eventをemit
      this.$emit("logout");

      // pushではなくreplaceを使用して, historyを残さない
      this.$router.replace({ query: query });
    }
  },
  computed: {
    ...mapGetters({
      loginuser: "users/loginuser"
    })
  },
  components: {
    CardPostKabuValue,
    CardPostKabuHaving
  }
};
</script>