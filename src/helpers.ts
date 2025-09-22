import { isNull } from '@migudevelop/types-utils/dist/Types/Types'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export type TimeFromMillisecondsType = {
  totalMilliseconds: number
  totalSeconds: number
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
}

/**
 * Convierte un valor en segundos a milisegundos.
 * @param seconds Segundos a convertir
 * @returns Milisegundos equivalentes
 */
export function convertSecondsToMilliseconds(seconds: number): number {
  return seconds * 1000
}

export function getTimeFromSeconds(seconds: number): TimeFromMillisecondsType {
  return getTimeFromMilliseconds(convertSecondsToMilliseconds(seconds))
}

/**
 * Devuelve un objeto con la descomposición de un tiempo dado en segundos a milisegundos, segundos, minutos y horas.
 * @param seconds Tiempo en segundos
 * @returns Objeto con los distintos valores de tiempo
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
