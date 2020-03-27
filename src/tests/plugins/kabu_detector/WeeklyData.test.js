import { WeeklyData } from '~/plugins/kabu_detector.js'

test('WeeklyData::construct', () => {
  let w = new WeeklyData()
  expect(w.sunday.am).toBe(null)
  expect(w.saturday.am).toBe(null)

  // null is filled (interpolated)
  w = new WeeklyData([20, null, 39])
  expect(w.sunday.am).toBe(20)
  expect(w.sunday.pm).toBe((20 + 39) / 2)
  expect(w.monday.am).toBe(39)
  expect(w.saturday.pm).toBe(39)

  // first null is none filled and interpolated
  w = new WeeklyData([null, null, 39, null, 41])
  expect(w.sunday.am).toBe(null)
  expect(w.sunday.pm).toBe(null)
  expect(w.monday.am).toBe(39)
  expect(w.monday.pm).toBe(40)
  expect(w.tuesday.am).toBe(41)
  expect(w.saturday.pm).toBe(41)

  // already return number
  w = new WeeklyData(['20'])
  expect(w.sunday.am).toBe(20)
  expect(w.saturday.pm).toBe(20)
})

test('WeeklyData::magnitude', () => {
  const SundayAm = 134
  let w = new WeeklyData([SundayAm])

  expect(w.magnitude('monday.am')).toBe(1)
  expect(w.magnitude('saturday.pm')).toBe(1)

  w = new WeeklyData([SundayAm, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

  expect(w.magnitude('monday.am')).toBe(3 / SundayAm)
  expect(w.magnitude('monday.pm')).toBe(4 / SundayAm)
  expect(w.magnitude('tuesday.am')).toBe(5 / SundayAm)
  expect(w.magnitude('tuesday.pm')).toBe(6 / SundayAm)
  expect(w.magnitude('wednesday.am')).toBe(7 / SundayAm)
  expect(w.magnitude('wednesday.pm')).toBe(8 / SundayAm)
  expect(w.magnitude('thursday.am')).toBe(9 / SundayAm)
  expect(w.magnitude('thursday.pm')).toBe(10 / SundayAm)
  expect(w.magnitude('friday.am')).toBe(11 / SundayAm)
  expect(w.magnitude('friday.pm')).toBe(12 / SundayAm)
  expect(w.magnitude('saturday.am')).toBe(13 / SundayAm)
  expect(w.magnitude('saturday.pm')).toBe(14 / SundayAm)

  w = new WeeklyData()
  expect(w.magnitude('monday.am')).toBe(0)
  expect(w.magnitude('saturday.pm')).toBe(0)
})
