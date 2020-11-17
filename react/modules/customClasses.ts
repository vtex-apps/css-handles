import { CustomClassValue } from '../typings/index'

export function getCustomClassValue(customClass: CustomClassValue) {
  customClass = Array.isArray(customClass) ? customClass : [customClass]

  return customClass
    .filter(Boolean)
    .map((className) => {
      if (typeof className === 'string') {
        return className
      }

      return className.name
    })
    .join(' ')
}
