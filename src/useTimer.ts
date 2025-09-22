import { isNull } from '@migudevelop/types-utils'
import { useEffect, useRef } from 'react'

import { getTimeFromMilliseconds, getTimeFromSeconds } from './helpers'
import type { UseTimerOptions } from './useTimer.types'
import { useTimerReducer } from './useTimerReducer'

const INTERVAL = 1000 // 1 second

export function useTimer({
  time: initialTime = 0,
  countUp = false,
  autoStart = false,
  onFinish,
  onTick,
  onReset
}: UseTimerOptions = {}) {
  const finishTime = countUp ? initialTime : 0
  const {
    isRunning,
    isPaused,
    pauseStart,
    totalPauseTime,
    pauseTime,
    time,
    start,
    pause,
    pauseTick,
    reset,
    tick
  } = useTimerReducer({
    time: countUp ? 0 : initialTime,
    finishTime,
    autoStart,
    countUp
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pauseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer logic
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      tick()
      onTick?.()
    }, INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick, onTick])

  // Pause timer logic
  useEffect(() => {
    if (isRunning || !isPaused) {
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current)
      return
    }
    pauseIntervalRef.current = setInterval(() => {
      pauseTick()
    }, INTERVAL)
    return () => {
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current)
    }
  }, [isRunning, pauseTick, isPaused])

  // Reset timer if initialTime changes
  useEffect(() => {
    reset()
    onReset?.()
  }, [reset, onReset])

  // If timer is running and pauseStart is set, update totalPauseTime
  useEffect(() => {
    if (isRunning && isNull(pauseStart)) {
      start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  // Expire callback
  useEffect(() => {
    if (time === finishTime && !isRunning) {
      onFinish?.()
    }
  }, [time, onFinish, finishTime, isRunning])

  return {
    ...getTimeFromSeconds(time),
    isRunning,
    start,
    pause,
    reset,
    time,
    totalPauseTime: getTimeFromMilliseconds(totalPauseTime),
    pauseTime: getTimeFromSeconds(pauseTime),
    pauseStart
  }
}
