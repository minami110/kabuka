<template>
  <b-card>
    <b-card-title>
      <h4>カブ値投稿</h4>
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
// import vuex
import { mapGetters } from 'vuex'

// import components
import CardPostKabuValue from '~/components/CardPostKabuValue'
import CardPostKabuHaving from '~/components/CardPostKabuHaving'

export default {
  components: {
    CardPostKabuValue,
    CardPostKabuHaving
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      loginuser: 'users/loginuser'
    }),
    getLoginUserName() {
      if (this.loginuser) {
        return this.loginuser.name
      } else {
        return ''
      }
    }
  }
}
</script>
