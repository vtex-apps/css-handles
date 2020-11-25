import { useMemo } from 'react'

import { CustomClasses, CssHandlesList } from './CssHandlesTypes'

export const SYMBOL_CUSTOM_CLASSES: unique symbol = Symbol('customClasses')

const useCustomClasses = <T extends CssHandlesList>(
  classes: () => Omit<CustomClasses<T>, '__useCustomClasses'>,
  deps: unknown[] = []
): CustomClasses<T> => {
  // we know what we're doing *wink wink*
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memo = useMemo(classes, deps) as CustomClasses<T>

  // __useCustomClasses is added to guarantee that consumers will use this hooks
  // instead of just passing a new object at every render
  memo.__useCustomClasses = SYMBOL_CUSTOM_CLASSES

  return memo
}

export default useCustomClasses
