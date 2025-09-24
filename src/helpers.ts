import { isNull } from '@migudevelop/types-utils/dist/Types/Types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import type { TimeFromMillisecondsType } from './useTimer.types'

dayjs.extend(duration)

/**
 * Converts a value in seconds to milliseconds.
 * @param seconds Seconds to convert
 * @returns Equivalent milliseconds
 */
export function convertSecondsToMilliseconds(seconds: number): number {
  return seconds * 1000
}

/**
 * Returns a time breakdown object from a value in seconds.
 * @param seconds Time in seconds
 * @returns Object with time values
 */
export function getTimeFromSeconds(seconds: number): TimeFromMillisecondsType {
  return getTimeFromMilliseconds(convertSecondsToMilliseconds(seconds))
}

/**
 * Returns a breakdown object for a given time in milliseconds.
 * @param milliseconds Time in milliseconds
 * @returns Object with total and component time values
 */
export function getTimeFromMilliseconds(
  milliseconds: number
): TimeFromMillisecondsType {
  const duration = dayjs.duration(milliseconds)

  return {
    totalMilliseconds: duration.asMilliseconds(),
    totalSeconds: duration.asSeconds(),
    milliseconds: duration.milliseconds(),
    seconds: duration.seconds(),
    minutes: duration.minutes(),
    hours: duration.hours()
  }
}

/**
 * Calculates the total pause time in milliseconds, including the current pause session if active.
 * @param params Object with pauseStart and totalPauseTime
 * @returns Total pause time in milliseconds
 */
export function getTotalPauseMilliseconds({
  pauseStart,
  totalPauseTime
}: {
  pauseStart: number | null
  totalPauseTime: number
}): number {
  if (isNull(pauseStart)) {
    return totalPauseTime
  }
  return totalPauseTime + Math.max(Date.now() - pauseStart, 0)
}
