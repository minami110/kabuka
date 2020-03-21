<template>
  <section class="section">
  <!--  (...省略...) -->
  </section>
</template>

<script>
export default {
  name: 'sheettest',
  data () {
    return {
      // (...省略...)
    }
  },
  // 以下のようにfetchで使用可
  // ただし、googleapiはサーバーサイドでのみ動作するため、
  // コンポーネント内で定義したmethodからは呼べない 
  // 以下はstore/sheet.js に各メソッドを書いた想定
  async fetch ({ store }) {
    await store.dispatch('sheet/getSheetsData')
    await store.dispatch('sheet/addData')
    await store.dispatch('sheet/updateData')
    await store.dispatch('sheet/deleteData')
  },
  methods: {
    // (...省略...)
  }
}
</script>