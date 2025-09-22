import { useCallback, useReducer } from 'react'

import { INITIAL_TIMER_STATE, TIMER_ACTIONS } from './constants'
import { getTotalPauseMilliseconds } from './helpers'
import type {
  TimerAction,
  TimerState,
  UseTimerReducerOptions
} from './useTimer.types'

function mergeState(
  state: TimerState = INITIAL_TIMER_STATE,
  newState: Partial<TimerState>
): TimerState {
  return { ...state, ...newState }
}

function timerReducer(state: typeof INITIAL_TIMER_STATE, action: TimerAction) {
  switch (action.type) {
    case TIMER_ACTIONS.START:
      return mergeState(state, {
        isRunning: true,
        isPaused: false,
        totalPauseTime: getTotalPauseMilliseconds(state),
        pauseStart: null,
        pauseTime: 0
      })
    case TIMER_ACTIONS.PAUSE:
      return mergeState(state, {
        isRunning: false,
        isPaused: true,
        pauseStart: Date.now()
      })
    case TIMER_ACTIONS.TICK:
      if (!state.isRunning) return state
      if (state.countUp) {
        if (state.time >= state.finishTime) {
          return mergeState(state, {
            isRunning: false,
            time: state.finishTime
          })
        }
        return mergeState(state, { time: state.time + 1 })
      } else {
        if (state.time > 0) {
          return mergeState(state, { time: state.time - 1 })
        }
        return mergeState(state, { isRunning: false, time: 0 })
      }
    case TIMER_ACTIONS.PAUSE_TICK:
      if (state.isRunning) return state
      return mergeState(state, { pauseTime: state.pauseTime + 1 })
    case TIMER_ACTIONS.RESET:
      return mergeState(state, {
        ...INITIAL_TIMER_STATE,
        time: action.time,
        finishTime: action.finishTime,
        isRunning: action.autoStart,
        countUp: action.countUp
      })
    case TIMER_ACTIONS.SET_TIME:
      return mergeState(state, { time: action.value })
    default:
      return state
  }
}

export function useTimerReducer({
  time = 0,
  finishTime = 0,
  countUp = false,
  autoStart = false
}: UseTimerReducerOptions = {}) {
  const [state, dispatch] = useReducer(timerReducer, {
    ...INITIAL_TIMER_STATE,
    time,
    finishTime,
    isRunning: autoStart,
    countUp
  })

  // Start timer
  const start = useCallback(() => dispatch({ type: TIMER_ACTIONS.START }), [])

  // Pause timer
  const pause = useCallback(() => dispatch({ type: TIMER_ACTIONS.PAUSE }), [])

  // Reset timer
  const reset = useCallback(
    () =>
      dispatch({
        type: TIMER_ACTIONS.RESET,
        time,
        autoStart,
        countUp,
        finishTime
      }),
    [time, autoStart, countUp, finishTime]
  )

  // Set time
  const setTime = useCallback(
    (value: number) => dispatch({ type: TIMER_ACTIONS.SET_TIME, value }),
    []
  )

  // Timer tick
  const tick = useCallback(() => {
    dispatch({ type: TIMER_ACTIONS.TICK })
  }, [])

  // Pause tick
  const pauseTick = useCallback(() => {
    dispatch({ type: TIMER_ACTIONS.PAUSE_TICK })
  }, [])

  return {
    ...state,
    start,
    tick,
    pauseTick,
    pause,
    reset,
    setTime
  }
}
