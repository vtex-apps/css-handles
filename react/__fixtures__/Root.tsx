import React from 'react'

import useCssHandles from '../useCssHandles'
import { CustomClasses } from '../typings/index'
import { CssHandlesProvider } from './handles'
import Nested from './Nested'

export const ROOT_HANDLES = ['root', ...Nested.handles] as const

interface Props {
  classes?: CustomClasses<typeof ROOT_HANDLES>
}

const Root = ({ classes }: Props) => {
  const { handles, withModifiers } = useCssHandles(ROOT_HANDLES, { classes })

  return (
    <CssHandlesProvider withModifiers={withModifiers} handles={handles}>
      <div className={handles.root}>
        Root Component
        <Nested />
      </div>
    </CssHandlesProvider>
  )
}

export default Root
