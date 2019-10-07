import React from 'react'
import useCssHandles from './useCssHandles'
import { ComponentType } from 'react'

interface CssHandlesOptions {
  migrationFrom?: string | string[]
}
type CssHandlesInput = readonly string[]

const withCssHandles = <T extends CssHandlesInput, ComponentProps>(
  handles: T,
  options?: CssHandlesOptions
) => (Component: ComponentType<ComponentProps>) => {
  const EnhancedComponent = (props: ComponentProps) => {
    const cssHandles = useCssHandles(handles, options)

    return <Component cssHandles={cssHandles} {...props} />
  }

  return EnhancedComponent
}

export default withCssHandles
