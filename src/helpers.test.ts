import {
  convertSecondsToMilliseconds,
  getTimeFromSeconds,
  getTimeFromMilliseconds,
  getTotalPauseMilliseconds
} from './helpers'

describe('helpers', () => {
  describe('convertSecondsToMilliseconds', () => {
    it('converts seconds to milliseconds', () => {
      expect(convertSecondsToMilliseconds(2)).toBe(2000)
      expect(convertSecondsToMilliseconds(0)).toBe(0)
      expect(convertSecondsToMilliseconds(-1)).toBe(-1000)
    })
  })

  describe('getTimeFromSeconds', () => {
    it('returns correct breakdown', () => {
      const t = getTimeFromSeconds(3661.789)
      expect(t.hours).toBe(1)
      expect(t.minutes).toBe(1)
      expect(t.seconds).toBe(1)
      expect(t.milliseconds).toBeGreaterThanOrEqual(0)
      expect(t.totalSeconds).toBeCloseTo(3661.789, 3)
      expect(t.totalMilliseconds).toBeCloseTo(3661789, 0)
    })
  })

  describe('getTimeFromMilliseconds', () => {
    it('returns correct breakdown', () => {
      const t = getTimeFromMilliseconds(3661789)
      expect(t.hours).toBe(1)
      expect(t.minutes).toBe(1)
      expect(t.seconds).toBe(1)
      expect(t.milliseconds).toBeGreaterThanOrEqual(0)
      expect(t.totalSeconds).toBeCloseTo(3661.789, 3)
      expect(t.totalMilliseconds).toBeCloseTo(3661789, 0)
    })
  })

  describe('getTotalPauseMilliseconds', () => {
    it('returns totalPauseTime if pauseStart is null', () => {
      expect(
        getTotalPauseMilliseconds({ pauseStart: null, totalPauseTime: 1234 })
      ).toBe(1234)
    })
    it('returns totalPauseTime + elapsed if pauseStart is not null', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now + 5000)
      expect(
        getTotalPauseMilliseconds({ pauseStart: now, totalPauseTime: 1000 })
      ).toBe(6000)
      vi.restoreAllMocks()
    })
    it('never returns less than totalPauseTime', () => {
      const now = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(now - 1000)
      expect(
        getTotalPauseMilliseconds({ pauseStart: now, totalPauseTime: 2000 })
      ).toBe(2000)
      vi.restoreAllMocks()
    })
  })
})
