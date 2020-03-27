// 一週間分のカブのデータクラス
export class WeeklyData {
  constructor(datas) {
    this._missing = []

    // validate original data
    const _datas = this._valid(datas)

    this.sunday = {
      am: _datas[0],
      pm: _datas[1]
    }
    this.monday = {
      am: _datas[2],
      pm: _datas[3]
    }
    this.tuesday = {
      am: _datas[4],
      pm: _datas[5]
    }
    this.wednesday = {
      am: _datas[6],
      pm: _datas[7]
    }
    this.thursday = {
      am: _datas[8],
      pm: _datas[9]
    }
    this.friday = {
      am: _datas[10],
      pm: _datas[11]
    }
    this.saturday = {
      am: _datas[12],
      pm: _datas[13]
    }
  }

  _valid(datas) {
    const result = []
    for (let i = 0; i < 14; i++) {
      try {
        if (datas[i]) {
          this._missing.push(false)
          result.push(Number(datas[i]))
        } else {
          this._missing.push(true)
          result.push(null)
        }
      } catch (e) {
        this._missing.push(true)
        result.push(null)
      }
    }
    return this._fillBlankData(result)
  }

  // 未入力のデータを穴埋めする関数
  // 間に挟まれているデータは, 平均化する
  // [1, 2, 3] -> [1, 2, 3]
  // [1, null, 3, null] -> [1, 2, 3, 3]
  // [null, 2, null] -> [null, 2, 2]
  // [null, null] -> [null, null]
  _fillBlankData(datas) {
    const dataLength = datas.length
    const result = []
    for (const index in datas) {
      const data = datas[index]
      if (!data) {
        // nullの場合, 自分の前のデータと, 自分の後ろに存在するデータを確認しに行く
        // 1個前に2, 2個後に8 の場合 => (8-2)/(1 + 2) で増分値が2ということがわかるので
        // 2 + 2 * 1 = 4 が求まる
        // 前も全てnullのばあいは, nullとする
        // 後ろがnullのばあいは, 前の値をそのまま使用する
        let prevData = null
        let prevIndex = Number(index) - 1
        for (; prevIndex >= 0; prevIndex--) {
          const _d = datas[prevIndex]
          if (_d) {
            prevData = _d
            break
          }
        }
        if (!prevData) {
          result.push(null)
          continue
        }

        let nextData = null
        let nextIndex = Number(index) + 1
        for (; nextIndex < dataLength; nextIndex++) {
          const _d = datas[nextIndex]
          if (_d) {
            nextData = _d
            break
          }
        }
        if (!nextData) {
          result.push(prevData)
          continue
        }

        const indexDelta = nextIndex - prevIndex
        const valueDelta = (nextData - prevData) / indexDelta
        const interpDelta = prevData + (Number(index) - prevIndex) * valueDelta
        result.push(interpDelta)
      } else {
        // データが存在する場合は, そのまま使用する
        result.push(data)
      }
    }
    return result
  }

  // timeIndexを使用して値を取得する
  getData(timeIndex) {
    switch (timeIndex) {
      case 0:
        return this.sunday.am
      case 1:
        return this.sunday.pm
      case 2:
        return this.monday.am
      case 3:
        return this.monday.pm
      case 4:
        return this.tuesday.am
      case 5:
        return this.tuesday.pm
      case 6:
        return this.wednesday.am
      case 7:
        return this.wednesday.pm
      case 8:
        return this.thursday.am
      case 9:
        return this.thursday.pm
      case 10:
        return this.friday.am
      case 11:
        return this.friday.pm
      case 12:
        return this.saturday.am
      case 13:
        return this.saturday.pm
      default:
        return null
    }
  }

  // 指定された時間 / 日曜AM の値を計算
  // 例: magnitude("monday.am") => this.monday.am / this.sunday.am
  magnitude(day) {
    if (!this.sunday.am) {
      return 0
    } else {
      switch (day) {
        case 'monday.am':
          return this.monday.am / this.sunday.am
        case 'monday.pm':
          return this.monday.pm / this.sunday.am
        case 'tuesday.am':
          return this.tuesday.am / this.sunday.am
        case 'tuesday.pm':
          return this.tuesday.pm / this.sunday.am
        case 'wednesday.am':
          return this.wednesday.am / this.sunday.am
        case 'wednesday.pm':
          return this.wednesday.pm / this.sunday.am
        case 'thursday.am':
          return this.thursday.am / this.sunday.am
        case 'thursday.pm':
          return this.thursday.pm / this.sunday.am
        case 'friday.am':
          return this.friday.am / this.sunday.am
        case 'friday.pm':
          return this.friday.pm / this.sunday.am
        case 'saturday.am':
          return this.saturday.am / this.sunday.am
        case 'saturday.pm':
          return this.saturday.pm / this.sunday.am
        default:
          return 0
      }
    }
  }

  // 指定された時間 / 日曜AM の値を計算, timeIndexで取得
  magnitudeByIndex(timeIndex) {
    if (!this.sunday.am) {
      return 0
    }

    const targetData = this.getData(timeIndex)
    if (!targetData) {
      return 0
    }

    return targetData / this.sunday.am
  }

  // 指定された時間が入力されていたかどうか
  isMissing(day) {
    switch (day) {
      case 'sunday.am':
        return this._missing[0]
      case 'monday.am':
        return this._missing[2]
      case 'monday.pm':
        return this._missing[3]
      case 'tuesday.am':
        return this._missing[4]
      case 'tuesday.pm':
        return this._missing[5]
      case 'wednesday.am':
        return this._missing[6]
      case 'wednesday.pm':
        return this._missing[7]
      case 'thursday.am':
        return this._missing[8]
      case 'thursday.pm':
        return this._missing[9]
      case 'friday.am':
        return this._missing[10]
      case 'friday.pm':
        return this._missing[11]
      case 'saturday.am':
        return this._missing[12]
      case 'saturday.pm':
        return this._missing[13]
      default:
        return true
    }
  }

  // 指定された時間が入力されていたどうかを indexで
  isMissingByIndex(timeIndex) {
    try {
      return this._missing[timeIndex]
    } catch (e) {
      return true
    }
  }
}

// カブの値動きの予測データクラス
export class Prediction {
  constructor() {
    // 日曜Amの販売価格, 予想値に必要
    this.sunday_am = 0

    // 値動きタイプの候補, デフォルトはすべて
    this.movingTypes = ['wave', 'poor', 'P3', 'P4']
    // 予測するにあたって発生したエラータイプ
    this.errors = []
    // 予測精度を高めるためのアドバイス
    this.advices = []
    // 予測する際, 未入力の値を使用したweight
    // 月曜AMは10, その他は5 とする
    this.ambiguous_weight = 0
    // peek日のtimeIndex
    this.peeks = []
  }

  addAdvice(msg) {
    this.advices.push(msg)
  }

  addError(msg) {
    this.errors.push(msg)
  }

  setMovingTypes(typeList) {
    // clear prev types
    this.movingTypes = []
    // update
    for (const type of typeList) {
      if (
        type === 'wave' ||
        type === 'poor' ||
        type === 'P3' ||
        type === 'P4'
      ) {
        this.movingTypes.push(type)
      }
    }
  }

  addAmbiguousWeight(value) {
    this.ambiguous_weight += Number(value)
  }

  setPeek(value) {
    this.peeks = [value]
  }

  setPeeks(values) {
    this.peeks = values
  }

  clearPeek() {
    this.peeks = []
  }

  getMinExpectedValue() {
    if (this.movingTypes.toString() === ['P4'].toString()) {
      return this.sunday_am * 1.5
    } else if (this.movingTypes.toString() === ['P3'].toString()) {
      return this.sunday_am * 2
    } else {
      return null
    }
  }

  getMaxExpectedValue() {
    if (this.movingTypes.toString() === ['P4'].toString()) {
      return this.sunday_am * 2
    } else if (this.movingTypes.toString() === ['P3'].toString()) {
      return this.sunday_am * 6
    } else {
      return null
    }
  }
}

// カブの値動きを判定するクラス
export class Detector {
  // とびだせどうぶつの森の月曜日AM予測モデル
  // Type: A, B, C, D に分岐する
  static _detectMondayAm(week, result, currentTimeIndex) {
    // 月曜AMのデータがなければ, 曖昧値を10加算する
    if (week.isMissing('monday.am')) {
      result.addAdvice('月曜AMのカブ売値を入力すると, 予測精度が上がります.')
      result.addAmbiguousWeight(10)
    }

    result.sunday_am = week.sunday.am

    // X = 月曜AM買値 / 日曜売値 の値を計算する
    const X = week.magnitude('monday.am')

    // Xの値に応じて, はじめの判定を行う
    // ここでは, 4期型が確定する
    if (X < 0.6 || (X >= 0.8 && X < 0.85)) {
      // type-A
      result.setMovingTypes(['P4'])

      // peekを検知する
      // このばあい, 以下で変調するみたい (検証中)
      // 火曜AM(4), 木曜AM(8)
      // 対応するピークは以下
      // 水曜PM(7), 土曜AM(11)
      result.setPeeks([7, 11])

      // 外部の関数で, peekの判定を行う
      if (Detector.checkPeek(week, result, 3, currentTimeIndex)) {
        // 変調をかくにん
        return 'A'
      } else {
        result.addAdvice('ピークを確定させるために, 入力を続けましょう')
        return 'A'
      }
    } else if (X < 0.8) {
      // type-B
      // 0.6 ~ 0.8 なら, 波型か4期型か3期型
      result.setMovingTypes(['wave', 'P3', 'P4'])
      // peekは
      // P3の場合,火曜PM(5)
      // P4の場合, 水曜AM(6)
      result.setPeeks([null, 5, 6])

      // 月曜PMへ
      return 'B'
    } else if (X < 0.9) {
      // type-C
      // 0.85 ~ 0.9 なら, 3期型か4期型かジリ貧型
      result.setMovingTypes(['poor', 'P3', 'P4'])

      // 月曜PMへ
      return 'C'
    } else {
      // type-D
      // 0.9 ~ 1.4 なら, 波型か4期型
      // 月曜PMで確定
      result.setMovingTypes(['wave', 'P4'])
      // P4の場合, peekは水曜AM(6)
      result.setPeeks([null, 6])
      return 'D'
    }
  }

  // とびだせどうぶつの森の月曜日PM予測モデル
  // Type: A, B, C-1, C-2, D に分岐する
  static _detectMondayPm(week, result, typeMondayAm) {
    // 月曜PMのデータがなければ, 曖昧値を5加算する
    if (week.isMissing('monday.pm')) {
      result.addAdvice('月曜PMのカブ売値を入力すると, 予測精度が上がります.')
      result.addAmbiguousWeight(5)
    }
    const mag = week.magnitude('monday.pm')

    // 月曜AMでType-B型のスコープ
    // 波形, 4期型に確定する
    // 月曜PM ~ 火曜PMの間に確定する
    if (typeMondayAm === 'B') {
      // 月曜AM -> 月曜PM の値動きを確認する
      // 同値, または8ベル以上の値下がりなら, 波型の確定
      const deltaValue = week.monday.am - week.monday.pm
      if (deltaValue === 0 || deltaValue > 8) {
        // 月曜PMに, 波型の確定!
        result.setMovingTypes(['wave'])
        result.clearPeek()
        return 'A'
      }
      // もし値上がりしていたら
      else if (deltaValue < 0) {
        if (week.magnitude('monday.pm') < 0.9) {
          // 月曜PMに, 波型の確定!
          result.setMovingTypes(['wave'])
          result.clearPeek()
          return 'A'
        } else {
          // 火曜AMの判定に
          // peekは
          // P3の場合,火曜PM(5)
          // P4の場合, 水曜AM(6)
          result.setMovingTypes(['wave', 'P3', 'P4'])
          result.setPeeks([null, 5, 6])
          return 'B'
        }
      }
      // もし 8ベル未満の値下がりなら
      else {
        // ここどうしたらいいのかわからない。。。
        // とりあえず波形にしておくけれど, チャートに記入漏れがある
        // 月曜PMに, 波型の確定 ????
        result.addAmbiguousWeight(5)
        result.setMovingTypes(['wave'])
        result.clearPeek()
        result.addAdvice(
          'チャートに記入漏れがある値動きなので, 観察してください'
        )
        return 'A'
      }
    }

    // 月曜AMでType-C型のスコープ
    // ジリ貧型, 3期型, 4期型に確定する
    // 火曜AM ~ 木曜PM の間に確定する
    else if (typeMondayAm === 'C') {
      // 月曜PMに買取値が上がった場合
      // 3期型, 4期型に確定する
      // 火曜AMに確定する
      if (week.monday.pm > week.monday.am) {
        result.setMovingTypes(['P3', 'P4'])
        // peekは火曜PMか水曜AM
        result.setPeeks([5, 6])
        // 火曜AMへ
        return 'C-1'
      }

      // 月曜PMに買取値が下がった場合
      // 木曜PMまで値を確認する
      // 値上がり(変調)すると, 3期型, 4期型が確定
      // 木曜PM時点で値上がりが確認できなければ, ジリ貧型
      else {
        result.setMovingTypes(['poor', 'P3', 'P4'])
        return 'C-2'
      }
    }

    // 月曜AMでType-D型のスコープ
    // 波形か4期型に確定する
    // 月曜PM ~ 火曜AM の間に確定する
    else if (typeMondayAm === 'D') {
      if (mag < 0.8) {
        // 月曜PMに, 波型の確定!
        // 波型なのでピークはなし
        result.setMovingTypes(['wave'])
        result.clearPeek()
        return 'A'
      } else {
        // 火曜AMの値で判定する
        // P4のばあいは, 常に水曜AM(6)にピーク
        result.setMovingTypes(['wave', 'P4'])
        result.setPeeks([null, 6])
        return 'D'
      }
    }

    return null
  }

  // とびだせどうぶつの森の火曜日AM予測モデル
  // Type:A, B に分岐する
  static _detectTuesdayAm(week, result, typeMondayPm, dayIndex) {
    // 火曜AMのデータがなければ, 曖昧値を5加算する
    if (week.isMissing('tuesday.am')) {
      result.addAdvice('火曜AMのカブ売値を入力すると, 予測精度が上がります.')
      result.addAmbiguousWeight(5)
    }

    const mag = week.magnitude('thuesday.am')

    // 月曜PMでType-B型のスコープ
    // wave, P3, P4 に着地する
    if (typeMondayPm === 'B') {
      if (mag < 0.9) {
        // 火曜AMに, 波型の確定
        result.setMovingTypes(['wave'])
        result.clearPeek()
        return 'A'
      } else {
        // 火曜PMへ
        result.setMovingTypes(['wave', 'P3', 'P4'])
        // peekは
        // P3の場合,火曜PM(5)
        // P4の場合, 水曜AM(6)
        result.setPeeks([null, 5, 6])
        return 'B'
      }
    }

    // 月曜PMでType-C-1のスコープ
    else if (typeMondayPm === 'C-1') {
      if (mag < 1.4) {
        // 4期型で確定!
        // 水曜AM(6)にピークを迎える
        result.setMovingTypes(['P4'])
        result.setPeek(6)
        return 'A'
      } else {
        // 3期型で確定!
        // 火曜PM(5)にピークを迎える
        result.setMovingTypes(['P3'])
        result.setPeek(5)
        return 'A'
      }
    } else if (typeMondayPm === 'C-2') {
      // 月曜PMに買取値が下がった場合
      // 木曜PMまで値を確認する
      // 値上がり(変調)すると, 3期型, 4期型が確定
      // 木曜PM(9)時点で値上がりが確認できなければ, ジリ貧型

      // 外部の関数を最期で呼ぶ
      // 火曜AM現在は4

      return Detector._checkPoor(week, result, 4, dayIndex)
    } else if (typeMondayPm === 'D') {
      if (mag < 1.4) {
        // 火曜AMに 波型で確定!
        result.setMovingTypes(['wave'])
        result.clearPeek()
        return 'A'
      } else {
        // 火曜AMに 4期型で確定!
        // 水曜AM(6) にピーク
        result.setMovingTypes(['P4'])
        result.setPeek(6)
        return 'A'
      }
    } else {
      return null
    }
  }

  // とびだせどうぶつの森の火曜日PM予測モデル
  // Type:A に収束
  static _detectTuesdayPm(week, result, typeTuesdayAm) {
    // 火曜PMのデータがなければ, 曖昧値を5加算する
    if (week.isMissing('tuesday.pm')) {
      result.addAdvice('火曜PMのカブ売値を入力すると, 予測精度が上がります.')
      result.addAmbiguousWeight(5)
    }

    // 火曜AMでType-B型のスコープ
    // ここで確定する
    if (typeTuesdayAm === 'B') {
      if (week.magnitude('tuesday.pm') < 1.4) {
        // 火曜PMに, 波型の確定
        result.setMovingTypes(['wave'])
        return 'A'
      } else if (week.magnitude('tuesday.pm') < 2.0) {
        // 火曜PMに 4期型で確定!
        // 水曜AM(6)にピークを迎える
        result.setMovingTypes(['P4'])
        result.setPeek(6)
        return 'A'
      } else {
        // 火曜PMに 3期型で確定!
        // 火曜PM(5)にピークを迎える(今)
        result.setMovingTypes(['P3'])
        result.setPeek(5)
        return 'A'
      }
    } else {
      return null
    }
  }

  // とびだせどうぶつの森の, C-2パターン検証再帰モデル
  static _checkPoor(week, result, currentDayIndex, limitDayIndex) {
    // 木曜PMを超えたらジリ貧型が決定する
    if (currentDayIndex > 8) {
      result.setMovingTypes(['poor'])
      result.clearPeek()
      return 'A'
    }

    // 現在の日付を超えたらアウト
    if (currentDayIndex > limitDayIndex) {
      return 'A'
    }

    // 現在の値と, 前回の値を比較する
    const currValue = week.getData(currentDayIndex)
    const prevValue = week.getData(currentDayIndex - 1)
    const bInclease = currValue - prevValue > 0

    // 未入力の値があれば, amiguousを増加
    if (week.isMissingByIndex(currentDayIndex)) {
      result.addAmbiguousWeight(2)
    }

    if (week.isMissingByIndex(currentDayIndex - 1)) {
      result.addAmbiguousWeight(2)
    }

    // 値上がりしていたら, P3, P4の判定に飛ぶ
    if (bInclease) {
      // 更に次の日に判定するので, limitを超えていないかの確認をする
      const nextTimeIndex = currentDayIndex + 1
      if (nextTimeIndex > limitDayIndex) {
        // 値動きが, P3かP4に確定!
        result.setMovingTypes(['P3', 'P4'])

        // アドバイスを追記する
        result.addAdvice('次のカブ値の入力で確定!')

        // P3 なら現在の 2後, P4なら現在の 3後にピークを迎える
        const p3peek = currentDayIndex + 2
        const p4peek = currentDayIndex + 3
        result.setPeeks([p3peek, p4peek])
        return 'A'
      } else {
        const nextmag = week.magnitudeByIndex(nextTimeIndex)
        // ここ, 1.43でP4だったことがあるので, 微妙に上げている
        // 1/7 近辺の値かと思われる
        if (nextmag < 1.45) {
          // P4が確定, ピークは2つ次
          result.setMovingTypes(['P4'])
          result.setPeek(nextTimeIndex + 2)
          return 'A'
        } else {
          // P3が確定, ピークは1つ次
          result.setMovingTypes(['P3'])
          result.setPeek(nextTimeIndex + 1)
          return 'A'
        }
      }
    }

    // 次の日へ再帰する
    const nextTimeIndex = currentDayIndex + 1
    return Detector._checkPoor(week, result, nextTimeIndex, limitDayIndex)
  }

  // type-A型のpeekを監視する関数
  static checkPeek(week, result, curentIndex, limitIndex) {
    // 木曜PMを超えた変調は起きないので, return
    if (curentIndex > 8) {
      return true
    }

    // 現在の日付を超えたらアウト
    if (curentIndex > limitIndex) {
      return false
    }

    // 変調が起きたかどうかを確認する
    // 現在の値と, 前回の値を比較する
    const currValue = week.getData(curentIndex)
    const prevValue = week.getData(curentIndex - 1)
    const bInclease = currValue - prevValue > 0

    // 未入力の値があれば, amiguousを増加
    if (week.isMissingByIndex(curentIndex)) {
      result.addAmbiguousWeight(5)
    }

    // 値上がりしていたら, 変調の確認, 3つ後にpeekを設定する
    if (bInclease) {
      result.setPeek(curentIndex + 3)
      return true
    }

    const nextTimeIndex = curentIndex + 1
    return Detector.checkPeek(week, result, nextTimeIndex, limitIndex)
  }

  // カブの値動き型の確率を判定する関数
  // とびだせどうぶつの森の予測を使用
  // https://w.atwiki.jp/doubutsunomori3ds/pages/99.html
  // https://pbs.twimg.com/media/BAOUwxGCAAANS00?format=jpg&name=large
  //
  // 日曜AMのみ必須
  // データが存在しない場合は, 以前の値を予測に使用する

  // 入力はカブ値の配列(要素数10)
  // [日曜AM(売値), 日曜PM(null), 月曜AM, 月曜PM, 火曜AM, 火曜PM, 水曜AM, 水曜PM, 木曜AM, 木曜PM]
  //
  // 現在時間のインデックス
  // 日曜AM: 0, 日曜PM: 1, 月曜AM: 2, 月曜PM: 3....
  //
  // 戻り地は以下のオブジェクト
  //
  static Detect(values, currentTimeIndex) {
    const week = new WeeklyData(values)
    const result = new Prediction()

    // 日曜AMのデータがなければ, 終了する
    if (week.isMissing('sunday.am')) {
      result.addAdvice('日曜のカブ売値を入力しましょう!')
      result.addError('日曜のカブ売値は, 予測に必須です')
      result.clearPeek()
      result.addAmbiguousWeight(50)
      return result
    }

    // === 月曜AM時点の予測 ===
    if (currentTimeIndex < 2) {
      // 現在時間が月曜AM以前なら, ここで終了する
      return result
    }
    // 月曜AMの予測モデルを実施, TypeAならreturn
    const typeMonAm = Detector._detectMondayAm(week, result, currentTimeIndex)
    if (typeMonAm === 'A') {
      return result
    }

    // === 月曜PM時点の予測 ===
    if (currentTimeIndex < 3) {
      return result
    }
    const typeMonPm = Detector._detectMondayPm(week, result, typeMonAm)
    if (typeMonPm === 'A') {
      return result
    }

    // === 火曜AM時点の予測 ===
    if (currentTimeIndex < 4) {
      return result
    }
    const typeTueAm = Detector._detectTuesdayAm(
      week,
      result,
      typeMonPm,
      currentTimeIndex
    )
    if (typeTueAm === 'A') {
      return result
    }

    // === 火曜PM時点の予測 ===
    if (currentTimeIndex < 5) {
      return result
    }
    const typeTuePm = Detector._detectTuesdayPm(week, result, typeTueAm)
    if (typeTuePm === 'A') {
      return result
    }

    return result
  }
}
