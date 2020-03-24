<template>
  <b-form @submit="submit">
    <b-card>
      <template v-slot:header>
        <h5 class="mb-0">
          <span>{{ dateSundayStr }}</span>
          <span>のカブ購入情報</span>
        </h5>
      </template>

      <h6>カブの購入情報</h6>

      <b-form-row>
        <b-col cols="5">
          <b-input-group size="sm" prepend="$">
            <b-form-input type="number" size="sm" :value="100" readonly></b-form-input>
          </b-input-group>
        </b-col>
        <b-col class="text-center m-auto">
          <span>x</span>
        </b-col>
        <b-col cols="6">
          <b-input-group size="sm" append="カブ">
            <b-form-input type="number" size="sm" readonly></b-form-input>
          </b-input-group>
        </b-col>
      </b-form-row>

      <span class="text-muted small">購入時の値段と, 購入した数を入力</span>

      <b-form-row>
        <b-col cols="12">
          <h6 class="mt-3">🐗のカブ売値</h6>
          <b-input-group size="sm" prepend="$" append="ベル">
            <b-form-input type="number" size="sm" :value="100" readonly></b-form-input>
          </b-input-group>

          <span class="text-muted small">自分の島の, カブ売り値を入力</span>
        </b-col>
      </b-form-row>

      <template v-slot:footer>
        <b-button v-if="state.bSubmitting" block size="sm" variant="primary" disabled>
          <b-spinner small type="grow"></b-spinner>保存中...
        </b-button>
        <b-button v-else block type="submit" size="sm" disabled>工事中</b-button>
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