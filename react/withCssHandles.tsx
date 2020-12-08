import React, { ComponentType } from 'react'

import useCssHandles from './useCssHandles'
import type {
  CssHandlesList,
  CssHandlesOptions,
  CssHandlesBag,
} from './CssHandlesTypes'

// eslint-disable-next-line @typescript-eslint/ban-types
const withCssHandles = <T extends CssHandlesList, Props = {}>(
  handles: T,
  options?: CssHandlesOptions<T>
) => (Component: ComponentType<Props & CssHandlesBag<T>>) => {
  const EnhancedComponent = (props: Props) => {
    const handlesBag = useCssHandles(handles, options)

    return <Component {...props} {...handlesBag} />
  }

  const displayName = Component.displayName ?? Component.name ?? 'Component'

  EnhancedComponent.displayName = `withCssHandles(${displayName})`

  return EnhancedComponent
}

export default withCssHandles
