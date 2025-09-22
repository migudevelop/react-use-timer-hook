# React Use Timer Hook
![GitHub License](https://img.shields.io/github/license/migudevelop/react-use-timer-hook)

A flexible and easy-to-use React custom hook for timer functionality, supporting countdown and count-up modes, pause/resume, and detailed time tracking. Perfect for building timers, countdowns, stopwatches, and progress indicators in your React apps.

## Features

- **Countdown & Count Up**: Switch between decrementing and incrementing timer modes.
- **Pause/Resume**: Pause the timer and track total pause duration.
- **Granular Time Breakdown**: Get hours, minutes, seconds, and milliseconds.
- **Reducer-based State**: Predictable state management using a reducer pattern.
- **Custom Callbacks**: Hooks for onTick, onFinish, and onReset events.
- **TypeScript Support**: Fully typed API for safety and autocompletion.

## Installation

```bash
npm install react-use-timer-hook
# or
yarn add react-use-timer-hook
# or
pnpm add react-use-timer-hook
```

## Usage

```tsx
import useTimer from 'react-use-timer-hook';

function TimerComponent() {
  const {
    hours,
    minutes,
    seconds,
    milliseconds,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
  } = useTimer({
    initialTime: 60, // seconds
    countUp: false,  // countdown mode
    onFinish: () => alert('Time is up!'),
  });

  return (
    <div>
      <h1>{`${hours}:${minutes}:${seconds}`}</h1>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
      <div>{isRunning ? 'Running' : isPaused ? 'Paused' : 'Stopped'}</div>
    </div>
  );
}
```

## API

### `useTimer(options)`

#### Options

| Name         | Type      | Default | Description                                      |
|--------------|-----------|---------|--------------------------------------------------|
| time  | number    | 60      | Initial time in seconds                          |
| countUp      | boolean   | false   | If true, timer counts up instead of down         |
| autoStart    | boolean   | false   | Start timer automatically                        |
| onFinish     | function  | -       | Callback when timer finishes                     |
| onTick       | function  | -       | Callback on every tick                           |
| onReset      | function  | -       | Callback when timer resets                       |

#### Return Values

| Name              | Type     | Description                                 |
|-------------------|----------|---------------------------------------------|
| hours             | number   | Current hours                               |
| minutes           | number   | Current minutes                             |
| seconds           | number   | Current seconds                             |
| milliseconds      | number   | Current milliseconds                        |
| totalSeconds      | number   | Total seconds remaining or elapsed          |
| totalMilliseconds | number   | Total milliseconds remaining or elapsed     |
| isRunning         | boolean  | Timer is running                            |
| isPaused          | boolean  | Timer is paused                             |
| pauseTime         | object   | Current pause session duration    |
| totalPauseTime    | object   | Total pause time             |
| start             | function | Start or resume the timer                   |
| pause             | function | Pause the timer                             |
| reset             | function | Reset the timer to initial state            |
| setTime           | function | Set the timer to a specific time (seconds)  |

## Advanced Usage

- **Count Up Mode**: Set `countUp: true`.
- **Custom Time Display**: Use `hours`, `minutes`, `seconds`, or `totalSeconds` for progress bars.
- **Pause Tracking**: Access `pauseTime` and `totalPauseTime` for analytics or UI.

## Example

```tsx
const timer = useTimer({
  time: 20,
  countUp: true,
  autoStart: true,
  onFinish: () => console.log('Done!'),
});
```

## Development

- Built with React hooks and TypeScript
- Uses `dayjs` for time calculations
- Reducer pattern for state management

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/migudevelop/react-use-timer-hook/blob/main/LICENSE) file for details.
