<template>
  <div>
    <NavbarKabuka />
    <b-container class="mt-3 mb-3">
      <nuxt />
      <Footer class="mt-3" />
    </b-container>
  </div>
</template>

<script>
import NavbarKabuka from '~/components/NavbarKabuka'
import Footer from '~/components/Footer'

export default {
  components: {
    NavbarKabuka,
    Footer
  }
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
