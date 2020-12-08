import { CustomClassValue } from '../CssHandlesTypes'

export type ComputedCustomClass = {
  toApplyModifiers: string[]
  classNames: string[]
}

export function computeCustomClassValue(customClass: CustomClassValue) {
  customClass = Array.isArray(customClass) ? customClass : [customClass]

  return customClass.filter(Boolean).reduce<ComputedCustomClass>(
    (acc, className) => {
      if (typeof className === 'string') {
        acc.classNames.push(className)

        return acc
      }

      const names = className.name.split(' ')

      acc.classNames.push(...names)

      if (className.applyModifiers) {
        acc.toApplyModifiers.push(...names)
      }

      return acc
    },
    { toApplyModifiers: [], classNames: [] }
  )
}
