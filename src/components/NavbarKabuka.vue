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
      <b-navbar-nav v-if="isLogginned" small>
        <b-nav-item @click="prevWeek">
          <b-icon-caret-left-fill />
        </b-nav-item>
        <b-nav-item disabled>W-{{ weekIndex }}</b-nav-item>
        <b-nav-item @click="nextWeek">
          <b-icon-caret-right-fill />
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav v-if="isLogginned" class="ml-auto" small>
        <b-nav-item-dropdown right size="sm">
          <!-- Using 'button-content' slot -->
          <template #button-content>{{ getUserNameAndIslandName }}</template>
          <b-dropdown-item to="settings">設定</b-dropdown-item>
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

import {
  BIconThreeDots,
  BIconCaretLeftFill,
  BIconCaretRightFill
} from 'bootstrap-vue'

export default {
  components: {
    BIconThreeDots,
    BIconCaretLeftFill,
    BIconCaretRightFill
  },
  computed: {
    ...mapGetters({
      loginuser: 'users/loginuser',
      weekIndex: 'kabuValues/weekIndex'
    }),
    isLogginned() {
      if (this.loginuser) {
        if (this.loginuser.id && this.loginuser.name) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    getUserNameAndIslandName() {
      if (this.isLogginned) {
        return `${this.loginuser.name}@${this.loginuser.islandName}島`
      }
      return '名無し'
    }
  },
  methods: {
    logout(e) {
      e.preventDefault()

      this.$store
        .dispatch({
          type: 'users/logout'
        })
        .then((r) => {
          if (r) {
            // user queryを削除
            const query = { ...this.$route.query }
            delete query.user

            // logout-eventをemit
            this.$emit('logout')

            // pushではなくreplaceを使用して, historyを残さない
            this.$router.replace({ query })
          }
        })
    },
    prevWeek(e) {
      e.preventDefault()
      this.$store.dispatch({
        type: 'kabuValues/DecrementWeekIndex'
      })
      this.$store.dispatch('kabuValues/getKabuValues')
    },
    nextWeek(e) {
      e.preventDefault()
      this.$store.dispatch({
        type: 'kabuValues/IncrementWeekIndex'
      })
    }
  }
}
</script>
