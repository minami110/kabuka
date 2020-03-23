<template>
  <b-card>
    <b-card-title>
      <span>Kabu Chart:</span>
      <span>{{ monday }}</span>
      <span>~</span>
      <span>{{ saturday }}</span>
    </b-card-title>

    <b-img-lazy fluid src="https://blog-imgs-45.fc2.com/n/i/g/nigoyama/HNI_0017_JPG.jpg" />
  </b-card>
</template>

<script>
import startOfWeek from "date-fns/startOfWeek";
import add from "date-fns/add";

export default {
  data() {
    return {};
  },
  computed: {
    monday() {
      const sunday = startOfWeek(new Date());
      const day = add(sunday, { days: 1 });
      return this.$date_fns(day, "MM/dd");
    },
    saturday() {
      const sunday = startOfWeek(new Date());
      const day = add(sunday, { days: 6 });
      return this.$date_fns(day, "MM/dd");
    }
  }
};
</script>