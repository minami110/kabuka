<template>
  <b-card>
    <b-card-title>
      <span>カブ価の投稿</span>
    </b-card-title>

    <b-form inline>
      <b-input-group prepend="$" class="mr-2">
        <b-input placeholder="100" type="number" min="1" required></b-input>
      </b-input-group>
      <b-input class="mr-2" placeholder="2020/03/20" required></b-input>
      <b-form-checkbox class="mr-2">PM</b-form-checkbox>

      <b-button type="submit" size="sm" variant="primary">投稿</b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    submit(e) {
      e.preventDefault();

      /*
      this.$store.dispatch({
        type: "users/logout"
      });

      // user queryを削除
      let query = { ...this.$route.query };
      delete query["user"];
      // pushではなくreplaceを使用して, historyを残さない
      this.$router.replace({ query: query });
      */
    }
  }
};
</script>