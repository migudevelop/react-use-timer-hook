import { useCallback, useReducer } from 'react'

import { INITIAL_TIMER_STATE, TIMER_ACTIONS } from './constants'
import { getTotalPauseMilliseconds } from './helpers'
import type {
  TimerAction,
  TimerState,
  UseTimerReducerOptions
} from './useTimer.types'

/**
 * Merges the current timer state with a partial new state.
 * @param state Current timer state
 * @param newState Partial state to merge
 * @returns New merged timer state
 */
function mergeState(
  state: TimerState = INITIAL_TIMER_STATE,
  newState: Partial<TimerState>
): TimerState {
  return { ...state, ...newState }
}

/**
 * Reducer function for timer state transitions.
 * @param state Current timer state
 * @param action TimerAction to apply
 * @returns New timer state
 */
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
        const time = state.time + 1
        if (time < state.finishTime) {
          return mergeState(state, { time: state.time + 1 })
        }
        return mergeState(state, {
          isRunning: false,
          time: state.finishTime
        })
      } else {
        const time = state.time - 1
        if (time > 0) {
          return mergeState(state, { time })
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

/**
 * Custom reducer hook for timer state and actions.
 * @param options UseTimerReducerOptions configuration
 * @returns Timer state and reducer action methods
 */
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

  /** Start the timer */
  const start = useCallback(() => dispatch({ type: TIMER_ACTIONS.START }), [])

  /** Pause the timer */
  const pause = useCallback(() => dispatch({ type: TIMER_ACTIONS.PAUSE }), [])

  /** Reset the timer to initial state */
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

  /** Set the timer to a specific value */
  const setTime = useCallback(
    (value: number) => dispatch({ type: TIMER_ACTIONS.SET_TIME, value }),
    []
  )

  /** Advance the timer by one tick */
  const tick = useCallback(() => {
    dispatch({ type: TIMER_ACTIONS.TICK })
  }, [])

  /** Advance the pause timer by one tick */
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
