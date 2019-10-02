# CSS Handles

Utility for generating CSS handles for store components.

🚧 Under Construction 🚧

### Usage

```tsx
import React, { FunctionComponent } from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'container',
  'background',
  'text'
] as const
/* Using `as const at the end` hints to Typescript that this array
 * won't change, thus allowing autocomplete and other goodies. */

const Component: FunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.container}>
      <div className={`${handles.background} bg-red`}>
        <span className={`${handles.text} f5 c-white`}>
          Hello world
        </span>
      </div>
    </div>
  )
}

```
