import { useMemo } from 'react'

import { useExtension } from './hooks/useExtension'
import {
  computeCustomClassValue,
  ComputedCustomClass,
} from './modules/customClasses'
import { validateModifier } from './modules/modifier'
import applyModifiers from './applyModifiers'
import { SYMBOL_CUSTOM_CLASSES } from './useCustomClasses'
import type {
  CssHandlesList,
  CssHandles,
  CssHandlesOptions,
  ValuesOf,
  CssHandlesBag,
  CustomClassValue,
} from './CssHandlesTypes'

const VALID_CSS_HANDLE_PATTERN = /^[^\d][\w-]+$/
const APP_NAME_PATTERN = /([^.]+)\.([^@]+)@(\d+)/

/** Verifies if the handle contains only letters, numbers and -, and does not begin with a number  */
const validateCssHandle = (handle: string) =>
  VALID_CSS_HANDLE_PATTERN.test(handle)

const parseComponentName = (componentName: string) => {
  const [, vendor, name, major] = componentName.match(APP_NAME_PATTERN) ?? []

  return { vendor, name, major }
}

const normalizeComponentName = (componentName: string) => {
  const { vendor, name, major } = parseComponentName(componentName)

  if (vendor && name && major) {
    return `${vendor}-${name}-${major}-x`
  }

  return null
}

const generateCssHandles = <T extends CssHandlesList>(
  namespace: string,
  handles: T,
  modifiers?: string | string[]
) => {
  return handles.reduce((acc, handle: ValuesOf<T>) => {
    const isValid = !!namespace && validateCssHandle(handle)
    const transformedHandle = `${namespace}-${handle}`

    acc[handle] = isValid
      ? modifiers
        ? applyModifiers(transformedHandle, modifiers)
        : transformedHandle
      : ''

    if (!isValid) {
      console.error(
        `Invalid CSS handle "${handle}". It should only contain letters or numbers, and should start with a letter.`
      )
    }

    return acc
  }, {} as CssHandles<T>)
}

/**
 * Useful for creating CSS handles without creating a CSS file with empty
 * declarations.
 * Receives an array of strings (e.g. ['foo', 'bar']) and returns an
 * object with generated css class names, e.g.
 * { foo: 'vendor-appname-1-x-foo', bar: 'vendor-appname-1-x-bar' }.
 */
const useCssHandles = <T extends CssHandlesList>(
  handleList: T,
  options: CssHandlesOptions<T> = {}
): CssHandlesBag<T> => {
  const extension = useExtension()

  const { props = {}, component = '' } = extension ?? {}
  const blockClass = props.cssHandle || props.blockClass
  const { migrationFrom, classes: handlesOverride } = options

  const values = useMemo<CssHandlesBag<T>>(() => {
    const normalizedComponent = normalizeComponentName(component)

    const namespaces = normalizedComponent ? [normalizedComponent] : []
    const handlesSet = new Set<ValuesOf<T>>(handleList)
    const handles = {} as CssHandles<T>
    const computedCustomClasses = new Map<ValuesOf<T>, ComputedCustomClass>()

    if (migrationFrom) {
      const migrations = Array.isArray(migrationFrom)
        ? migrationFrom
        : [migrationFrom]

      const normalizedMigrations = migrations
        .map(normalizeComponentName)
        .filter(
          (current) => !!current && current !== normalizedComponent
        ) as string[]

      namespaces.push(...normalizedMigrations)
    }

    if (handlesOverride) {
      if (
        process.env.NODE_ENV === 'development' &&
        handlesOverride.__useCustomClasses !== SYMBOL_CUSTOM_CLASSES
      ) {
        throw new Error(
          "[css-handles] Invalid 'classes' option. Use the 'useCustomClasses' hook to generate a valid 'classes' object."
        )
      }

      Object.keys(handlesOverride).forEach((handleName: ValuesOf<T>) => {
        // side-effect to remove handles that we don't need to generate full names
        handlesSet.delete(handleName)

        const computedCustomClass = computeCustomClassValue(
          handlesOverride[handleName] as Required<CustomClassValue>
        )

        handles[handleName] = computedCustomClass.classNames.join(' ')
        computedCustomClasses.set(handleName, computedCustomClass)
      })
    }

    // `handlesToGenerate` are handles that were not overriden by classes
    const handlesToGenerate = [...handlesSet]

    namespaces.forEach((componentName) => {
      const namespaceHandles = generateCssHandles(
        componentName,
        handlesToGenerate,
        blockClass
      )

      Object.keys(namespaceHandles).forEach((key: ValuesOf<T>) => {
        if (key in handles) {
          handles[key] = `${handles[key]} ${namespaceHandles[key]}`
        } else {
          handles[key] = namespaceHandles[key]
        }
      })
    })

    const withModifiers = (id: ValuesOf<T>, modifier: string | string[]) => {
      const normalizedModifiers =
        typeof modifier === 'string' ? [modifier] : modifier

      if (!Array.isArray(normalizedModifiers)) {
        console.error(
          'Invalid modifier type on `withModifier`. Please use either a string or an array of strings'
        )

        return handles[id]
      }

      let baseClassNames: string[] = []
      let classesToApplyModifiers: string[] = []

      const computedCustomClass = computedCustomClasses.get(id)

      if (computedCustomClass) {
        baseClassNames = computedCustomClass.classNames
        classesToApplyModifiers = computedCustomClass.toApplyModifiers
      } else {
        baseClassNames = handles[id].split(' ')
        classesToApplyModifiers = baseClassNames
      }

      const modifiedClasses = normalizedModifiers
        .map((currentModifier) => {
          const isValid = validateModifier(currentModifier)

          if (!isValid) {
            return ''
          }

          return classesToApplyModifiers
            .map((className) => `${className}--${currentModifier}`)
            .join(' ')
            .trim()
        })
        .filter((l) => l.length > 0)
        .join(' ')
        .trim()

      return baseClassNames.concat(modifiedClasses).join(' ').trim()
    }

    return {
      handles,
      withModifiers,
    }
  }, [blockClass, component, handleList, migrationFrom, handlesOverride])

  return values
}

export default useCssHandles
