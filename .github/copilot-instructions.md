# React Timer Hook - AI Coding Instructions

## Project Overview

This is a React custom hook library providing a flexible timer with countdown/countup modes, pause functionality, and comprehensive time tracking. The hook uses a reducer pattern for state management and provides granular time breakdowns.

## Architecture Patterns

### Core Hook Structure

- **Main Hook**: `useTimer` in `src/useTimer.ts` - combines reducer logic with React effects
- **State Management**: `useTimerReducer` in `src/useTimerReducer.ts` - pure reducer logic
- **Types**: `src/useTimer.types.d.ts` - comprehensive TypeScript definitions
- **Utilities**: `src/helpers.ts` - time conversion and calculations using dayjs

### State Management Pattern

The timer uses a reducer pattern with specific action types defined in `src/constants.ts`:

```typescript
// Always use these constants for actions, never hardcode strings
;(START, PAUSE, TICK, PAUSE_TICK, RESET, SET_TIME)
```

### Dual Timer Modes

- **Countdown**: `countUp: false` (default) - decrements from initial time to 0
- **Count Up**: `countUp: true` - increments from 0 to finish time
- The `finishTime` parameter is crucial for count-up mode logic

## Key Implementation Details

### Pause Tracking System

The timer has sophisticated pause tracking:

- `pauseStart`: timestamp when pause began (null when not paused)
- `totalPauseTime`: accumulated pause duration in milliseconds
- `pauseTime`: current pause session duration in seconds
- Use `getTotalPauseMilliseconds()` helper for calculations

### Time Conversion Pattern

Always use helper functions from `src/helpers.ts`:

- `getTimeFromSeconds()` - converts seconds to time breakdown object
- `getTimeFromMilliseconds()` - converts milliseconds to time breakdown
- Returns: `{totalMilliseconds, totalSeconds, milliseconds, seconds, minutes, hours}`

### Effect Dependencies

When modifying useTimer, pay attention to effect dependencies:

- Timer interval effect depends on `[isRunning, tick, onTick]`
- Pause interval effect depends on `[isRunning, pauseTick, isPaused]`
- Reset effect depends on `[reset, onReset]`

## TypeScript Conventions

### Interface Structure

- `UseTimerOptions` - hook configuration (all optional with defaults)
- `TimerState` - internal state structure
- `TimerAction` - discriminated union for reducer actions
- `UseTimerReducerOptions` - reducer-specific configuration

### Callback Pattern

All callbacks are optional and follow the pattern:

```typescript
onFinish?: () => void;  // Called when countdown reaches 0
onTick?: () => void;    // Called every second when running
onReset?: () => void;   // Called when timer resets
```

## Dependencies

### External Libraries

- `dayjs` with duration plugin for time calculations
- `@migudevelop/types-utils` for type checking utilities (e.g., `isNull`)
- React 16.8+ for hooks support

### Import Patterns

- Always destructure imports instead of namespace imports e.g:
  import { convertSecondsToMilliseconds, getTimeFromSeconds, getTimeFromMilliseconds } from './helpers'

```typescript
// Always import from specific modules
import { isNull } from '@migudevelop/types-utils'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
```

## Development Workflow

### File Organization

- `src/index.ts` - single default export of useTimer
- Core logic split between hook (effects) and reducer (state)
- Helpers contain pure functions for time calculations
- Constants prevent magic strings in actions

### Testing Considerations

- Timer uses `setInterval` with 1-second intervals
- Pause logic runs separate intervals for tracking pause duration
- State changes trigger effects, so test timing carefully
- Mock `Date.now()` for pause calculations in tests

## Common Patterns

### Adding New Timer Features

1. Define action type in `src/constants.ts`
2. Add action to `TimerAction` union type
3. Implement in `timerReducer` switch statement
4. Add callback method in `useTimerReducer`
5. Wire up in main `useTimer` hook if needed

### Time Display Components

Use the returned time breakdown object:

```typescript
const { hours, minutes, seconds, totalSeconds } = useTimer(options)
// Display as HH:MM:SS or use totalSeconds for progress bars
```

### Conditional Timer Behavior

Check state flags: `isRunning`, `isPaused` for UI state
Use `time === 0` (countdown) or `time >= finishTime` (countup) for completion
