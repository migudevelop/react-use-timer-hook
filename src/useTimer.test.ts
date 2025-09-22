import { renderHook, act } from '@testing-library/react'

import { useTimer } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.time).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.pauseStart).toBe(null)
    expect(result.current.totalPauseTime.totalMilliseconds).toBe(0)
    expect(result.current.pauseTime.totalSeconds).toBe(0)
  })

  it('starts and ticks down (countdown)', async () => {
    const { result } = renderHook(() => useTimer({ time: 2, autoStart: true }))
    expect(result.current.isRunning).toBe(true)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.time).toBe(1)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.time).toBe(0)
    // Esperar a que el efecto de isRunning se actualice
    await Promise.resolve()
    expect(result.current.isRunning).toBe(false)
  })

  it('calls onFinish when countdown reaches 0', () => {
    const onFinish = vi.fn()
    renderHook(() => useTimer({ time: 1, autoStart: true, onFinish }))
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(onFinish).toHaveBeenCalled()
  })

  it('calls onTick every second', () => {
    const onTick = vi.fn()
    renderHook(() => useTimer({ time: 2, autoStart: true, onTick }))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onTick).toHaveBeenCalledTimes(2)
  })

  it('calls onReset when initialTime changes', () => {
    const onReset = vi.fn()
    const { rerender } = renderHook((props) => useTimer(props), {
      initialProps: { time: 1, onReset }
    })
    rerender({ time: 2, onReset })
    expect(onReset).toHaveBeenCalled()
  })

  it('pause and pauseTick increments pauseTime', () => {
    const { result } = renderHook(() => useTimer({ time: 2, autoStart: true }))
    act(() => {
      result.current.pause()
    })
    expect(result.current.isRunning).toBe(false)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.pauseTime.totalSeconds).toBeGreaterThanOrEqual(2)
  })

  it('reset resets timer', () => {
    const { result } = renderHook(() => useTimer({ time: 2, autoStart: true }))
    act(() => {
      result.current.reset()
    })
    expect(result.current.time).toBe(2)
  })

  it('countUp mode counts up to finishTime', () => {
    const { result } = renderHook(() =>
      useTimer({ time: 0, countUp: true, autoStart: true })
    )
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.time).toBe(0)
    // In countUp mode, finishTime is 0 by default, so timer stops immediately
    expect(result.current.isRunning).toBe(false)
  })
})
