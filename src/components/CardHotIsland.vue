<template>
  <b-card>
    <b-card-title>
      <h5>
        <span>🔥🔥 Hot Island 🔥🔥</span>
        <span>:</span>
        <span>{{ beginDayStr }}</span>
        <span>~</span>
        <span>{{ endDayStr }}</span>
        <span class="small text-muted">(W-{{ weekIndex }})</span>
      </h5>
    </b-card-title>

    <div>
      <!-- 型が確定している島のリスト -->
      <!-- ソートができる, ピークが近い順, 買取価格が高い順 -->

      <b-nav
        class="mt-3 border-bottom border-secondary"
        small
        pills
        style="font-size:0.5rem"
      >
        <b-nav-item
          :active="state.tableIndex == 0"
          @click="state.tableIndex = 0"
          >🔥 アツいしま</b-nav-item
        >
        <b-nav-item
          :active="state.tableIndex == 1"
          @click="state.tableIndex = 1"
          >👀 全データ</b-nav-item
        >
        <b-nav-item
          :active="state.tableIndex == 2"
          @click="state.tableIndex = 2"
          >📖 用語集</b-nav-item
        >
      </b-nav>

      <div v-show="state.tableIndex == 0">
        <div v-if="items_next.length">
          <b-table
            striped
            hover
            dark
            small
            :items="items_next"
            :fields="fields_next"
            style="fontsize:0.8rem"
          ></b-table>
        </div>
        <div v-else class="p-3 text-muted small text-center">
          😢😢 現在アツいしまはないようです... 😢😢
        </div>
      </div>

      <div v-show="state.tableIndex == 1">
        <div v-if="items_all.length">
          <b-table
            striped
            hover
            dark
            small
            :items="items_all"
            :fields="fields_next"
            style="font-size:0.8rem"
          ></b-table>
        </div>
        <div v-else class="p-3 text-muted small text-center">
          😢😢 現在しまはないようです... 😢😢
        </div>
      </div>

      <div v-show="state.tableIndex == 2" class="text-muted small p-3 ">
        <h5 class="mt-1">ピーク</h5>
        <li>一週間のうちで, カブが最高値をつける瞬間</li>
        <li>ピークをすぎると下降しかしないため, ピークに売るのが吉</li>
        <li>ピークが存在するのは, 三期型と四期型のみ</li>

        <h5 class="mt-3">カブの値動き</h5>
        <li>
          つぶきち, まめきちが買い取ってくれるカブの値段は, 日曜日以外のAM,
          PMごとに値段が変動する
        </li>
        <li>
          <strong>日曜日の販売価格, 月曜AMの買取価格</strong>を入力することで,
          値動きのパターンが判明する
        </li>
        <li>カブの値動きのパターンは, 以下の4パターンしか存在しない</li>

        <h5 class="mt-5">三期型(P3)</h5>
        <li>最も高いカブ買取値を期待できる値動きのパターン</li>
        <li>
          🐗の販売価格の
          <strong>2~6倍</strong>が期待できる💰
        </li>
        <li>必ずピークで売却すべし, できれば友達も招待するべし</li>

        <h5 class="mt-3">四期型(P4)</h5>
        <li>ほどほどのカブ買取値を期待できる値動きのパターン</li>
        <li>🐗の販売価格の1.5~2倍が期待できる</li>
        <li>なるべくピークで売却すべし, できれば友達も招待するべし</li>

        <h5 class="mt-3">波型(wave)</h5>
        <li>特にピークが存在せず, 低額の上下を繰り返す値動きのパターン</li>
        <li>
          期待せずに, 買値を超えていたら売却してしまうか,
          他の村で売ってしまうべし
        </li>

        <h5 class="mt-3">ジリ貧型(poor)</h5>
        <li>値下がりしかしない最悪のパターン😢</li>
        <li>
          木曜PMまではP3, P4に変動する可能性があるので,
          諦めずに販売価格を眺めよう
        </li>
      </div>

      <b-card class="mt-4">
        <h5>🏝️🏝️ {{ loginuser.islandName }}島の値動きは... 🏝️🏝️</h5>

        <div v-if="isExistLoginuserPred">
          <div v-if="preds[loginuser.id].movingTypes.length == 4">
            まだ未確定です
          </div>
          <div v-else-if="preds[loginuser.id].movingTypes.length > 1">
            <strong
              v-for="type in preds[loginuser.id].movingTypes"
              :key="type"
              >{{ type + ', ' }}</strong
            >
            のどれかだとみています
          </div>
          <div v-else>
            今週は
            <strong>{{ preds[loginuser.id].movingTypes[0] }}</strong>
            で確定!
            <!-- ピークがあるタイプ -->
            <div
              v-if="preds[loginuser.id].getMinExpectedValue()"
              class="text-muted small"
            >
              <li>
                {{ preds[loginuser.id].getMinExpectedValue() }} ~
                {{ preds[loginuser.id].getMaxExpectedValue() }}ベルの範囲で,
                {{ getLoginuserPeekTime }} にピークを迎えそうです
              </li>
            </div>
            <div v-else class="text-muted small">
              <li>ピークがないので, 早めに売ってしまいましょう</li>
            </div>
          </div>

          <div
            v-if="preds[loginuser.id].advices.length > 0"
            class="mt-3 small text-muted"
          >
            <h5>つぎにやることは...?</h5>
            <li
              v-for="(advice, index) in preds[loginuser.id].advices"
              :key="index"
            >
              {{ advice }}
            </li>
          </div>
        </div>
        <div v-else class="small text-muted">
          <li>まだ今週のカブデータがないので予測できませんでした...</li>
          <li>日曜の🐗カブ販売値, 月曜AMの🐻カブ買取値を入力!</li>
        </div>
      </b-card>

      <div class="mt-3">
        <b-link
          href="#"
          class="small text-muted"
          @click="state.showAboutThisTable = !state.showAboutThisTable"
          >+ この表について</b-link
        >
        <div v-show="state.showAboutThisTable" class="text-muted small mt-3">
          <ul>
            <li>
              とびだせどうぶつの森の時代のチャートを使用して, カブ買取価格を推定
            </li>
            <li>
              予測には
              <strong>日曜日の🐗販売価格</strong>が必須で,
              <strong>月曜日AMの🐻買取価格</strong>もなるべくほしい
            </li>
            <li>
              飛んでいるデータは補完して推定するため,
              毎日細かく入力する必要はありません
            </li>
            <li>
              抜けているデータが測定に使用された場合, 予測精度が低下します.
            </li>
            <li>結果が複数表示されている場合は, 候補がいくつかある状態です</li>
            <li>
              アツいしまは, これからピークが訪れる, 予測精度の高いしまです
            </li>
            <li>あくまで予測なので, 参考程度に</li>
          </ul>
        </div>
      </div>
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
import getHours from 'date-fns/getHours'
import addWeeks from 'date-fns/addWeeks'
import differenceInWeeks from 'date-fns/differenceInWeeks'

//
import { Detector } from '~/plugins/kabu_detector'

export default {
  components: {},
  data() {
    return {
      state: {
        showAboutThisTable: false,
        tableIndex: 0
      },

      fields_next: [
        {
          key: 'peek',
          label: 'ピーク',
          sortable: true
        },

        {
          key: 'type',
          label: '値動き',
          sortable: true
        },
        {
          key: 'predValue',
          label: '💰',
          sortable: true
        },
        {
          key: 'userId',
          label: '🏝️',
          sortable: false
        },
        {
          key: 'ambiguous_weight',
          label: '精度',
          sortable: true
        }
      ],

      preds: {}
    }
  },
  computed: {
    ...mapGetters({
      users: 'users/users',
      loginuser: 'users/loginuser',
      kabuValues: 'kabuValues/kabuValues',
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
    },
    get_current_time_index() {
      // weekIndexが最新週であれば以下を, そうでなければ常に13を返す
      const ZeroDay = new Date(2020, 2, 15)
      const now = new Date()
      const currentWeekIndex = differenceInWeeks(now, ZeroDay)
      if (currentWeekIndex === this.weekIndex) {
        const dayid = getDay(new Date()) // 日曜なら0
        const hour = getHours(new Date())
        const isPm = hour > 11 ? 1 : 0
        return dayid * 2 + isPm
      } else {
        return 13
      }
    },
    // loginuserの予想データが存在するかどうか
    isExistLoginuserPred() {
      const loginuserid = this.loginuser.id
      if (this.preds[loginuserid]) {
        return true
      }
      return false
    },
    getLoginuserPeekTime() {
      const loginuserid = this.loginuser.id
      if (!this.preds[loginuserid]) {
        return 'N/A'
      }

      const lupeeklist = this.preds[loginuserid].peeks
      // peekを日付に変更する関数
      const getpeekstr = (timeIndex) => {
        // もしtimeIndexがnullなら, ピークなし
        if (!timeIndex) {
          return 'ピークなし'
        }
        // 今のTimeインデックスを取得
        const currentTimeIndex = this.get_current_time_index
        const peekdelta = timeIndex - currentTimeIndex
        const deltaDay = Math.floor(peekdelta / 2)
        const helfDay = peekdelta % 2
        const peekDate = add(new Date(), {
          days: deltaDay,
          hours: helfDay ? 12 : 0
        })
        const dateStr = format(peekDate, 'M/d (E)')
        const isPmStr = getHours(peekDate) > 12 ? 'PM' : 'AM'
        const peekStr = dateStr + ' ' + isPmStr

        return peekStr
      }

      // peekリストを作成
      const peeklist = []

      for (const peek of lupeeklist) {
        peeklist.push(getpeekstr(peek))
      }

      return peeklist
    },
    // next up に乗せるデータたち
    items_next() {
      const result = []

      for (const userId in this.preds) {
        const pred = this.preds[userId]

        // 入力精度が低い島は弾く
        if (pred.ambiguous_weight > 15) {
          continue
        }

        // typeが確定している島だけにする
        if (pred.movingTypes.length !== 1) {
          continue
        }

        // ピーク予想が一つの島だけにする
        if (pred.peeks.length !== 1) {
          continue
        }

        // 今のTimeインデックスを取得
        const currentTimeIndex = this.get_current_time_index

        // これからくるpeekの島だけ表示する
        const peek = pred.peeks[0]
        if (peek < currentTimeIndex) {
          continue
        }

        // peekを日付に変更する
        const peekdelta = peek - currentTimeIndex
        const deltaDay = Math.floor(peekdelta / 2)
        const helfDay = peekdelta % 2
        const peekDate = add(new Date(), {
          days: deltaDay,
          hours: helfDay ? 12 : 0
        })
        const dateStr = format(peekDate, 'M/d (E)')
        const isPmStr = getHours(peekDate) > 12 ? 'PM' : 'AM'
        const peekStr = dateStr + ' ' + isPmStr

        // お金の期待価格を取得

        const minValue = pred.getMinExpectedValue()
        const maxValue = pred.getMaxExpectedValue()
        let predValueStr = ''
        if (minValue) {
          predValueStr = minValue + ' ~ ' + maxValue
        } else {
          predValueStr = pred.sunday_am + '付近'
        }

        // predtypeを取得
        let predTypeStr = ''
        for (const _i in pred.movingTypes) {
          if (_i > 0) {
            predTypeStr += ', '
          }
          const predtype = pred.movingTypes[_i]
          predTypeStr += predtype
        }

        result.push({
          peek: peekStr,
          type: predTypeStr,
          userId:
            this.users[userId].name + '@' + this.users[userId]['Island Name'],
          predValue: predValueStr,
          ambiguous_weight: 0 - pred.ambiguous_weight
        })
      }
      return result
    },

    // allに
    items_all() {
      const result = []

      for (const userId in this.preds) {
        const pred = this.preds[userId]

        // peekを日付に変更する
        const getpeekstr = (timeIndex) => {
          // もしtimeIndexがnullなら, ピークなし
          if (!timeIndex) {
            return 'ピークなし'
          }
          // 今のTimeインデックスを取得
          const currentTimeIndex = this.get_current_time_index
          const peekdelta = timeIndex - currentTimeIndex
          const deltaDay = Math.floor(peekdelta / 2)
          const helfDay = peekdelta % 2
          const peekDate = add(new Date(), {
            days: deltaDay,
            hours: helfDay ? 12 : 0
          })
          const dateStr = format(peekDate, 'M/d (E)')
          const isPmStr = getHours(peekDate) > 12 ? 'PM' : 'AM'
          const peekStr = dateStr + ' ' + isPmStr

          return peekStr
        }

        // peekリストを作成
        const peeklist = []

        for (const peek of pred.peeks) {
          peeklist.push(getpeekstr(peek))
        }

        // お金の期待価格を取得
        const minValue = pred.getMinExpectedValue()
        const maxValue = pred.getMaxExpectedValue()
        let predValueStr = ''
        if (minValue) {
          predValueStr = minValue + ' ~ ' + maxValue
        } else {
          predValueStr = pred.sunday_am + '付近'
        }

        // predtypeを取得
        let predTypeStr = ''
        for (const _i in pred.movingTypes) {
          if (_i > 0) {
            predTypeStr += ', '
          }
          const predtype = pred.movingTypes[_i]
          predTypeStr += predtype
        }

        result.push({
          peek: peeklist,
          type: predTypeStr,
          userId:
            this.users[userId].name + '@' + this.users[userId]['Island Name'],
          predValue: predValueStr,
          ambiguous_weight: 0 - pred.ambiguous_weight
        })
      }
      return result
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
    this.$store.dispatch('kabuValues/getKabuValues')
  },
  methods: {
    // 今週分のデータだけ取得する関数
    getCurrentWeekData() {
      const result = []

      for (const kabuValueId in this.kabuValues) {
        const kabuValue = this.kabuValues[kabuValueId]

        // 集計日付の範囲外ならcontinue
        // beginDay, endDayの範囲内であれば, データセットに追加
        const endDay = add(this.beginDay, { days: 7 })
        if (isAfter(kabuValue.date, add(this.beginDay, { hours: -1 }))) {
          if (isBefore(kabuValue.date, endDay)) {
            result.push(kabuValue)
          }
        }
      }

      return result
    },
    // vuexのKabuValuesが更新されたら呼ばれるイベント
    updateChartData() {
      // userのデータが読み取れなかったら, return
      if (Object.keys(this.users).length < 1) {
        return
      }

      // 上記の範囲内のデータセットを抽出する
      const currentWeekDataSet = this.getCurrentWeekData()

      // 今週分のデータセットから, ユーザーごとにデータセットを作成
      // 月AM: 0 月PM: 1 火AM:2 ... とデータを作っていく
      const kabuValueEachUsers = {}
      for (const kabuValue of currentWeekDataSet) {
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
      const _preds = {}
      for (const userId in kabuValueEachUsers) {
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

        const timeIndex = this.get_current_time_index

        const pred = Detector.Detect(__d, timeIndex)
        _preds[userId] = pred
      }

      this.preds = _preds
    }
  }
}
</script>
