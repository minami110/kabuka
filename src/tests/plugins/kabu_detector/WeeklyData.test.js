import { WeeklyData } from "~/plugins/kabu_detector.js"

test('WeeklyData::construct', () => {
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
    let sunday_am = 134
    let w = new WeeklyData([sunday_am])

    expect(w.magnitude("monday.am")).toBe(1)
    expect(w.magnitude("saturday.pm")).toBe(1)

    w = new WeeklyData([sunday_am, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

    expect(w.magnitude("monday.am")).toBe(3 / sunday_am)
    expect(w.magnitude("monday.pm")).toBe(4 / sunday_am)
    expect(w.magnitude("tuesday.am")).toBe(5 / sunday_am)
    expect(w.magnitude("tuesday.pm")).toBe(6 / sunday_am)
    expect(w.magnitude("wednesday.am")).toBe(7 / sunday_am)
    expect(w.magnitude("wednesday.pm")).toBe(8 / sunday_am)
    expect(w.magnitude("thursday.am")).toBe(9 / sunday_am)
    expect(w.magnitude("thursday.pm")).toBe(10 / sunday_am)
    expect(w.magnitude("friday.am")).toBe(11 / sunday_am)
    expect(w.magnitude("friday.pm")).toBe(12 / sunday_am)
    expect(w.magnitude("saturday.am")).toBe(13 / sunday_am)
    expect(w.magnitude("saturday.pm")).toBe(14 / sunday_am)

    w = new WeeklyData()
    expect(w.magnitude("monday.am")).toBe(0)
    expect(w.magnitude("saturday.pm")).toBe(0)
});

