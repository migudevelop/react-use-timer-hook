export type TimeFromMillisecondsType = {
  totalMilliseconds: number
  totalSeconds: number
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
}

export interface UseTimerReducerOptions {
  /** Initial time in seconds */
  time?: number
  /** Finish time in seconds */
  finishTime?: number
  /** Whether to count up (true) or down (false) */
  countUp?: boolean
  /** Autostart timer on mount */
  autoStart?: boolean
}

export interface TimerState {
  /** Time in seconds */
  time: number
  /** Finish time in seconds */
  finishTime: number
  /** Whether the timer is running */
  isRunning: boolean
  /** Whether the timer is paused */
  isPaused: boolean
  /** Whether the timer has finished */
  isFinished: boolean
  /** Timestamp when the timer was paused, null if not paused */
  pauseStart: number | null
  /** Total time paused in ms */
  totalPauseTime: number
  /** Current time paused in ms */
  pauseTime: number
  /** Whether the timer counts up or down */
  countUp?: boolean
}

export interface StateReturn
  extends Omit<
      TimerState,
      'countUp' | 'pauseTime' | 'totalPauseTime' | 'finishTime'
    >,
    TimeFromMillisecondsType {
  /** Total pause time as a breakdown object */
  totalPauseTime: TimeFromMillisecondsType
  /** Current pause time as a breakdown object */
  pauseTime: TimeFromMillisecondsType
  /** Finish time as a breakdown object */
  finishTime: TimeFromMillisecondsType
}

export interface UseTimerOptions {
  /** Initial time in seconds */
  time?: number
  /** Whether to count up (true) or down (false) */
  countUp?: boolean
  /** Autostart timer on mount */
  autoStart?: boolean
  /** Callback when timer ends (only for countdown) */
  onFinish?: (state: StateReturn) => void
  /** Callback on each tick when the timer is changing */
  onTick?: (state: StateReturn) => void
  /** Callback when the timer is reset */
  onReset?: (state: StateReturn) => void
  /** Callback when the timer is paused */
  onPause?: (state: StateReturn) => void
  /** Callback when the timer is started */
  onStart?: (state: StateReturn) => void
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'TICK' }
  | { type: 'PAUSE_TICK' }
  | {
      type: 'RESET'
      time: number
      autoStart: boolean
      countUp: boolean
      finishTime: number
    }
  | { type: 'SET_TIME'; value: number }
