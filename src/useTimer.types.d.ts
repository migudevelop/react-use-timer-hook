export interface UseTimerOptions {
  /** Initial time in seconds */
  time?: number
  /** Whether to count up (true) or down (false) */
  countUp?: boolean
  /** Autostart timer on mount */
  autoStart?: boolean
  /** Callback when timer ends (only for countdown) */
  onFinish?: () => void
  /** Callback on each tick when the timer is changing */
  onTick?: () => void
  /** Callback when the timer is reset */
  onReset?: () => void
  /** Callback when the timer is paused */
  onPause?: () => void
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
  /** Timestamp when the timer was paused, null if not paused */
  pauseStart: number | null
  /** Total time paused in ms */
  totalPauseTime: number
  /** Current time paused in ms */
  pauseTime: number
  /** Whether the timer counts up or down */
  countUp?: boolean
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
