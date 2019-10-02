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
    .map(currentModifier => {
      if (typeof currentModifier !== 'string') {
        console.error(
          `Invalid modifier type on \`cssHandles.applyModifier\`. All modifiers should be strings, found "${currentModifier}" `
        )
        return ''
      }
      return splitHandles
        .map(handle => `${handle}--${currentModifier}`)
        .join(' ')
    })
    .join(' ')

  return splitHandles
    .concat(modifiedHandles)
    .join(' ')
    .trim()
}

export default applyModifiers
