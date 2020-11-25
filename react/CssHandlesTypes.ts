import { SYMBOL_CUSTOM_CLASSES } from './useCustomClasses'

export type ValuesOf<T extends readonly unknown[]> = T[number]

type CustomClassItem = string | { name: string; applyModifiers?: boolean }

export type CssHandlesList = readonly string[]

export type CssHandles<T extends CssHandlesList> = Record<ValuesOf<T>, string>

export type WithModifiers<T extends CssHandlesList> = (
  handleName: ValuesOf<T>,
  modifier: string | string[]
) => string

/**
 * Collection of css handle utilities returned by `useCssHandles`
 */
export type CssHandlesBag<T extends CssHandlesList> = {
  handles: CssHandles<T>
  withModifiers: WithModifiers<T>
}

/**
 * Props added to a wrapped component via `withCssHandles`
 */
export type CssHandleProps<T extends CssHandlesList> = {
  cssHandles: CssHandles<T>
  withModifiers: WithModifiers<T>
}
export type WithCssHandleProps<T extends CssHandlesList, Props> = Props &
  CssHandleProps<T>

export type CustomClassValue = CustomClassItem | CustomClassItem[]

export type CustomClasses<T extends CssHandlesList> = {
  [key in ValuesOf<T>]?: CustomClassValue
} & {
  /**
   * Internal custom classes key
   * @private
   */
  __useCustomClasses: typeof SYMBOL_CUSTOM_CLASSES
}

export interface CssHandlesOptions<T extends CssHandlesList> {
  migrationFrom?: string | string[]
  classes?: CustomClasses<T>
}
