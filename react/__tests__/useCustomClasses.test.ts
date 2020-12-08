import { renderHook } from '@vtex/test-tools/react'

import useCustomClasses, { SYMBOL_CUSTOM_CLASSES } from '../useCustomClasses'

test('returns the same object keyed with "__useCustomClasses"', () => {
  const obj = {
    container: 'potato-container',
    wrapper: [{ name: 'wrapper' }, 'wrapper--potato'],
    item: { name: 'item' },
  }

  const callback = jest.fn(() => ({ ...obj }))

  const { result } = renderHook(() => {
    return useCustomClasses(callback)
  })

  expect(result.current.__useCustomClasses).toBe(SYMBOL_CUSTOM_CLASSES)
  expect(result.current).toMatchObject(obj)
  expect(callback).toHaveBeenCalledTimes(1)
})

test('memoizes the result with no dependencies', () => {
  const obj = {
    container: 'potato-container',
    wrapper: [{ name: 'wrapper' }, 'wrapper--potato'],
    item: { name: 'item' },
  }

  const callback = jest.fn(() => ({ ...obj }))

  const { rerender } = renderHook(() => {
    return useCustomClasses(callback)
  })

  rerender()
  rerender()

  expect(callback).toHaveBeenCalledTimes(1)
})

test('returns new object when dependencies change', () => {
  const obj = {
    container: 'potato-container',
    wrapper: [{ name: 'wrapper' }, 'wrapper--potato'],
    item: { name: 'item' },
  }

  let dependency = 'foo'

  const callback = jest.fn(() => ({ ...obj }))

  const { rerender } = renderHook(() => {
    return useCustomClasses(callback, [dependency])
  })

  expect(callback).toHaveBeenCalledTimes(1)
  rerender()

  dependency = 'bar'

  rerender()
  expect(callback).toHaveBeenCalledTimes(2)
})
