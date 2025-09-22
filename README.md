# react-use-timer-hook

A flexible React timer hook supporting countdown, count-up, pause, and granular time tracking.

## Usage

```tsx
import useTimer from "react-use-timer-hook";

const TimerComponent = () => {
  const { hours, minutes, seconds, isRunning, start, pause, reset } = useTimer({
    time: 60, // initial time in seconds
    countUp: false, // set to true for count-up mode
    autoStart: false,
  });

  return (
    <div>
      <span>
        {hours}:{minutes}:{seconds}
      </span>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

## Development

- Lint: `pnpm exec eslint .`
- Format: `pnpm exec prettier --write .`
- Build: `pnpm exec tsc`

## License

MIT
