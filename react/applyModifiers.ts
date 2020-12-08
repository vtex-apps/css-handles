import { validateModifier } from './modules/modifier'

const applyModifiers = (handles: string, modifier: string | string[]) => {
  const normalizedModifiers =
    typeof modifier === 'string' ? [modifier] : modifier

  if (!Array.isArray(normalizedModifiers)) {
    console.error(
      'Invalid modifier type on `cssHandles.applyModifier`. Please use either a string or an array of strings'
    )

    return handles
  }

  const splitHandles = handles.split(' ')

  const modifiedHandles = normalizedModifiers
    .map((currentModifier) => {
      const isValid = validateModifier(currentModifier)

      if (!isValid) {
        return ''
      }

      return splitHandles
        .map((handle) => `${handle}--${currentModifier}`)
        .join(' ')
        .trim()
    })
    .filter((l) => l.length > 0)
    .join(' ')
    .trim()

  return splitHandles.concat(modifiedHandles).join(' ').trim()
}

export default applyModifiers
