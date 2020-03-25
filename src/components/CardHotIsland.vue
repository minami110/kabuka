<template>
  <b-card>
    <b-card-title>
      <h5>
        <span>
          🔥🔥 Hot Island 🔥🔥
          <b-badge class="small">beta</b-badge>
        </span>
        <span>:</span>
        <span>{{ beginDayStr }}</span>
        <span>~</span>
        <span>{{ endDayStr }}</span>
        <span class="small text-muted">(Week: 1)</span>
      </h5>
    </b-card-title>

    <div v-if="isFetchingKabuValues">
      <b-col cols="12" class="text-center">
        <strong>カブ値のデータを読込中...</strong>
        <b-spinner small label="Spinning"></b-spinner>
      </b-col>
    </div>
    <div v-else>
      <div class="text-muted small">
        <li>とびだせどうぶつの森のカブチャートを使用</li>
        <li>あくまで予測なので, 参考程度に</li>
      </div>
      <!-- 型が確定している島のリスト -->
      <!-- ソートができる, ピークが近い順, 買取価格が高い順 -->

      <b-card class="mt-3">
        <h5>予測</h5>
        <b-table striped hover dark small :items="items_next" :fields="fields_next"></b-table>
      </b-card>
    </div>
  </b-card>
</template>

<script>
// import vuex functions
import { mapGetters } from "vuex";

// import date-fns functions
import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import add from "date-fns/add";
import parse from "date-fns/parse";
import getDay from "date-fns/getDay";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import getHours from "date-fns/getHours";

//
import { Detector } from "~/plugins/kabu_detector";

export default {
  data() {
    return {
      state: {},

      fields_next: [
        {
          key: "peek",
          label: "ピークの時間",
          sortable: true
        },
        {
          key: "userId",
          label: "ユーザー",
          sortable: false
        },
        {
          key: "type",
          sortable: false
        },
        {
          key: "ambiguous_weight",
          label: "正確さ",
          sortable: true
        }
      ],

      preds: {}
    };
  },
  props: {
    // chartの開始日, デフォルトは今週の日曜日
    beginDay: {
      type: Date,
      default: () => startOfWeek(new Date())
    },
    // chartの表示期間(1週間単位)
    weekCount: {
      type: Number,
      default: 1
    }
  },
  components: {},
  computed: {
    ...mapGetters({
      users: "users/users",
      kabuValues: "kabuValues/kabuValues",
      store_bFetchingKabuValues: "kabuValues/bFetchingKabuValues"
    }),
    beginDayStr() {
      return format(this.beginDay, "M/d");
    },
    endDayStr() {
      const day = add(this.beginDay, { days: 7 * this.weekCount - 1 });
      return format(day, "M/d");
    },
    isFetchingKabuValues() {
      if (this.store_bFetchingKabuValues) {
        return true;
      } else {
        return false;
      }
    },

    // next up に乗せるデータたち
    items_next() {
      // 今のTimeインデックスを取得
      const dayid = getDay(new Date()); // 日曜なら0
      const hour = getHours(new Date());
      const isPm = hour > 11 ? 1 : 0;
      const timeIndex = dayid * 2 + isPm;

      const result = [];
      for (const userId in this.preds) {
        const pred = this.preds[userId];
        result.push({
          peek: pred.peek < 2 ? "未確定" : pred.peek - timeIndex + "後",
          type: pred.movingTypes,
          userId: this.users[userId].name,
          ambiguous_weight: 20 - pred.ambiguous_weight
        });
      }
      return result;
    }
  },
  methods: {
    // vuexのKabuValuesが更新されたら呼ばれるイベント
    updateChartData() {
      // userのデータが読み取れなかったら, return
      if (Object.keys(this.users).length < 1) {
        return;
      }

      // 期間内の, ラベルのリストを取得
      const _labelTotalCount = 7 * this.weekCount * 2; // あとでつかう

      // 上記の範囲内のデータセットを抽出する
      const kabuValuesInChart = [];

      for (const kabuValueId in this.kabuValues) {
        const kabuValue = this.kabuValues[kabuValueId];

        // 集計日付の範囲外ならcontinue
        // Mon Mar 23 2020 00:00:00 GMT+0900 (日本標準時)
        // という形式で来る
        let dateStr = kabuValue.date;
        dateStr = dateStr.split(" GMT")[0];
        const parsedDate = parse(
          dateStr,
          "EEE MMM dd yyyy HH:mm:ss",
          new Date()
        );

        // beginDay, endDayの範囲内であれば, データセットに追加
        const endDay = add(this.beginDay, { days: 7 * this.weekCount });
        if (isAfter(parsedDate, add(this.beginDay, { days: -1 }))) {
          if (isBefore(parsedDate, endDay)) {
            kabuValuesInChart.push(kabuValue);
          }
        }
      }

      // 今週分のデータセットから, ユーザーごとにデータセットを作成
      // 月AM: 0 月PM: 1 火AM:2 ... とデータを作っていく
      const kabuValueEachUsers = {};
      for (const kabuValue of kabuValuesInChart) {
        const userid = kabuValue.userId;

        let dateStr = kabuValue.date;
        dateStr = dateStr.split(" GMT")[0];
        const parsedDate = parse(
          dateStr,
          "EEE MMM dd yyyy HH:mm:ss",
          new Date()
        );

        const dayid = getDay(parsedDate);
        const isPm = kabuValue.isPm;
        const index = dayid * 2 + Number(isPm);

        if (!kabuValueEachUsers[userid]) {
          kabuValueEachUsers[userid] = [];
        }
        kabuValueEachUsers[userid][index] = kabuValue.value;
      }

      // ユーザーごとにデータセットを作成
      const _preds = {};
      for (const user_id in kabuValueEachUsers) {
        const user = this.users[user_id];

        // ラベルの数だけデータを作成する
        const __d = [];
        for (var i = 0; i < _labelTotalCount; i++) {
          // もしvalueが存在しなければ, nullを代入する
          const value = kabuValueEachUsers[user_id][i];
          if (value) {
            __d.push(value);
          } else {
            __d.push(null);
          }
        }

        // 今のTimeインデックスを取得
        const dayid = getDay(new Date()); // 日曜なら0
        const hour = getHours(new Date());
        const isPm = hour > 11 ? 1 : 0;
        const timeIndex = dayid * 2 + isPm;

        // このデータをもとに, 予測を行う
        const pred = Detector.detect_v_tobimori(__d, timeIndex);
        _preds[user_id] = pred;
      }

      this.preds = _preds;
    }
  },
  async mounted() {
    this.$store.dispatch("kabuValues/getKabuValues");
  },
  watch: {
    store_bFetchingKabuValues: function(val) {
      if (!val) {
        if (!this.state.bSubmitting) {
          // update form.value
          this.updateChartData();
        }
      }
    }
  }
};
</script>