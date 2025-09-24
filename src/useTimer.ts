import { isNull } from '@migudevelop/types-utils'
import { useEffect, useMemo, useRef } from 'react'

import { getTimeFromMilliseconds, getTimeFromSeconds } from './helpers'
import type { StateReturn, UseTimerOptions } from './useTimer.types'
import { useTimerReducer } from './useTimerReducer'

const INTERVAL = 1000 // 1 second

/**
 * React hook for a flexible timer supporting countdown, count-up, pause, and granular time tracking.
 * @param options UseTimerOptions configuration object
 * @returns Timer state and control methods
 */
export function useTimer({
  time: initialTime = 0,
  countUp = false,
  autoStart = false,
  onFinish,
  onTick,
  onReset,
  onPause,
  onStart
}: UseTimerOptions = {}) {
  const finishTime = countUp ? initialTime : 0
  const {
    isRunning,
    isPaused,
    isFinished,
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

  const stateToReturn: StateReturn = useMemo(
    () => ({
      ...getTimeFromSeconds(time),
      isRunning,
      isPaused,
      isFinished,
      time,
      finishTime: getTimeFromSeconds(finishTime),
      totalPauseTime: getTimeFromMilliseconds(totalPauseTime),
      pauseTime: getTimeFromSeconds(pauseTime),
      pauseStart
    }),
    [
      time,
      isRunning,
      isPaused,
      isFinished,
      totalPauseTime,
      pauseTime,
      pauseStart,
      finishTime
    ]
  )

  /**
   * Timer interval effect: handles ticking when running
   */
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      tick()
      onTick?.(stateToReturn)
    }, INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, tick, onTick])

  useEffect(() => {
    if (isPaused) {
      onPause?.(stateToReturn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, onPause])

  /**
   * Pause interval effect: tracks pause duration when paused
   */
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

  /**
   * Reset effect: resets timer if initialTime changes
   */
  useEffect(() => {
    reset()
    onReset?.(stateToReturn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, onReset])

  /**
   * Syncs pause state: if timer is running and pauseStart is set, update totalPauseTime
   */
  useEffect(() => {
    if (isRunning && isNull(pauseStart)) {
      start()
      onStart?.(stateToReturn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  /**
   * Expire callback: calls onFinish when timer completes
   */
  useEffect(() => {
    if (time === finishTime && !isRunning) {
      onFinish?.(stateToReturn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, onFinish, finishTime, isRunning])

  return {
    ...stateToReturn,
    start,
    pause,
    reset
  }
}
