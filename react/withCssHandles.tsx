import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import useCssHandles from './useCssHandles'
import { ComponentType } from 'react'

const withCssHandles = <T extends CssHandlesInput, ComponentProps>(
  handles: T,
  options?: CssHandlesOptions
) => (
  Component: ComponentType<ComponentProps & { cssHandles: CssHandles<T> }>
) => {
  const EnhancedComponent = (props: ComponentProps) => {
    const cssHandles = useCssHandles(handles, options)

    return <Component cssHandles={cssHandles} {...props} />
  }

  const displayName = Component.displayName || Component.name || 'Component'
  EnhancedComponent.displayName = `withCssHandles(${displayName})`
  hoistNonReactStatic(EnhancedComponent, Component)
  EnhancedComponent.propTypes = Component.propTypes
  EnhancedComponent.defaultProps = Component.defaultProps
  return EnhancedComponent
}

export default withCssHandles
