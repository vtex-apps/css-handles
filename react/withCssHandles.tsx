import React, { ComponentType } from 'react'

import useCssHandles from './useCssHandles'
import {
  CssHandlesList,
  CssHandlesOptions,
  CssHandleProps,
} from './CssHandlesTypes'

// eslint-disable-next-line @typescript-eslint/ban-types
const withCssHandles = <T extends CssHandlesList, Props = {}>(
  handles: T,
  options?: CssHandlesOptions<T>
) => (Component: ComponentType<Props & CssHandleProps<T>>) => {
  const EnhancedComponent = (props: Props) => {
    const { handles: cssHandles, withModifiers } = useCssHandles(
      handles,
      options
    )

    return (
      <Component
        cssHandles={cssHandles}
        withModifiers={withModifiers}
        {...props}
      />
    )
  }

  const displayName = Component.displayName ?? Component.name ?? 'Component'

  EnhancedComponent.displayName = `withCssHandles(${displayName})`

  return EnhancedComponent
}

export default withCssHandles
