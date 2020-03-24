<template>
  <b-card>
    <b-card-title>
      <div class="d-flex">
        <h4>{{ loginuser.name }} さん</h4>
        <div class="small ml-auto">
          <a href="#" @click="logout">ログアウト</a>
        </div>
      </div>
    </b-card-title>
    <b-row>
      <b-col cols="12" md="6">
        <card-post-kabu-value />
      </b-col>

      <b-col cols="12" md="6">
        <card-post-kabu-having class="mt-3 mt-md-0" />
      </b-col>
    </b-row>
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
  computed: {
    ...mapGetters({
      loginuser: "users/loginuser"
    })
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
  components: {
    CardPostKabuValue,
    CardPostKabuHaving
  }
};
</script>