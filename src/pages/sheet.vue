<template>
  <b-container class="mt-3">
    <h1>Kabuka for ACNH</h1>
    <b-card title="members">
      <div class="container">
        <ul>
          <li v-for="user in users" :key="user.id">
            <span>{{user.id}} {{user.name}}</span>
          </li>
        </ul>
        <button @click="clicked">data_test</button>
        <span>{{ counter }}</span>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      counter: 1
    };
  },
  async fetch({ store }) {
    await Promise.all([store.dispatch("sheet/getUsers")]);
  },
  computed: {
    ...mapGetters({
      users: "sheet/users"
    })
  },
  methods: {
    clicked() {
      this.counter += 1;
    }
  }
};
</script>
