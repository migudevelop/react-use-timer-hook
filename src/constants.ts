import type { TimerState } from './useTimer.types'

export const INITIAL_TIMER_STATE: TimerState = {
  time: 0,
  finishTime: 0,
  isRunning: false,
  isPaused: false,
  isFinished: false,
  totalPauseTime: 0,
  pauseTime: 0,
  pauseStart: null,
  countUp: false
}

export const TIMER_ACTIONS = {
  START: 'START',
  PAUSE: 'PAUSE',
  TICK: 'TICK',
  PAUSE_TICK: 'PAUSE_TICK',
  RESET: 'RESET',
  SET_TIME: 'SET_TIME'
} as const
