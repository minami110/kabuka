

// 一週間分のカブのデータクラス
export class WeeklyData {

    constructor(datas) {
        this._missing = []

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
                }
                else {
                    this._missing.push(true)
                    result.push(null)
                }
            }
            catch (e) {
                this._missing.push(true)
                result.push(null)
            }
        }
        return this._fill_blank_data(result)
    }

    // 未入力のデータを穴埋めする関数
    // [1, 2, 3] -> [1, 2, 3]
    // [1, null, 3, null] -> [1, 1, 3, 3]
    // [null, 2, null] -> [null, 2, 2]
    // [null, null] -> [null, null]
    _fill_blank_data(datas) {
        const result = []
        let prev_data = null
        for (const data of datas) {
            if (data) {
                prev_data = data
            }
            result.push(prev_data)
        }
        return result
    }

    // 指定された時間 / 日曜AM の値を計算
    // 例: magnitude("monday.am") => this.monday.am / this.sunday.am
    magnitude(day) {
        if (!this.sunday.am) {
            return 0
        } else {
            switch (day) {
                case "monday.am":
                    return this.monday.am / this.sunday.am
                case "monday.pm":
                    return this.monday.pm / this.sunday.am
                case "tuesday.am":
                    return this.tuesday.am / this.sunday.am
                case "tuesday.pm":
                    return this.tuesday.pm / this.sunday.am
                case "wednesday.am":
                    return this.wednesday.am / this.sunday.am
                case "wednesday.pm":
                    return this.wednesday.pm / this.sunday.am
                case "thursday.am":
                    return this.thursday.am / this.sunday.am
                case "thursday.pm":
                    return this.thursday.pm / this.sunday.am
                case "friday.am":
                    return this.friday.am / this.sunday.am
                case "friday.pm":
                    return this.friday.pm / this.sunday.am
                case "saturday.am":
                    return this.saturday.am / this.sunday.am
                case "saturday.pm":
                    return this.saturday.pm / this.sunday.am
                default:
                    return 0
            }

        }
    }

    // 指定された時間が入力されていたかどうか
    isMissing(day) {
        switch (day) {
            case "sunday.am":
                return this._missing[0]
            case "monday.am":
                return this._missing[2]
            case "monday.pm":
                return this._missing[3]
            case "tuesday.am":
                return this._missing[4]
            case "tuesday.pm":
                return this._missing[5]
            case "wednesday.am":
                return this._missing[6]
            case "wednesday.pm":
                return this._missing[7]
            case "thursday.am":
                return this._missing[8]
            case "thursday.pm":
                return this._missing[9]
            case "friday.am":
                return this._missing[10]
            case "friday.pm":
                return this._missing[11]
            case "saturday.am":
                return this._missing[12]
            case "saturday.pm":
                return this._missing[13]
            default:
                return true
        }
    }
}

// カブの値動きの予測データクラス
export class Prediction {

    constructor() {
        // 値動きタイプの候補, デフォルトはすべて
        this.movingTypes = ["wave", "poor", "P3", "P4"]
        // 予測するにあたって発生したエラータイプ
        this.errors = []
        // 予測精度を高めるためのアドバイス
        this.advices = []
        // 予測する際, 未入力の値を使用したweight
        // 月曜AMは10, その他は5 とする
        this.ambiguous_weight = 0
        // peek日のtimeIndex
        this.peek = 0
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
            if (type == "wave" || type == "poor" || type == "P3" || type == "P4") {
                this.movingTypes.push(type)
            }
        }
    }

    addAmbiguousWeight(value) {
        this.ambiguous_weight += Number(value)
    }

    setPeek(value) {
        this.peek = value
    }
}

// カブの値動きを判定するクラス
export class Detector {

    // とびだせどうぶつの森の月曜日AM予測モデル
    // Type: A, B, C, D に分岐する
    static get_type_tobimori_monday_am(week, result) {

        // 月曜AMのデータがなければ, 曖昧値を10加算する
        if (week.isMissing("monday.am")) {
            result.addAdvice("月曜AMのカブ売値を入力すると, 予測精度が上がります.");
            result.addAmbiguousWeight(10)
        }

        // X = 月曜AM買値 / 日曜売値 の値を計算する
        const X = week.magnitude("monday.am")

        // Xの値に応じて, はじめの判定を行う
        // ここでは, 4期型が確定する
        if (X < 0.6) {
            // type-A
            // 0.4 ~ 0.6 なら, 4期型 確定
            result.setMovingTypes(["P4"])

            // peekを検知する
            // 未実装
            return "A";
        } else if (X < 0.8) {
            // type-B
            // 0.6 ~ 0.8 なら, 波型か4期型
            result.setMovingTypes(["wave", "P4"])
            return "B"
        } else if (X < 0.85) {
            // type-A
            // 0.8 ~ 0.85 なら, 3期型(ソースによって違う) か 4期型
            // とりあえず, 4期型のみとしておく
            result.setMovingTypes(["P4"])

            // peekを検知する 未実装
            return "A"
        } else if (X < 0.9) {
            // type-C
            // 0.85 ~ 0.9 なら, 3期型か4期型かジリ貧型
            result.setMovingTypes(["poor", "P3", "P4"])
            return "C"
        } else {
            // type-D
            // 0.9 ~ 1.4 なら, 波型か4期型
            // 月曜PMで確定
            result.setMovingTypes(["wave", "P4"])
            return "D"
        }
    }

    // とびだせどうぶつの森の月曜日PM予測モデル
    // Type: A, B, C-1, C-2, D に分岐する
    static get_type_tobimori_monday_pm(week, result, typeMondayAm) {

        // 月曜PMのデータがなければ, 曖昧値を5加算する
        if (week.isMissing("monday.pm")) {
            result.addAdvice("月曜PMのカブ売値を入力すると, 予測精度が上がります.");
            result.addAmbiguousWeight(5)
        }
        const mag = week.magnitude("monday.pm")

        // 月曜AMでType-B型のスコープ
        // 波形, 4期型に確定する
        // 月曜PM ~ 火曜PMの間に確定する
        if (typeMondayAm == "B") {
            // 月曜AM -> 月曜PM の値動きを確認する
            // 同値, または8ベル以上の値下がりなら, 波型の確定
            const delta_mon = week.monday.am - week.monday.pm;
            if (delta_mon == 0 || delta_mon > 8) {
                // 月曜PMに, 波型の確定!
                result.setMovingTypes(["wave"])
                return "A";
            }
            // もし値上がりしていたら
            else if (delta_mon < 0) {

                if (week.magnitude("monday.pm") < 0.9) {
                    // 月曜PMに, 波型の確定!
                    result.setMovingTypes(["wave"])
                    return "A";
                } else {
                    // 火曜AMの判定に
                    result.setMovingTypes(["wave", "P3", "P4"])
                    return "B"
                }
            }
            // もし 8ベル未満の値下がりなら
            else {
                // ここどうしたらいいのかわからない。。。
                // とりあえず波形にしておくけれど, チャートに記入漏れがある
                // 月曜PMに, 波型の確定 ????
                result.addAmbiguousWeight(5)
                result.setMovingTypes(["wave"])
                return "A";
            }
        }

        // 月曜AMでType-C型のスコープ
        // ジリ貧型, 3期型, 4期型に確定する
        // 火曜AM ~ 木曜PM の間に確定する
        else if (typeMondayAm == "C") {

            // 月曜PMに買取値が上がった場合
            // 3期型, 4期型に確定する
            // 火曜AMに確定する
            if (week.monday.pm > week.monday.am) {
                result.setMovingTypes(["P3", "P4"])
                // 火曜AMへ
                return "C-1"
            }

            // 月曜PMに買取値が下がった場合
            // 木曜PMまで値を確認する
            // 値上がり(変調)すると, 3期型, 4期型が確定
            // 木曜PM時点で値上がりが確認できなければ, ジリ貧型
            else {
                result.setMovingTypes(["poor", "P3", "P4"])
                return "C-2"
            }
        }

        // 月曜AMでType-D型のスコープ
        // 波形か4期型に確定する
        // 月曜PM ~ 火曜AM の間に確定する
        else if (typeMondayAm == "D") {
            if (mag < 0.8) {
                // 月曜PMに, 波型の確定!
                // 波型なのでピークはなし
                result.setMovingTypes(["wave"])
                return "A";
            } else {
                // 火曜AMの値で判定する
                result.setMovingTypes(["wave"])
                return "D"

            }
        }

        return null;
    }

    // とびだせどうぶつの森の火曜日AM予測モデル
    // Type:A, B に分岐する
    static get_type_tobimori_tuesday_am(week, result, typeMondayPm, dayIndex) {

        // 火曜AMのデータがなければ, 曖昧値を5加算する
        if (week.isMissing("tuesday.am")) {
            result.addAdvice("火曜AMのカブ売値を入力すると, 予測精度が上がります.");
            result.addAmbiguousWeight(5)
        }

        const mag = week.magnitude("thuesday.am");

        // 月曜PMでType-B型のスコープ
        // wave, P3, P4 に着地する
        if (typeMondayPm == "B") {

            if (mag < 0.9) {
                // 火曜AMに, 波型の確定
                result.setMovingTypes(["wave"])
                return "A";
            } else {
                // 火曜PMへ
                result.setMovingTypes(["wave", "P3", "P4"])
                return "B"
            }
        }

        // 月曜PMでType-C-1のスコープ
        else if (typeMondayPm == "C-1") {
            if (mag < 1.4) {
                // 4期型で確定!
                // 水曜AM(6)にピークを迎える
                result.setMovingTypes(["P4"])
                result.setPeek(6)
                return "A";
            } else {
                // 3期型で確定!
                // 火曜PM(5)にピークを迎える
                result.setMovingTypes(["P3"])
                result.setPeek(5)
                return "A"
            }
        }

        else if (typeMondayPm == "C-2") {

            // 月曜PMに買取値が下がった場合
            // 木曜PMまで値を確認する
            // 値上がり(変調)すると, 3期型, 4期型が確定
            // 木曜PM(9)時点で値上がりが確認できなければ, ジリ貧型

            // 外部の関数を最期で呼ぶ
            // 火曜AM現在は4 

            return Detector.check_poor(week, result, 4, dayIndex)
        }

        else if (typeMondayPm == "D") {
            if (mag < 1.4) {
                // 火曜AMに 波型で確定!
                result.setMovingTypes(["wave"])
                return "A";
            } else {
                // 火曜AMに 4期型で確定!
                // 水曜AM(6) にピーク
                result.setMovingTypes(["P4"])
                result.setPeek(6)
                return "A";
            }
        }

        else {
            return null
        }
    }

    // とびだせどうぶつの森の火曜日PM予測モデル
    // Type:A に収束
    static get_type_tobimori_tuesday_pm(week, result, typeTuesdayAm) {

        // 火曜PMのデータがなければ, 曖昧値を5加算する
        if (week.isMissing("tuesday.pm")) {
            result.addAdvice("火曜PMのカブ売値を入力すると, 予測精度が上がります.");
            result.addAmbiguousWeight(5)
        }

        // 火曜AMでType-B型のスコープ
        // ここで確定する
        if (typeTuesdayAm == "B") {
            if (week.magnitude("tuesday.pm") < 1.4) {
                // 火曜PMに, 波型の確定
                result.setMovingTypes(["wave"])
                return "A"
            } else if (week.magnitude("tuesday.pm") < 2.0) {
                // 火曜PMに 4期型で確定!
                // 水曜AM(6)にピークを迎える
                result.setMovingTypes(["P4"])
                result.setPeek(6)
                return "A"
            } else {
                // 火曜PMに 3期型で確定!
                // 火曜PM(5)にピークを迎える(今)
                result.setMovingTypes(["P3"])
                result.setPeek(5)
                return "A"
            }
        }

        else {
            return null
        }
    }

    // とびだせどうぶつの森の, C-2パターン検証再帰モデル
    static check_poor(week, result, currentDayIndex, limitDayIndex) {

        // 現在の日付を超えたらアウト
        if (currentDayIndex > limitDayIndex) {
            return "A"
        }

        // 木曜PMを超えたらアウト
        if (currentDayIndex > 8) {
            // ジリ貧型決定
            result.setMovingTypes(["poor"])
            return "A"
        }

        // 値上がりしたかを確認する
        // indexで取得したいができないので最悪
        // 値上がりした場合, 次の関数へ飛ぶ
        switch (currentDayIndex) {

            // 火曜AM
            case 4:
                if (week.tuesday.am - week.monday.pm > 0) {
                    const nextmag = week.magnitude("tuesday.pm")
                    return Detector.check_poor_final(result, nextmag, currentDayIndex + 1, limitDayIndex)
                }
                break;
            // 火曜PM
            case 5:
                if (week.tuesday.pm - week.tuesday.am > 0) {
                    const nextmag = week.magnitude("wednesday.am")
                    return Detector.check_poor_final(result, nextmag, currentDayIndex + 1, limitDayIndex)
                }
                break;
            // 水曜AM
            case 6:
                if (week.wednesday.am - week.tuesday.pm > 0) {
                    const nextmag = week.magnitude("wednesday.pm")
                    return Detector.check_poor_final(result, nextmag, currentDayIndex + 1, limitDayIndex)
                }
                break;
            // 水曜PM
            case 7:
                if (week.wednesday.pm - week.wednesday.am > 0) {
                    const nextmag = week.magnitude("thursday.am")
                    return Detector.check_poor_final(result, nextmag, currentDayIndex + 1, limitDayIndex)
                }
                break;
            // 木曜AM
            case 7:
                if (week.thursday.am - week.wednesday.pm > 0) {
                    const nextmag = week.magnitude("thursday.pm")
                    return Detector.check_poor_final(result, nextmag, currentDayIndex + 1, limitDayIndex)
                }
                break;

        }

        return this.check_poor(currentDayIndex + 1, limitDayIndex)
    }

    static check_poor_final(result, mag, current, limidDay) {
        // 現在の日付を超えたらアウト
        if (current > limidDay) {
            return "A"
        }

        if (mag < 1.4) {
            // P4が確定, ピークは2つ次
            result.setMovingTypes(["P4"])
            result.setPeek(current + 2)
            return "A"
        } else {
            // P3が確定, ピークは1つ次
            result.setMovingTypes(["P3"])
            result.setPeek(current + 1)
            return "A"
        }

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
    static detect_v_tobimori(values, currentTimeIndex) {

        const week = new WeeklyData(values)
        const result = new Prediction()

        // 日曜AMのデータがなければ, 終了する
        if (week.isMissing("sunday.am")) {
            result.addAdvice("日曜のカブ売値を入力しましょう!")
            result.addError("日曜のカブ売値は, 予測に必須です")
            return result;
        }

        // === 月曜AM時点の予測 ===
        if (currentTimeIndex < 2) {
            // 現在時間が月曜AM以前なら, ここで終了する
            return result;
        }
        // 月曜AMの予測モデルを実施, TypeAならreturn
        const type_monday_am = Detector.get_type_tobimori_monday_am(week, result)
        if (type_monday_am == "A") {
            return result;
        }

        // === 月曜PM時点の予測 ===
        if (currentTimeIndex < 3) {
            return result;
        }
        const type_monday_pm = Detector.get_type_tobimori_monday_pm(week, result, type_monday_am)
        if (type_monday_pm == "A") {
            return result;
        }

        // === 火曜AM時点の予測 ===
        if (currentTimeIndex < 4) {
            return result;
        }
        const type_tuesday_am = Detector.get_type_tobimori_tuesday_am(week, result, type_monday_pm, currentTimeIndex)
        if (type_tuesday_am == "A") {
            return result;
        }

        // === 火曜PM時点の予測 ===
        if (currentTimeIndex < 5) {
            return result;
        }
        const type_tuesday_pm = Detector.get_type_tobimori_tuesday_pm(week, result, type_tuesday_am)
        if (type_tuesday_pm == "A") {
            return result;
        }

        return result;
    }
}