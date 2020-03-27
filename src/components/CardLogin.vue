<template>
  <b-card>
    <b-card-title>ログイン</b-card-title>
    <b-form @submit="login">
      <b-form-row>
        <b-col cols="12" sm="6">
          <b-form-group size="sm">
            <b-form-input
              v-model="form.name"
              size="sm"
              required
              placeholder="キャラクターの名前を入力"
            />
            <template #description>
              <ul class="small ml-n3 mt-2">
                <li>スプレッドシートに登録した名前でログイン</li>
                <li>ユーザー登録は, スプレッドシートを直接編集</li>
              </ul>
            </template>
          </b-form-group>
        </b-col>
        <b-col cols="12" sm="6">
          <b-button size="sm" block type="submit" variant="primary"
            >ログイン</b-button
          >
        </b-col>
      </b-form-row>
    </b-form>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      loginuser: 'users/loginuser'
    })
  },
  methods: {
    login(e) {
      e.preventDefault()

      // get form params
      const inName = this.form.name

      const promise = this.$store.dispatch({
        type: 'users/loginUseName',
        name: inName
      })
      promise.then((r) => {
        if (r) {
          // login success

          // create toast
          this.$bvToast.toast('こんにちは ' + this.loginuser.name + 'さん', {
            title: 'Success to login!',
            variant: 'success',
            autoHideDelay: 2000
          })

          // userクエリを追加
          const query = { ...this.$route.query }
          query.user = this.loginuser.id
          this.$router.replace(
            { query },
            () => {},
            () => {}
          )
        } else {
          // create toast
          this.$bvToast.toast('ログインに失敗!', {
            title: 'Failed to login!',
            variant: 'danger',
            autoHideDelay: 2000
          })
        }
      })
    }
  }
}
</script>
