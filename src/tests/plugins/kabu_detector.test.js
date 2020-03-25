import { WeeklyData } from "~/plugins/kabu_detector.js"

test('WeeklyData construct', () => {
    let w = new WeeklyData()
    expect(w.sunday.am).toBe(null);
    expect(w.saturday.am).toBe(null);

    // null is filled
    w = new WeeklyData([20, null, 39])
    expect(w.sunday.am).toBe(20);
    expect(w.sunday.pm).toBe(20);
    expect(w.saturday.pm).toBe(39);

    w = new WeeklyData([null, null, 39])
    expect(w.sunday.am).toBe(null);
    expect(w.sunday.pm).toBe(null);
    expect(w.saturday.pm).toBe(39);

    // already return number
    w = new WeeklyData(["20"])
    expect(w.saturday.pm).toBe(20);

});

test('WeeklyData::magnitude', () => {
    let w = new WeeklyData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])

});

