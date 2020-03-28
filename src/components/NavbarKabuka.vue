<template>
  <b-navbar type="dark" variant="dark">
    <b-navbar-brand to="/">kabuka</b-navbar-brand>

    <b-navbar-toggle target="navbar-toggle-collapse">
      <template v-slot:default="{ expanded }">
        <b-icon-three-dots v-show="expanded" />
        <b-icon-three-dots v-show="!expanded" />
      </template>
    </b-navbar-toggle>

    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav v-if="isLogginned" class="ml-auto" small>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            {{ loginuser.name }}@{{ loginuser.islandName }}島
          </template>
          <b-dropdown-item href="#" @click="logout">ログアウト</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<style scoped>
.bg-dark {
  background-color: #292e1c !important;
}
</style>

<script>
import { mapGetters } from 'vuex'

import { BIconThreeDots } from 'bootstrap-vue'

export default {
  components: {
    BIconThreeDots
  },
  computed: {
    ...mapGetters({
      loginuser: 'users/loginuser'
    }),
    isLogginned() {
      if (this.loginuser) {
        if (this.loginuser.id) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  methods: {
    logout(e) {
      e.preventDefault()

      this.$store.dispatch({
        type: 'users/logout'
      })

      // user queryを削除
      const query = { ...this.$route.query }
      delete query.user

      // logout-eventをemit
      this.$emit('logout')

      // pushではなくreplaceを使用して, historyを残さない
      this.$router.replace({ query })
    }
  }
}
</script>
