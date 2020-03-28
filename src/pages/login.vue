<template>
  <b-row>
    <b-col cols="12">
      <!-- loginuser.id がなければ, ログインカードを表示 -->
      <card-login />
    </b-col>
  </b-row>
</template>

<script>
// import vuex
import { mapGetters } from 'vuex'

// import components
import CardLogin from '~/components/CardLogin'

// import package info
import packageInfo from '~/package.json'
import buildInfo from '~/build_info.json'

export default {
  components: {
    CardLogin
  },
  data() {
    return {
      bFetchingData: true
    }
  },
  computed: {
    ...mapGetters({
      users: 'users/users',
      loginuser: 'users/loginuser'
    }),
    application_version() {
      return packageInfo.version + '.' + buildInfo.number
    }
  },
  async mounted() {
    // fetch users data from spleadsheet
    this.bFetchingData = true
    await Promise.all([this.$store.dispatch('users/getUsers')])
    this.bFetchingData = false

    // get user-id from query
    const queryLoginuserId = this.$route.query.user
    if (queryLoginuserId) {
      // クエリのuser-idがある場合は, それを利用してログインする
      await this.$store.dispatch({
        type: 'users/loginUseId',
        id: queryLoginuserId
      })

      // クエリのuser-idを使用してログイン後に, ログインに成功していなければ, クエリを空にする
      if (!this.loginuser.id) {
        const query = { ...this.$route.query }
        delete query.user
        // pushではなくreplaceを使用して, historyを残さない
        this.$router.replace({ query })
      }
    }
  },
  methods: {
    makeToast(title = 'title', body = 'body', variant = null) {
      this.$bvToast.toast(body, {
        title,
        variant,
        autoHideDelay: 2000
      })
    }
  }
}
</script>
