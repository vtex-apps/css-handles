import React from 'react'

import { useContextCssHandles } from './handles'

const Nested = () => {
  const { handles } = useContextCssHandles()

  return <div className={handles.nested}>Nested content</div>
}

Nested.handles = ['nested'] as const

export default Nested
