export type ValueOf<T extends readonly unknown[]> = T[number]

type CustomClassItem =
  | string
  | {
      name: string
      applyModifiers?: boolean
    }

export type CssHandlesList = readonly string[]

export type CssHandles<T extends CssHandlesList> = Record<ValueOf<T>, string>

export type CustomClassValue = CustomClassItem | CustomClassItem[]

export type CustomClasses<T extends CssHandlesList> = Record<
  ValueOf<T>,
  CustomClassValue
>

export interface CssHandlesOptions<T extends CssHandlesList> {
  migrationFrom?: string | string[]
  classes?: CustomClasses<T>
}
