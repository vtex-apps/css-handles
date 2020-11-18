import createCssHandlesContext from '../createCssHandlesContext'
import { ROOT_HANDLES } from './Root'

const { CssHandlesProvider, useContextCssHandles } = createCssHandlesContext(
  ROOT_HANDLES
)

export { CssHandlesProvider, useContextCssHandles }
