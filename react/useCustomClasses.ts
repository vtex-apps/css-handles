import { useMemo } from 'react'

export const SYMBOL_CUSTOM_CLASSES: unique symbol = Symbol('customClasses')

const useCustomClasses = <T>(classes: () => T, deps: unknown[] = []): T => {
  // we know what we're doing *wink wink*
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memo = useMemo(classes, deps)

  // __classes is added to guarantee that consumers will use this hooks
  // instead of just passing a new object at every render
  // @ts-expect-error - non public API
  memo.__classes = SYMBOL_CUSTOM_CLASSES

  return memo
}

export default useCustomClasses
