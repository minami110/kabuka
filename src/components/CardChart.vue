<template>
  <b-card>
    <b-card-title>
      <h5>
        <span>🥬🥬 Kabu Chart 🥬🥬</span>
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
      <line-chart :chartdata="chartdata" :options="options" style="height:400px" />
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

// import components
import LineChart from "~/components/LineChart";

export default {
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // 凡例
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 20
          }
        },
        // 軸
        scales: {
          xAxes: [
            {
              ticks: {
                // AM , PM を除外して, 日付のみ表示する
                userCallback: function(label, index, labels) {
                  if (index % 2 == 0) {
                    return label.split(" ")[0];
                  }
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                // メモリに小数点を絶対に表示させない
                userCallback: function(label, index, labels) {
                  if (Math.floor(label) === label) {
                    return label;
                  }
                }
              }
            }
          ]
        }
      },
      state: {
        bMounted: false
      }
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
  components: {
    LineChart
  },
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
      if (!this.state.bMounted) {
        return true;
      } else if (this.store_bFetchingKabuValues) {
        return true;
      } else {
        return false;
      }
    },
    chartdata() {
      const result = {};

      // userのデータが読み取れなかったら, return
      if (Object.keys(this.users).length < 1) {
        return result;
      }

      // 期間内の, ラベルのリストを取得
      result.labels = this.getChartLabelList();
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
      result.datasets = [];
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

        // 最終のデータを作成する
        const _userLabel = user.name + "@" + user["Island Name"];
        const _data = {
          label: _userLabel,
          borderColor: user.color,
          backgroundColor: "rgba(0, 0, 0, 0)",
          spanGaps: true,
          lineTension: 0,
          data: __d
        };

        result.datasets.push(_data);
      }

      // ユーザーが購入した価格のデータを入力
      /*
      result.datasets.push({
        label: "購入価格",
        borderColor: "#366",
        backgroundColor: "rgba(0 ,0,0,0)",
        spanGaps: true,
        lineTension: 0,
        data: [200, , , , , , , , , , , 200]
      });
      */

      return result;
    }
  },
  methods: {
    getChartLabelList() {
      // propsから, ラベルを作成
      // AM / PMごとにラベルを作成する
      const result = [];
      const _labelTotalCount = 7 * this.weekCount * 2;
      for (var i = 0; i < _labelTotalCount; i++) {
        const _dayDelta = i / 2;
        const _d = add(this.beginDay, { days: _dayDelta });
        let _ds = format(_d, "M/d(E)");
        if (i % 2) {
          _ds += " PM";
        } else {
          _ds += " AM";
        }
        result.push(_ds);
      }
      return result;
    }
  },
  async mounted() {
    await this.$store.dispatch("kabuValues/getKabuValues");
    this.state.bMounted = true;
  }
};
</script>