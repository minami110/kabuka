<template>
  <b-card>
    <b-card-title>
      <h5>
        <span>🥬🥬 Kabu Chart 🥬🥬</span>
        <span>:</span>
        <span>{{ beginDayStr }}</span>
        <span>~</span>
        <span>{{ endDayStr }}</span>
        <span class="small text-muted">(W-{{ weekIndex }})</span>
      </h5>
    </b-card-title>

    <div>
      <line-chart
        :chart-data="chartdata"
        :options="options"
        style="height:380px"
      />
    </div>
  </b-card>
</template>

<script>
// import vuex functions
import { mapGetters } from 'vuex'

// import date-fns functions
import format from 'date-fns/format'
import add from 'date-fns/add'
import getDay from 'date-fns/getDay'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import addWeeks from 'date-fns/addWeeks'

// import components
import LineChart from '~/components/LineChart'

export default {
  components: {
    LineChart
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // 凡例
        legend: {
          position: 'bottom',
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
                userCallback(label, index, labels) {
                  if (index % 2 === 0) {
                    return label.split(' ')[0]
                  }
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                // メモリに小数点を絶対に表示させない
                userCallback(label, index, labels) {
                  if (Math.floor(label) === label) {
                    return label
                  }
                }
              }
            }
          ]
        }
      },
      chartdata: {}
    }
  },
  computed: {
    ...mapGetters({
      users: 'users/users',
      kabuValues: 'kabuValues/kabuValues',
      store_bFetchingKabuValues: 'kabuValues/bFetchingKabuValues',
      weekIndex: 'kabuValues/weekIndex'
    }),
    beginDay() {
      return addWeeks(new Date(2020, 2, 15), this.weekIndex)
    },
    beginDayStr() {
      // weekIndexに基づいて 開始日を求める
      return format(this.beginDay, 'M/d')
    },
    endDayStr() {
      // weekIndexに基づいて 終了日を求める
      const endDay = addWeeks(new Date(2020, 2, 14), this.weekIndex + 1)
      return format(endDay, 'M/d')
    }
  },
  watch: {
    // vuexでKabuValuesの更新がかかると呼ばれる関数
    kabuValues(val) {
      // チャートデータを更新する
      this.updateChartData()
    },
    // vuexでweekIndexが変更されると呼ばれる関数
    weekIndex(val) {
      this.updateChartData()
    }
  },
  mounted() {
    // APIから全カブデータ取得
    this.$store.dispatch('kabuValues/getKabuValues')
  },
  methods: {
    getChartLabelList() {
      // propsから, ラベルを作成
      // AM / PMごとにラベルを作成する
      const result = []
      const _labelTotalCount = 14
      for (let i = 0; i < _labelTotalCount; i++) {
        const _dayDelta = i / 2
        const _d = add(this.beginDay, { days: _dayDelta })
        let _ds = format(_d, 'M/d(E)')
        if (i % 2) {
          _ds += ' PM'
        } else {
          _ds += ' AM'
        }
        result.push(_ds)
      }
      return result
    },
    // チャートのデータを更新する関数
    updateChartData() {
      const result = {}

      // userのデータが読み取れなかったら, return
      if (Object.keys(this.users).length < 1) {
        return
      }

      // kabuValuesが空なら, return
      if (this.kabuValues.length < 1) {
        return
      }

      // 期間内の, ラベルのリストを取得
      result.labels = this.getChartLabelList()

      // 上記の範囲内のデータセットを抽出する
      const kabuValuesInChart = []

      for (const kabuValueId in this.kabuValues) {
        const kabuValue = this.kabuValues[kabuValueId]

        // 集計日付の範囲外ならcontinue
        // beginDay, endDayの範囲内であれば, データセットに追加
        const endDay = add(this.beginDay, { days: 7 })
        if (isAfter(kabuValue.date, add(this.beginDay, { hours: -1 }))) {
          if (isBefore(kabuValue.date, endDay)) {
            kabuValuesInChart.push(kabuValue)
          }
        }
      }

      // 今週分のデータセットから, ユーザーごとにデータセットを作成
      // 月AM: 0 月PM: 1 火AM:2 ... とデータを作っていく
      const kabuValueEachUsers = {}
      for (const kabuValue of kabuValuesInChart) {
        const userid = kabuValue.userId
        const dayid = getDay(kabuValue.date)
        const isPm = kabuValue.isPm
        const index = dayid * 2 + Number(isPm)

        if (!kabuValueEachUsers[userid]) {
          kabuValueEachUsers[userid] = []
        }
        kabuValueEachUsers[userid][index] = kabuValue.value
      }

      // ユーザーごとにデータセットを作成
      result.datasets = []
      for (const userId in kabuValueEachUsers) {
        const user = this.users[userId]

        // ラベルの数だけデータを作成する
        const __d = []
        for (let i = 0; i < 14; i++) {
          // もしvalueが存在しなければ, nullを代入する
          const value = kabuValueEachUsers[userId][i]
          if (value) {
            __d.push(value)
          } else {
            __d.push(null)
          }
        }

        // 最終のデータを作成する
        const _userLabel = user.name + '@' + user['Island Name']
        const _data = {
          label: _userLabel,
          borderColor: user.color,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          spanGaps: true,
          lineTension: 0,
          data: __d
        }

        result.datasets.push(_data)
      }

      this.chartdata = result
    }
  }
}
</script>
