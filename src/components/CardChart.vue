<template>
  <b-card>
    <b-card-title>
      <h5>
        <span>
          Kabu Chart
          <b-badge class="small">beta</b-badge>
        </span>
        <span>:</span>
        <span>{{ monday }}</span>
        <span>~</span>
        <span>{{ saturday }}</span>
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
import isSameWeek from "date-fns/isSameWeek";
import getDay from "date-fns/getDay";

// import components
import LineChart from "~/components/LineChart";

export default {
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      state: {
        bMounted: false
      }
    };
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
    monday() {
      const sunday = startOfWeek(new Date());
      const day = add(sunday, { days: 1 });
      return format(day, "M/d");
    },
    saturday() {
      const sunday = startOfWeek(new Date());
      const day = add(sunday, { days: 6 });
      return format(day, "M/d");
    },
    isFetchingKabuValues() {
      if (!this.state.bMounted) {
        return true;
      }
      if (this.store_bFetchingKabuValues) {
        return true;
      }

      return false;
    },
    chartdata() {
      const result = {};

      // userのデータが読み取れなかったら, return
      if (Object.keys(this.users).length < 1) {
        return result;
      }

      // chartの開始の日曜日を設定
      const sunday = startOfWeek(new Date());

      const deltaOneDay = { days: 1 };
      const monday = add(sunday, deltaOneDay);
      const tuesday = add(monday, deltaOneDay);
      const wednesday = add(tuesday, deltaOneDay);
      const thursday = add(wednesday, deltaOneDay);
      const friday = add(thursday, deltaOneDay);
      const saturday = add(friday, deltaOneDay);

      // 月曜から 土曜まで AM, PMごとにラベルを作成
      result.labels = [
        format(monday, "M/dd"),
        "",
        format(tuesday, "M/dd"),
        "",
        format(wednesday, "M/dd"),
        "",
        format(thursday, "M/dd"),
        "",
        format(friday, "M/dd"),
        "",
        format(saturday, "M/dd"),
        ""
      ];

      // 上記の範囲内のデータセットを抽出
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

        // 開始の日曜日と同じ週であれば, データセットに追加
        isSameWeek(parsedDate, sunday);
        {
          kabuValuesInChart.push(kabuValue);
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

      // ユーザーのユーザーの色を取得する関数
      function getUserColor(userid) {
        if (userid == 2) {
          return "#345678";
        } else if (userid == 6) {
          return "#993333";
        } else if (userid == 10) {
          return "#076245";
        } else {
          return "#ccc";
        }
      }

      // ユーザーごとにデータセットを作成
      result.datasets = [];
      for (const user_id in kabuValueEachUsers) {
        const user = this.users[user_id];

        // ラベルの数だけデータを作成する
        const __d = [];
        for (var i = 0; i < 12; i++) {
          const value = kabuValueEachUsers[user_id][i];
          if (value) {
            __d.push(value);
          } else {
            __d.push(null);
          }
        }
        const _data = {
          label: user.name,
          borderColor: getUserColor(user_id),
          spanGaps: true,
          lineTension: 0,
          data: __d
        };

        result.datasets.push(_data);
      }

      // ユーザーが購入した価格のデータを入力
      result.datasets.push({
        label: "購入価格",
        borderColor: "#366",
        backgroundColor: "rgba(0 ,0,0,0)",
        spanGaps: true,
        lineTension: 0,
        data: [200, , , , , , , , , , , 200]
      });

      return result;
    }
  },
  async mounted() {
    await this.$store.dispatch("kabuValues/getKabuValues");
    this.state.bMounted = true;
  }
};
</script>