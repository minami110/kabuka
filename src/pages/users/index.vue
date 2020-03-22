<template>
  <b-container class="mt-3">
    <h1>Kabuka for ACNH</h1>
    <b-card title="members">
      <div class="container">
        <ul>
          <li v-for="user in users" :key="user.id">
            <span>{{user.id}}</span>
            <span>{{user.name}}</span>
            <span>{{user['Island Name']}}</span>
            <span>{{ user.fruits }}</span>
            <span>{{ user.code }}</span>
          </li>
        </ul>
        <button @click="clicked">fetch_member</button>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  async fetch({ store }) {
    //await Promise.all([store.dispatch("sheet/getUsers")]);
  },
  computed: {
    ...mapGetters({
      users_row: "sheet/users"
    }),
    users() {
      return this.users_row;
    }
  },
  methods: {
    clicked() {
      this.$store.dispatch("sheet/getUsers");
    }
  }
};
</script>
