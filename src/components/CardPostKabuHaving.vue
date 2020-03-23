<template>
  <b-form @submit="submit" class="mt-3">
    <b-card>
      <template v-slot:header>
        <h4 class="mb-0">
          <span>{{ dateSundayStr }}</span>
          <span>のカブ購入情報</span>
        </h4>
      </template>

      <h5>カブの購入情報</h5>

      <b-form-row>
        <b-col cols="4">
          <b-input-group size="sm" prepend="$">
            <b-form-input type="number" size="sm" :value="100"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="2" class="text-center">
          <span>x</span>
        </b-col>
        <b-col cols="4">
          <b-input-group size="sm" append="カブ">
            <b-form-input type="number" size="sm"></b-form-input>
          </b-input-group>
        </b-col>
      </b-form-row>

      <span class="text-muted small">購入時の値段と, 購入した数を入力</span>

      <b-form-row>
        <b-col cols="12" md="6">
          <h5 class="mt-3">ウリ🐗のカブ売値</h5>
          <b-input-group size="sm" prepend="$">
            <b-form-input type="number" size="sm" :value="100"></b-form-input>
          </b-input-group>

          <span class="text-muted small">自分の島の, カブ売り値を入力</span>
        </b-col>
      </b-form-row>

      <template v-slot:footer>
        <b-button v-if="state.bSubmitting" size="sm" variant="primary" disabled>
          <b-spinner small type="grow"></b-spinner>送信中...
        </b-button>
        <b-button v-else type="submit" size="sm" variant="primary" disabled>工事中です</b-button>
      </template>
    </b-card>
  </b-form>
</template>

<script>
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import ja from "date-fns/locale/ja";

export default {
  data() {
    return {
      state: {
        bSubmitting: false
      }
    };
  },
  computed: {
    dateSundayStr() {
      const sunday = startOfWeek(new Date());
      let dateStr = format(sunday, "MM/dd (E)", { locale: ja });
      return dateStr;
    }
  },
  methods: {
    async submit(e) {}
  }
};
</script>