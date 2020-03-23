<template>
  <b-card>
    <b-card-title>ログイン</b-card-title>
    <b-alert v-model="alert.bFailedLogin" variant="danger" dismissible>ログインに失敗</b-alert>
    <b-form @submit="login">
      <b-form-group>
        <b-form-input v-model="form.name" size="sm" required placeholder="キャラクターの名前を入力" />
      </b-form-group>
      <b-button size="sm" type="submit" variant="primary">ログイン</b-button>
    </b-form>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form: {
        name: ""
      },
      alert: {
        bFailedLogin: false
      }
    };
  },
  methods: {
    login(e) {
      e.preventDefault();

      // get form params
      const inName = this.form.name;

      const promise = this.$store.dispatch({
        type: "users/loginUseName",
        name: inName
      });
      promise.then(r => {
        if (r) {
          // login success
          // userクエリを追加
          let query = { ...this.$route.query };
          query["user"] = this.loginuser.id;
          this.$router.replace(
            { query: query },
            () => {},
            () => {}
          );
        } else {
          // login failed
          this.alert.bFailedLogin = true;
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      loginuser: "users/loginuser"
    })
  }
};
</script>