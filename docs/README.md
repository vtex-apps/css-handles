# CSS Handles

Utility for generating CSS handles for store components.

🚧 Under Construction 🚧

## Usage

```tsx
import React, { FunctionComponent } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

const CSS_HANDLES = ['container', 'background', 'title', 'item'] as const
/* Using `as const at the end` hints to Typescript that this array
 * won't change, thus allowing autocomplete and other goodies. */

const Component: FunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.container}>
      <div className={`${handles.background} bg-red`}>
        <h1 className={`${handles.text} f1 c-white`}>Hello world</h1>
        <ul>
          {['blue', 'yellow', 'green'].map(color => (
            <li className={`${applyModifiers(handle.item, color)} bg-${color}`}>
              {/*             ˜˜˜˜˜˜˜˜˜˜˜˜˜˜ Appends modifier suffixes to the CSS handles, for selection of specific items.
               *                         For example, `handle handle--blockClass handle--color handle--blockClass--color` */}
              Color {color}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### Options

- `migrationFrom`: Adds additional CSS handles for cases where a component is migrating from another app.
  
#### Usage:
```tsx
const CSS_HANDLES = ['container']
const handles = useCssHandles(CSS_HANDLES, { migrationFrom: 'vtex.store-components@2.x' })
// Returns { container: 'vtex-current-app-0-x-container vtex-store-components-2-x-container' }
```
