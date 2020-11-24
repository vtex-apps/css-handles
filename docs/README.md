# CSS Handles

Utility for generating CSS handles for store components.

## API

### useCssHandles

The `useCssHandles` hook creates handles that are used to customize parts of an app. These names are unique for each app, so two apps using the same handle identifier will not receive the same class name. It returns an object of type `CssHandlesBag`, which you can check out below.

This hook is extensible via the `classes` option, so other apps that import this component can customize the classes. See the docs for the `useCustomClasses` hook for more information.

There are cases where multiple components of a block have handles. In this cases, `useCssHandles` must be called only on the root component (the entrypoint of the block) and it must receive the handles of all nested components. To learn more about this use case, check out the `useContextCssHandles` hook.

| Parameter | Type                | Description                                                                                                                                                                    | Default value |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `handles` | `[string]`          | ![https://img.shields.io/badge/-Mandatory-red](https://img.shields.io/badge/-Mandatory-red) List of handles to be created. The array is preferably a const (see example below) | `undefined`   |
| `options` | `CssHandlesOptions` | Configurations that change how the hook must behave.                                                                                                                           | `{}`          |

- `CssHandlesOptions` object:

| Keys            | Type               | Description                                                                                                                                                                                                                                                           | Default value                                                                                                                                               |
| --------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `migrationFrom` | `string            | [string]`                                                                                                                                                                                                                                                             | Used to preserve the behavior of a block when migrating code from one app to another. Receives APP IDs and creates additional handles for each one of them. | `undefined` |
| `classes`       | `CustomCSSClasses` | Used to override the default handle definitions. The value must be received via props, thus giving the parent component the ability incorporate the handles of its children in its API. To understand more about this option, read about the `useCustomClasses` hook. | `undefined`                                                                                                                                                 |

- `CssHandlesBag` object:

| Keys            | Type                                   | Description                                                                                                                                                                                                          |
| --------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handles`       | `Record<string, string>`               | An object where the keys are the handles and its values are the classes.                                                                                                                                             |
| `withModifiers` | `function(string, string[]) => string` | Appends modifier suffixes to the CSS handles, for selection of specific items. The first argument receives the name of a handle, and the second argument might be a list or a string of the modifier to be appended. |

- Example of usage:

```tsx
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

/* Using `as const at the end` hints to Typescript that this array
 * won't change, thus allowing autocomplete and other goodies. */
const CSS_HANDLES = ['container', 'background', 'text', 'item'] as const

function MyExampleComponent({ classes }) {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, { classes })

  return (
    <div className={handles.container}>
      <div className={`${handles.background} bg-red`}>
        <h1 className={`${handles.text} f1 c-white`}>Hello world</h1>
        <ul>
          {['blue', 'yellow', 'green'].map((color) => (
            <li
              {/*
               * Appends modifier suffixes to the CSS handles.
               * For example, `item item--color` */}
              className={`${withModifiers('item', color)} bg-${color}`}
              key={color}
            >
              Color {color}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MyExampleComponent
```

### useCustomClasses

The `useCustomClasses` hook acts as a handle API overrider. This hook is used to create new handles that can override the ones present on child components. It exists so a parent component can incorporate its children handle API into its own. The parent may determine if modifiers on the children should be applied, or change the names of the handles.

This hook receives a function and an array of dependencies, just like other React hooks such as `useEffect`. The function must return an object containing `CustomClassValue` values. The result can then be provided to its children via the `classes` prop, as demonstrated on the example below.

| Parameter | Type                           | Description                                                                                                                                      | Default value |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `classes` | `function => CustomClassValue` | ![https://img.shields.io/badge/-Mandatory-red](https://img.shields.io/badge/-Mandatory-red) A function that returns a `CustomClassValue` object. | `undefined`   |
| `deps`    | `any[]`                        | Array of dependencies. If any of the dependences change, the hook function is called again.                                                      | `[]`          |

- `CustomClassValue` object

The keys of the `CustomClassValue` object should match the name of the handles of the child it is going to override. The values must be of type `string | CustomClassItem | [string | CustomClassItem]`. See example below for more details.

- `CustomClassItem` object

| Parameter       | Type      | Description                                                                         | Default value                                                    |
| --------------- | --------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `name`          | `string`  | Sets the name of the child handle. Avoid using the same name for multiple children. | Name of the `CustomClassValue` key corresponding to this object. |
| `withModifiers` | `boolean` | Defines if the child will be able to run withModifiers on that specific handle.     | `true`                                                           |

- Example of usage (related to the previous example):

```tsx
import React from 'react'
import { useCssHandles, useCustomClasses } from 'vtex.css-handles'

// That is the example above
import MyExampleComponent from './MyExampleComponent'

function MyComponent({ classes }) {
  const classes = useCustomClasses(() => {
    container: 'foobar childContainer',
    text: ['anArray', 'example'],
    item: ['db', { name: 'myItem', applyModifiers: true }],
  })

  return (
    <div>
      {/* ChildComponent will now render:
        - The handle "container" will render the class "foobar childContainer"
        - The handle "background" was not customized, it will render the original handle
        - The handle "text" will render the classes "anArray example"
        - The handle "item" will render the class "db myItem" and will apply the modifiers applied to the class "myItem", example: "db myItem myItem--red".
      */}
      <MyExampleComponent classes={classes} />
    </div>
  )
}

export default MyComponent
```

### createCssHandlesContext

The `createCssHandlesContext` hook can be used to create a context provider for handles. It makes easier to manage
handles that are located in components of different levels of the tree.

It expects a list of handle names as input. To work as intended, this hook must be called on a separate file, its output must be exported, and it has to receive all handles present in the root component (entrypoint of the block) and its children. `createCssHandlesContext` outputs a `CssHandlesProvider` component and a `useContextCssHandles` hook.

The `CssHandlesProvider` is used on the root component to provide all the handles and the `withModifier` function to its children via context. You should wrap your root component on the provider as shown on the example below.

Children of the root component that have handles of their own should use the `useContextCssHandles`. It outputs a `CssHandlesBag` just like the `useCssHandles` hook, and expects no input.

| Parameter | Type       | Description                                                                                                                                                                                         | Default value |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `handles` | `[string]` | ![https://img.shields.io/badge/-Mandatory-red](https://img.shields.io/badge/-Mandatory-red) List of handles to be supported by the whole block. The array is preferably a const (see example below) | `undefined`   |

- Example of usage

`cssHandlesContext` file: creates and exports handles context.

```tsx
import { createCssHandlesContext } from 'vtex.css-handles'
import { BLOCK_HANDLES } from './root'

const { CssHandlesProvider, useContextCssHandles } = createCssHandlesContext(
  BLOCK_HANDLES
)

export { CssHandlesProvider, useContextCssHandles }
```

`nested` file: creates the NestedComponent and defines its handles.

```tsx
import React, { FunctionComponent } from 'react'
import { useContextCssHandles } from './cssHandlesContext'

const NestedComponent: FunctionComponent = ({ classes }) => {
  const { handles } = useContextCssHandles()

  return <div className={handles.nested}>Nested Component</div>
}

NestedComponent.handles = ['nested'] as const
/* Defines which handles belong to the NestedComponent. It can then be used on the RootComponent
 * to assemble all the handles in a single place
 */
```

`root` file: gather all handle names used in the block, creates the handles and sets up the CssHandlesProvider with this values.

```tsx
import React, { FunctionComponent } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { CssHandlesProvider } from './cssHandlesContext'
import { NestedComponent } from './nested'

export const BLOCK_HANDLES = ['root', ...NestedComponent.handles] as const
/* This array is used by the context as a default value and by the component
 * to create the handles used by the entire block. The nested handles should be added
 * by using the spread operator on each of the nested component's handles.
 */

const RootComponent: FunctionComponent = ({ classes }) => {
  const { handles, withModifiers } = useCssHandles(BLOCK_HANDLES, { classes })

  return (
    <CssHandlesProvider handles={handles} withModifiers={withModifiers}>
      {/* Sets the handles and modifiers of the entire block on the provider. */}
      <div className={handles.root}>
        <NestedComponent />
      </div>
    </CssHandlesProvider>
  )
}
```
