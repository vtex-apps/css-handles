export type ValueOf<T extends readonly unknown[]> = T[number]

export type CustomClassItemWithOptions = {
  name: string
  applyModifiers?: boolean
}

export type CustomClassItem = string | CustomClassItemWithOptions

export type CssHandlesList = readonly string[]

export type CssHandles<T extends CssHandlesList> = Record<ValueOf<T>, string>

export type CssHandlesBag<T extends CssHandlesList> = {
  handles: CssHandles<T>
  withModifiers: (handleName: ValueOf<T>, modifier: string | string[]) => string
}

export type CustomClassValue = CustomClassItem | CustomClassItem[]

export type CustomClasses<T extends CssHandlesList> = Partial<
  Record<ValueOf<T>, CustomClassValue>
>

export interface CssHandlesOptions<T extends CssHandlesList> {
  migrationFrom?: string | string[]
  classes?: CustomClasses<T>
}
