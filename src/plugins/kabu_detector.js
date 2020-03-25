

// 一週間分のカブのデータクラス
export class WeeklyData {

    constructor(datas) {
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
                result.push(Number(datas[i]))
            }
            catch (e) {
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
                default:
                    return 0
            }

        }
    }
}

// カブの値動きの予測データクラス
export class Prediction {

    constructor() {
        this.movingTypeWeights = null
        this.peekWeights = null

        this.error_type = ""
        this.advice_type = ""
    }
}

// カブの値動きを判定するクラス
export class Detector {


    // カブの値動き型の確率を判定する関数
    // とびだせどうぶつの森の予測を使用
    // https://w.atwiki.jp/doubutsunomori3ds/pages/99.html
    // https://pbs.twimg.com/media/BAOUwxGCAAANS00?format=jpg&name=large
    //
    // 入力はカブ値の配列(要素数9)
    // [日曜AM(売値), 月曜AM, 月曜PM, 火曜AM, 火曜PM, 水曜AM, 水曜PM, 木曜AM, 木曜PM]
    //
    // 現在時間のインデックス
    // 日曜AM: 0, 日曜PM: 0, 月曜AM: 1, 月曜PM: 2....
    //
    // 戻り地は以下のオブジェクト
    // 
    detect_v_tobimori(values, currentTimeIndex) {

        const week = new WeeklyData(values)
        const result = new Prediction()

        // もし日曜のカブ売り値がなければ, 予測に失敗する
        if (!week.sunday.am) {
            result.error_type = "日曜 のカブ売値が入力されていません";
            result.advice_type = "日曜 のカブ売値を入力しましょう";
            return result;
        }

        // === 月曜AM時点の予測 ===
        if (week.monday.am) {
            result.error_type = "月曜AM のカブ買取値が入力されていません";
            result.advice_type = "月曜AM のカブ売値を入力しましょう";
            return result;
        }

        // X = 月曜AM買値 / 日曜売値 の値を計算する
        const X = monday_am / sunday_am;
        const mondayType = null;

        // Xの値に応じて, はじめの判定を行う
        // ここでは, 4期型が確定する
        if (X < 0.6) {
            // type-A
            // 0.4 ~ 0.6 なら, 4期型 確定
            result.D = 1.0;
            result.advice_type = "今週の値動きは, 4期型傾向です";
            return result;
        } else if (X < 0.8) {
            // type-B
            // 0.6 ~ 0.8 なら, 波型か4期型
            result.A = 0.5;
            result.D = 0.5;
            result.advice_type = "月曜PM の買取値を入力";
            mondayType = "B";
        } else if (X < 0.85) {
            // type-A
            // 0.8 ~ 0.85 なら, 3期型(ソースによって違う) か 4期型
            // とりあえず, 4期型のみとしておく
            result.D = 0.9;
            result.C = 0.1;
            result.advice_type = "今週の値動きは, 4期型傾向です";
            return result;
        } else if (X < 0.9) {
            // type-C
            // 0.85 ~ 0.9 なら, 3期型か4期型かジリ貧型
            result.B = 1.0 / 3.0;
            result.C = 1.0 / 3.0;
            result.D = 1.0 / 3.0;
            result.advice_type = "月曜PM の買取値を入力!";
            mondayType = "C";
        } else {
            // type-D
            // 0.9 ~ 1.4 なら, 波型か4期型
            // 月曜PMで確定
            result.A = 0.5;
            result.D = 0.5;
            result.advice_type = "月曜PM の買取値を入力!";
            mondayType = "D";
        }

        // === 月曜PM時点の予測 ===
        const monday_pm = values[2];
        if (!monday_pm) {
            result.error_type = "月曜PM のカブ買取値が入力されていません";
            return result;
        }

        // 月曜AMでType-B型のスコープ
        // 波形, 4期型に確定する
        // 月曜PM ~ 火曜PMの間に確定する
        if (mondayType == "B") {
            // 月曜AM -> 月曜PM の値動きを確認する
            // 同値, または8ベル以上の値下がりなら, 波型の確定
            const delta_mon = monday_am - monday_pm;
            if (delta_mon == 0 || delta_mon > 8) {
                // 月曜PMに, 波型の確定!
                result.A = 1;
                result.advice_type = "今週の値動きは, 波型傾向です";
                return;
            }

            // もし値上がりしていたら
            else if (delta_mon < 0) {
                // 月曜PM / 日曜AMを計算する
                let y = monday_pm / sunday_am;
                if (y < 0.9) {
                    // 月曜PMに, 波型の確定
                    result.A = 1;
                    result.advice_type = "今週の値動きは, 波型傾向です";
                    return;
                } else {
                    // 火曜AMの値を確認する
                    result.advice_type = "火曜AM の買取値を入力";
                    const tuesday_am = values[3];
                    if (!tuesday_am) {
                        result.error_type = "火曜AM のカブ買取値が入力されていません";
                        return result;
                    }
                    y = tuesday_am / sunday_am;
                    if (y < 0.9) {
                        // 火曜AMに, 波型の確定
                        result.A = 1;
                        result.advice_type = "今週の値動きは, 波型傾向です";
                        return;
                    } else {
                        // 火曜PMの値を確認する
                        result.advice_type = "火曜PM の買取値を入力";
                        const tuesday_pm = values[4];
                        if (!tuesday_pm) {
                            result.error_type = "火曜PM のカブ買取値が入力されていません";
                            return result;
                        }
                        y = tuesday_pm / sunday_am;
                        if (y < 1.4) {
                            // 火曜PMに, 波型の確定
                            result.A = 1;
                            result.advice_type = "今週の値動きは, 波型傾向です";
                            return;
                        } else if (y < 2.0) {
                            // 火曜PMに 4期型で確定!
                            // 水曜AM(5)にピークを迎える
                            result.D = 1;
                            result.peek = 5;
                            result.advice_type = "今週の値動きは, 4期型傾向です";
                        } else {
                            // 火曜PMに 3期型で確定!
                            // 火曜PM(4)にピークを迎える
                            result.C = 1;
                            result.peek = 4;
                            result.advice_type = "今週の値動きは, 3期型傾向です";
                        }
                    }
                }
            }

            // もし 8ベル未満の値下がりなら
            else {
                // ここどうしたらいいのかわからない。。。
                // とりあえず波形にしておくけれど, チャートに記入漏れがある
                // 月曜PMに, 波型の確定 ????
                result.A = 1;
                result.advice_type = "今週の値動きは, 波型傾向かも????";
                return;
            }
        }

        // 月曜AMでType-C型のスコープ
        // ジリ貧型, 3期型, 4期型に確定する
        // 火曜AM ~ 木曜PM の間に確定する
        else if (mondayType == "C") {
            result.advice_type = "火曜AM の買取値を入力";
            // 月曜PMに買取値が上がった場合
            // 3期型, 4期型に確定する
            // 火曜AMに確定する
            if (monday_pm > monday_am) {
                // 火曜AMでの値で判定する
                // 3期型, 4期型に確定する
                const tuesday_am = values[3];
                if (!tuesday_am) {
                    result.error_type = "火曜AM のカブ買取値が入力されていません";
                    return result;
                }
                // 日曜売値 / 火曜AM買取値を計算
                const z = sunday_am / tuesday_am;
                if (z < 1.4) {
                    // 火曜AMに 4期型で確定!
                    // 水曜AM(5)にピークを迎える
                    result.D = 1;
                    result.peek = 5;
                    result.advice_type = "今週の値動きは, 4期型傾向です";

                    return result;
                } else {
                    // 3期型で確定!
                    // 火曜PM(4)にピークを迎える
                    result.C = 1;
                    result.peek = 4;
                    result.advice_type = "今週の値動きは, 3期型傾向です";
                    return result;
                }
            }

            // 月曜PMに買取値が下がった場合
            // 木曜PMまで値を確認する
            // 値上がり(変調)すると, 3期型, 4期型が確定
            // 木曜PM時点で値上がりが確認できなければ, ジリ貧型
            else {
                // NOT_IMPLEMENTED
            }
        }

        // 月曜AMでType-D型のスコープ
        // 波形か4期型に確定する
        // 月曜PM ~ 火曜AM の間に確定する
        else if (mondayType == "D") {
            const y = sunday_am / monday_pm; // ここ, 図の表記が怪しくて, 逆かもしれない?
            if (y < 0.8) {
                // 月曜PMに, 波型の確定!
                // 波型なのでピークはなし
                result.A = 1;
                result.advice_type = "今週の値動きは, 波型傾向です";
                return;
            } else {
                result.advice_type = "火曜AM の買取値を入力で, 確定!";
                // 火曜AMの値で判定する
                const tuesday_am = values[3];
                if (!tuesday_am) {
                    result.error_type = "火曜AM のカブ買取値が入力されていません";
                    return result;
                }
                // 日曜売値 / 火曜AM買取値を計算
                const z = sunday_am / tuesday_am;
                if (z < 1.4) {
                    // 火曜AMに 波型で確定!
                    // 波形なのでピークはなし
                    result.A = 1;
                    result.advice_type = "今週の値動きは, 波形傾向です";
                    return result;
                } else {
                    // 火曜AMに 4期型で確定!
                    // 水曜AM(5) にピーク
                    result.D = 1;
                    result.peek = 5;
                    result.advice_type = "今週の値動きは, 4期型傾向です";
                    return result;
                }
            }
        }

        return result;
    }
}