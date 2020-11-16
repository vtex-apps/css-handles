import { SYMBOL_CUSTOM_CLASSES } from '../useCustomClasses'

type CustomClass =
  | string
  | {
      name: string
      applyModifiers: boolean
    }

export type CssHandlesInput = readonly string[]

export type ValueOf<T extends readonly any[]> = T[number]

export type CssHandles<T extends CssHandlesInput> = Record<ValueOf<T>, string>

export interface CssHandlesOptions {
  migrationFrom?: string | string[]
  classes?: {
    [key: string]: CustomClass | CustomClass[] | typeof SYMBOL_CUSTOM_CLASSES
    __classes: typeof SYMBOL_CUSTOM_CLASSES
  }
}
