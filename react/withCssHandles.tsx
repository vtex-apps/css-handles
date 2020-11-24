import React, { ComponentType } from 'react'

import useCssHandles from './useCssHandles'
import {
  CssHandlesList,
  CssHandlesOptions,
  CssHandles,
} from './CssHandlesTypes'

const withCssHandles = <T extends CssHandlesList, ComponentProps>(
  handles: T,
  options?: CssHandlesOptions<T>
) => (
  Component: ComponentType<ComponentProps & { cssHandles: CssHandles<T> }>
) => {
  const EnhancedComponent = (props: ComponentProps) => {
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
