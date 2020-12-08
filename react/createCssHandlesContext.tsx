import React, {
  createContext,
  useContext,
  useMemo,
  PropsWithChildren,
} from 'react'

import type { CssHandlesList, CssHandlesBag } from './CssHandlesTypes'

interface ProviderProps<T extends CssHandlesList> {
  withModifiers: CssHandlesBag<T>['withModifiers']
  handles: CssHandlesBag<T>['handles']
}

export default function createCssHandlesContext<T extends CssHandlesList>(
  _handles: T
) {
  const Context = createContext<CssHandlesBag<T> | null>(null)

  const useContextCssHandles = () => {
    return useContext(Context) as CssHandlesBag<T>
  }

  const CssHandlesProvider = ({
    withModifiers,
    handles,
    children,
  }: PropsWithChildren<ProviderProps<T>>) => {
    const value = useMemo(
      () => ({
        handles,
        withModifiers,
      }),
      [withModifiers, handles]
    )

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return {
    CssHandlesProvider,
    useContextCssHandles,
  }
}
