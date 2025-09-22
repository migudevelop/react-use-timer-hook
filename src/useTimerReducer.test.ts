import { act, renderHook } from '@testing-library/react'

import { useTimerReducer } from './useTimerReducer'

describe('useTimerReducer', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useTimerReducer())
    expect(result.current.time).toBe(0)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(false)
    expect(result.current.pauseStart).toBe(null)
    expect(result.current.totalPauseTime).toBe(0)
    expect(result.current.pauseTime).toBe(0)
  })

  it('starts timer', () => {
    const { result } = renderHook(() => useTimerReducer())
    act(() => result.current.start())
    expect(result.current.isRunning).toBe(true)
    expect(result.current.isPaused).toBe(false)
    expect(result.current.pauseStart).toBe(null)
    expect(result.current.pauseTime).toBe(0)
  })

  it('pauses timer', () => {
    const { result } = renderHook(() => useTimerReducer())
    act(() => result.current.pause())
    expect(result.current.isRunning).toBe(false)
    expect(result.current.isPaused).toBe(true)
    expect(
      typeof result.current.pauseStart === 'number' ||
        result.current.pauseStart === null
    ).toBe(true)
  })

  it('ticks down in countdown mode', () => {
    const { result } = renderHook(() => useTimerReducer({ time: 2 }))
    act(() => result.current.start())
    act(() => result.current.tick())
    expect(result.current.time).toBe(1)
    act(() => result.current.tick())
    expect(result.current.time).toBe(0)
    act(() => result.current.tick())
    expect(result.current.time).toBe(0)
    expect(result.current.isRunning).toBe(false)
  })

  it('ticks up in countup mode', () => {
    const { result } = renderHook(() =>
      useTimerReducer({ time: 0, finishTime: 2, countUp: true })
    )
    act(() => result.current.start())
    act(() => result.current.tick())
    expect(result.current.time).toBe(1)
    act(() => result.current.tick())
    expect(result.current.time).toBe(2)
    act(() => result.current.tick())
    expect(result.current.time).toBe(2)
    expect(result.current.isRunning).toBe(false)
  })

  it('pauseTick only increments pauseTime when paused', () => {
    const { result } = renderHook(() => useTimerReducer({ time: 5 }))
    act(() => result.current.pause())
    const prev = result.current.pauseTime
    act(() => result.current.pauseTick())
    expect(result.current.pauseTime).toBe(prev + 1)
    act(() => result.current.start())
    act(() => result.current.pauseTick())
    expect(result.current.totalPauseTime).toBeGreaterThanOrEqual(0)
    expect(result.current.pauseTime).toBe(0)
  })

  it('reset sets state to initial', () => {
    const { result } = renderHook(() =>
      useTimerReducer({
        time: 5,
        finishTime: 10,
        countUp: true,
        autoStart: true
      })
    )
    act(() => result.current.start())
    act(() => result.current.pause())
    act(() => result.current.reset())
    expect(result.current.time).toBe(5)
    expect(result.current.finishTime).toBe(10)
    expect(result.current.isRunning).toBe(true)
    expect(result.current.countUp).toBe(true)
  })

  it('setTime sets the time', () => {
    const { result } = renderHook(() => useTimerReducer({ time: 1 }))
    act(() => result.current.setTime(42))
    expect(result.current.time).toBe(42)
  })
})
