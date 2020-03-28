<template>
  <b-card>
    <b-row>
      <b-col cols="12">
        <card-post-kabu-value :now="now" />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
// import components
import CardPostKabuValue from '~/components/CardPostKabuValue'

export default {
  components: {
    CardPostKabuValue
  },
  data() {
    return {}
  },
  computed: {
    now() {
      return new Date()
    }
  }
}
</script>
