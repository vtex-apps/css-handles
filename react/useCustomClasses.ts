import { useMemo } from 'react'

export const SYMBOL_CUSTOM_CLASSES: unique symbol = Symbol('customClasses')

export const useCustomClasses = (
  overrides: () => Record<string, unknown>,
  deps = []
) => {
  // we know what we're doing *wink wink*
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memo = useMemo(overrides, deps)

  // __classes is added to guarantee that consumers will use this hooks
  // instead of just passing a new object at every render
  memo.__classes = SYMBOL_CUSTOM_CLASSES

  return memo
}
