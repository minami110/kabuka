<template>
  <b-row v-if="bFetchingData">
    <b-col cols="12" class="text-center">
      <strong>スプレッドシートにアクセス中...</strong>
      <b-spinner small label="Spinning" />
    </b-col>
  </b-row>

  <b-row v-else>
    <!-- ログイン状態に応じて, 表示するカードを変更 -->
    <b-col cols="12">
      <!-- loginuser.id がなければ, ログインカードを表示 -->
      <card-login v-if="!loginuser.id" />

      <!-- loginuser.id があれば, ユーザーカードを表示 -->
      <card-user
        v-else
        @logout="makeToast('logout!', 'Succeed to logout', 'success')"
      />
    </b-col>

    <b-col v-if="loginuser.id" cols="12" class="mt-3">
      <card-hot-island />
    </b-col>

    <b-col v-if="loginuser.id" cols="12" class="mt-3">
      <card-chart :begin-day="new Date(2020, 2, 24)" />
    </b-col>

    <b-col v-if="loginuser.id" cols="12" class="mt-3">
      <card-links />
    </b-col>
  </b-row>
</template>

<style>
input,
select {
  font-size: 16px !important;
}
</style>

<script>
// import vuex
import { mapGetters } from 'vuex'

// import components
import CardLogin from '~/components/CardLogin'
import CardUser from '~/components/CardUser'
import CardLinks from '~/components/CardLinks'
import CardChart from '~/components/CardChart'
import CardHotIsland from '~/components/CardHotIsland'

export default {
  components: {
    CardLogin,
    CardUser,
    CardLinks,
    CardChart,
    CardHotIsland
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
    })
  },
  async mounted() {
    // initialize state
    this.$store.dispatch('kabuValues/Init')

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
