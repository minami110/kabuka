<template>
  <b-row>
    <b-col cols="12" class="text-center text-muted small">
      <span>version: {{ application_version }}</span>
    </b-col>
  </b-row>
</template>

<script>
// import package info
import packageInfo from '~/package.json'
import buildInfo from '~/build_info.json'

export default {
  computed: {
    application_version() {
      return packageInfo.version + '.' + buildInfo.number
    }
  }
}
</script>
