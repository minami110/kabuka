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




});
