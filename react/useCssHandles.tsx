import { useMemo } from 'react'
import { generateBlockClass } from '@vtex/css-handles'
import { useExtension } from './hooks/useExtension'

/** Verifies if the handle contains only letters and numbers, and does not begin with a number  */
const validateCssHandle = (handle: string) => !/^\d|[^A-z0-9]/.test(handle)

/**
 * Useful for creating CSS handles without creating a CSS file with empty
 * declarations.
 * Receives an array of strings (e.g. ['foo', 'bar']) and returns an
 * object with generated css class names, e.g.
 * { foo: 'vendor-appname-1-x-foo', bar: 'vendor-appname-1-x-bar' }.
 */
const useCssHandles = <T extends CssHandlesInput>(
  handles: T
): CssHandles<T> => {
  const extension = useExtension()

  const { props = {}, component = '' } = extension || {}

  const values = useMemo<CssHandles<T>>(() => {
    /* Matches until the first `.` or `@`.
     * Used to split something like `vtex.style-guide@2.0.1` into
     * `vtex`, `style-guide`, and `2`. */
    const splitAppName = /[^@.]+/g

    /* regex.exec is stateful, this is why running the command 3 times
     * provides 3 different results. Yeah I know.
     * There exists a `String.matchAll()` function but it's not
     * supported on Safari */
    const [vendor] = splitAppName.exec(component) || [null]
    const [name] = splitAppName.exec(component) || [null]
    const [major] = splitAppName.exec(component) || [null]

    const namespace = vendor && name && major && `${vendor}-${name}-${major}-x`

    const blockClass = props.cssHandle || props.blockClass

    return handles.reduce<Record<string, string>>((acc, handle) => {
      const isValid = !!namespace && validateCssHandle(handle)
      acc[handle] = isValid
        ? generateBlockClass(`${namespace}-${handle}`, blockClass)
        : ''

      if (!isValid) {
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

type CssHandlesInput = readonly string[]
type CssHandles<T extends CssHandlesInput> = Record<ValueOf<T>, string>

export default useCssHandles
