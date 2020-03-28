import format from 'date-fns/format'
import parse from 'date-fns/parse'
import setHours from 'date-fns/setHours'
import differenceInWeeks from 'date-fns/differenceInWeeks'

// 現在のweekIndexを取得する関数, 20/03/22 を 1とする
const GetNowWeekIndex = () => {
  const ZeroDay = new Date(2020, 2, 15)
  const now = new Date()
  return differenceInWeeks(now, ZeroDay)
}

// GASのレスポンスをValidationする関数
const validKabuValue = (json) => {
  const dataRaw = json

  try {
    // dateを date_fns オブジェクトにする
    // Mon Mar 23 2020 00:00:00 GMT+0900 (日本標準時)
    // という形式で来る
    let dateStr = dataRaw.date
    dateStr = dateStr.split(' GMT')[0]
    let parsedDate = parse(dateStr, 'EEE MMM dd yyyy HH:mm:ss', new Date())

    // isPmをbooleanにする
    const isPmBool = Boolean(Number(dataRaw.isPm))

    // ついでにdateも午後か午前かの情報を入れておく
    if (isPmBool) {
      parsedDate = setHours(parsedDate, 13)
    } else {
      parsedDate = setHours(parsedDate, 1)
    }

    // userIdをstrにする
    // 現状数字だけれど, uuidのような形式がきてもいいようにする
    const userIdNum = String(dataRaw.userId)

    // valueをnumberにする
    const valueNum = Number(dataRaw.value)

    // オブジェクトを作成する
    return {
      id: dataRaw.id,
      date: parsedDate,
      isPm: isPmBool,
      userId: userIdNum,
      value: valueNum
    }
  } catch (e) {
    return null
  }
}

export const state = () => ({
  // idごとにkabuValueオブジェクトが入っている
  kabuValues: {},

  // 現在APIと通信を行っているかどうかのフラグ
  bFetchingKabuValues: false,

  // アプリケーションで共通の, 現在表示している週のインデックス
  // 20/3/22 が 1
  weekIndex: 1,

  // 現在表示しているweek
  currentWeekKabuValuesByUsers: {}
})

export const getters = {
  kabuValues: (state) => {
    return state.kabuValues
  },
  bFetchingKabuValues: (state) => {
    return state.bFetchingKabuValues
  },
  // チャートなどの表示が週単位で, そこのIndex
  // 3/22~ を 1とする
  weekIndex: (state) => {
    return state.weekIndex
  }
}

export const mutations = {
  state_init(state) {
    state.bFetchingKabuValues = false
    state.weekIndex = GetNowWeekIndex()
  },
  set_kabuValues(state, datas) {
    for (const index in datas) {
      // convert GAS got objects to valid object data
      const kabuValue = validKabuValue(datas[index])
      if (kabuValue) {
        state.kabuValues = { ...state.kabuValues, [kabuValue.id]: kabuValue }
      }
    }
  },
  set_kabuValue(state, data) {
    const kabuValue = validKabuValue(data)
    if (kabuValue) {
      state.kabuValues = { ...state.kabuValues, [kabuValue.id]: kabuValue }
    }
  },
  // APIと通信中かどうかのフラグを設定する
  set_bFetchingKabuValues(state, bool) {
    state.bFetchingKabuValues = bool
  },
  // 週のIndexを一つ前へ
  DecrementWeekIndex(state) {
    state.weekIndex = Math.max(1, state.weekIndex - 1)
  },
  // 週のIndexを一つ後へ
  IncrementWeekIndex(state) {
    state.weekIndex = Math.min(GetNowWeekIndex(), state.weekIndex + 1)
  }
}

export const actions = {
  // このモジュールを初期化する
  Init({ commit }) {
    commit('state_init')
  },

  // APIと通信を行う
  async getKabuValues({ state, commit }) {
    if (state.bFetchingKabuValues) {
      // already fetching
      return
    }

    // set fetching flag
    commit('set_bFetchingKabuValues', true)

    // GAS API endpoint
    // let url = "/api-user/";
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let kabuValues = []

    const url =
      'https://script.google.com/macros/s/AKfycbxmf6MCX6ClhQzd0ZgEr0UOBfRRR6U7aSf4QfLvcneMHIMXbXI/exec'
    await fetch(url, options)
      .catch((e) => {
        throw new Error(e)
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((responseAsJson) => {
        kabuValues = responseAsJson
      })
      .catch(function(error) {
        console.log('Looks like there was a problem: \n', error)
      })

    // update store
    if (kabuValues.length > 0) {
      commit('set_kabuValues', kabuValues)
    }

    // set fetching flag
    commit('set_bFetchingKabuValues', false)
  },

  async postKabuValue(
    { state, commit, dispatch },
    { date, isPm, userId, value }
  ) {
    // データの型変換を行う
    const isPmNum = isPm ? 1 : 0
    const dateStrJa = format(date, 'yyyy/MM/dd')

    // カブ値データのユニークIDを作成する
    // [user-id]-[date]-[isPm]
    const dateForId = format(date, 'yyyyMMdd')
    const id = dateForId + '-' + String(isPmNum) + '-' + String(userId)

    // application/x-www-form-urlencoded 用のpayloadを作成
    const params = new URLSearchParams()
    params.append('id', id)
    params.append('date', dateStrJa)
    params.append('isPm', isPmNum) // bool -> int
    params.append('userId', userId)
    params.append('value', value)

    // fetch API のoptionsを作成
    const options = {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    // GAS API endpoint
    const url =
      'https://script.google.com/macros/s/AKfycbxtILUd-tZEVU_SnXwCUxVfOF-XhhGThRKBZ0bfMFR_6O-g3Gg/exec'

    try {
      await fetch(url, options)
        .catch((e) => {
          throw new Error(e)
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .then((responseAsJson) => {
          return true
        })
        .catch((e) => {
          throw new Error(e)
        })
    } catch (e) {
      // GASのPOST, レスポンスを返さないので, エラーになる
    }

    // 送信後に, ローカルでデータを追加しておく
    const datestrtmp = format(date, 'E MMM d yyyy HH:mm:ss')
    commit('set_kabuValue', {
      id,
      date: datestrtmp + ' GMT+0900 (日本うんたら)',
      isPm: isPmNum,
      userId,
      value
    })
  },

  DecrementWeekIndex({ commit }) {
    commit('DecrementWeekIndex')
  },
  IncrementWeekIndex({ commit }) {
    commit('IncrementWeekIndex')
  }
}
