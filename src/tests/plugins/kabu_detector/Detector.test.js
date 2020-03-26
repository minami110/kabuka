import { Detector, Prediction } from "~/plugins/kabu_detector.js"

test('Detector::construct', () => {
    let d = new Detector()
});



test('Detector::detect_v_tobimori', () => {

    // きちんと予測できるかのテストを行う
    let datas = [92, null]
    // 月曜朝AM なら 2
    let dayIndex = 1

    // 日曜時点での予測
    let r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.movingTypes).toEqual(["wave", "poor", "P3", "P4"])

    // 日曜時点でデータ未入力
    datas = [null, null]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.movingTypes).toEqual(["wave", "poor", "P3", "P4"])

    //====== 月曜AMの予測 =======//
    dayIndex = 2

    // 入力済み
    datas = [92, null, 82]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.ambiguous_weight).toBe(0);
    expect(r.movingTypes).toEqual(["poor", "P3", "P4"])

    // 未入力
    datas = [92, null, null]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.ambiguous_weight).toBe(10);
    expect(r.movingTypes).toEqual(["wave", "P4"])

    //===== 月曜PMの予測 ======
    dayIndex = 3

    // 入力済み
    datas = [92, null, 82, 77]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.ambiguous_weight).toBe(0);
    expect(r.movingTypes).toEqual(["poor", "P3", "P4"])

    // すべて未入力
    datas = [92, null, null, null]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.ambiguous_weight).toBe(15);
    // 月曜PM 未入力
    datas = [92, null, 82, null]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.ambiguous_weight).toBe(5);
    // 月曜AM未入力
    datas = [92, null, null, 77]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    expect(r.ambiguous_weight).toBe(10);


    /*
    //===== 火曜AMの予測 ======
    dayIndex = 4
    // 入力済み
    datas = [92, null, 82, 77, 138]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    console.log(r)

    //===== 火曜PMの予測 ======
    dayIndex = 5
    // 入力済み
    datas = [92, null, 82, 77, 138, 131]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    console.log(r)

    //===== 水曜AMの予測 ======
    dayIndex = 6
    // 入力済み
    datas = [92, null, 82, 77, 138, 131, 154]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    console.log(r)

    //===== 水曜PMの予測 ======
    dayIndex = 7
    // 入力済み
    datas = [92, null, 82, 77, 138, 131, 154, 161]
    r = Detector.detect_v_tobimori(datas, dayIndex)
    console.log(r)
    */

});


// P4を予測してほしいテスト
test('Detector::detect_P4', () => {

    let r = null
    let timeIndex = 0

    const data_a = [110, null, 95, 91, 86, 81, 75, 72, 115, 210]

    console.log("az")

    // 木曜AM時点で P3かP4
    timeIndex = 8
    r = Detector.detect_v_tobimori(data_a, timeIndex)
    expect(r.movingTypes).toEqual(["P3", "P4"])
    expect(r.peeks).toEqual([10, 11])

    // 木曜PM時点で, P3に確定
    timeIndex = 9
    r = Detector.detect_v_tobimori(data_a, timeIndex)
    expect(r.movingTypes).toEqual(["P3"])
    expect(r.peeks).toEqual([10])


    console.log("nemu")
    const data_b = [98, null, 50, 46, 124, 131, 181, 191, 165]

    // 月曜AM
    timeIndex = 2
    r = Detector.detect_v_tobimori(data_b, timeIndex)
    // console.log(r)
    //expect(r.movingTypes).toEqual(["wave", "P4"])

    // 月曜PM
    timeIndex = 3
    r = Detector.detect_v_tobimori(data_b, timeIndex)
    // この時点で
    // console.log(r)



    const data_c = ["92", null, "82", "77", "138", "131", "154", "161", "142", null, null, null, null, null]

    console.log("-------nose P4-----")

    // 月曜AM type-c
    timeIndex = 2
    r = Detector.detect_v_tobimori(data_c, timeIndex)
    console.log("-- 月曜AM --")
    console.log(r)

    // 月曜PM ここで倍値が下がる,  ジリ貧ループへ
    timeIndex = 3
    r = Detector.detect_v_tobimori(data_c, timeIndex)
    console.log("-- 月曜PM --")
    console.log(r)

    // 火曜AM ジリ貧だったが, ここで変調する, 次で確定する
    timeIndex = 4
    r = Detector.detect_v_tobimori(data_c, timeIndex)
    console.log("-- 火曜AM 変調する --")
    console.log(r)

    // 火曜PM P4の確定
    timeIndex = 5
    r = Detector.detect_v_tobimori(data_c, timeIndex)
    console.log("-- 火曜PM --")
    console.log(r)


})