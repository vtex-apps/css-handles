import { useMemo } from 'react'
import { generateBlockClass } from '@vtex/css-handles'
import { useExtension } from './hooks/useExtension'

/** Verifies if the handle contains only letters and numbers, and begins with a number  */
const validateCssHandle = (handle: string) => !/^\d|[^A-z0-9]/.test(handle)

/**
 * Useful for creating CSS handles without creating a CSS file with empty
 * declarations.
 * Receives an array of strings (e.g. ['foo', 'bar']) or an enum
 * (e.g. enum Handles {foo, bar}) and returns and object with
 * generated css class names. For example:
 * { foo: 'vendor-appname-1-x-foo', bar: 'vendor-appname-1-x-bar' }.
 */
const useCssHandles = <T extends CssHandlesInput>(
  handles: T
): CssHandles<T> => {
  const extension = useExtension()

  const { props, component = '' } = extension || {}

  const values = useMemo<CssHandles<T>>(() => {
    const vendor = component.slice(0, component.indexOf('.'))
    const name = component.slice(
      component.indexOf('.') + 1,
      component.indexOf('@')
    )
    const version = component.slice(
      component.indexOf('@') + 1,
      component.indexOf('/')
    )
    const major = version.slice(0, version.indexOf('.'))

    const customHandle = props && (props.cssHandle || props.blockClass)
    const namespace = `${vendor}-${name}-${major}-x`

    // Intended for when the input is an Enum. Converts it to an array of its keys
    const normalizedHandles: string[] = Array.isArray(handles)
      ? handles
      : Object.keys(handles)

    return normalizedHandles.reduce<Record<string, string>>((acc, handle) => {
      const fullHandle = `${namespace}-${handle}`
      if (validateCssHandle) {
        acc[handle] = namespace
          ? generateBlockClass(fullHandle, customHandle)
          : ''
      } else {
        console.error(
          `Invalid CSS handle "${handle}". It should only contain letters or numbers, and should start with a letter.`
        )
      }

      return acc
    }, {}) as CssHandles<T>
  }, [component, props, handles])

  return values
}

type ValueOf<T extends readonly any[]> = T[number]

type CssHandlesInput = readonly string[] | Record<string, any>
type CssHandles<T extends CssHandlesInput> = T extends readonly string[]
  ? Record<ValueOf<T>, string>
  : Record<keyof T, string>

export default useCssHandles
