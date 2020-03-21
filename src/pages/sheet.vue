<template>
  <div>
    <p v-for="user in users" :key="user.id">
      <span>{{ user.id }}</span>
      <span>{{ user.name }}</span>
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Sheettest",
  // 以下のようにfetchで使用可
  // ただし、googleapiはサーバーサイドでのみ動作するため、
  // コンポーネント内で定義したmethodからは呼べない
  // 以下はstore/sheet.js に各メソッドを書いた想定
  async fetch({ store }) {
    await store.dispatch("sheet/getSheetsData");
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      users: "sheet/users"
    })
  },
  methods: {}
};
</script>
