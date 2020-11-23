const INVALID_MODIFIER_PATTERN = /[^A-z0-9-]/

const MODIFIER_ERROR_LOG_DELAY = 3000

/** Simplified debounce */
function debounce(fn: () => any, delay: number) {
  let timeout: NodeJS.Timeout | undefined

  return () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }

    timeout = setTimeout(fn, delay)
  }
}

type InvalidModifier = any

const invalidModifiers = new Set<InvalidModifier>([])

const displayModifierErrors = debounce(() => {
  console.error(
    `Invalid CSS modifiers. All modifiers should be strings, and only contain letters, numbers, or -. Found: ${Array.from(
      invalidModifiers.values()
    ).join(', ')}`
  )
  invalidModifiers.clear()
}, MODIFIER_ERROR_LOG_DELAY)

/** Accumulates modifier errors to log them on a single error,
 * rather than a potentially huge wall of errors.
 */
function logModifierError(modifier: InvalidModifier) {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'production') {
    return
  }

  invalidModifiers.add(modifier)
  displayModifierErrors()
}

export const validateModifier = (modifier: string) => {
  if (typeof modifier !== 'string') {
    logModifierError(modifier)

    return false
  }

  /* This is not an error, so doesn't log any message, but should
   * invalidate the current modifier and not include it */
  if (modifier === '') {
    return false
  }

  if (INVALID_MODIFIER_PATTERN.test(modifier)) {
    logModifierError(modifier)

    return false
  }

  return true
}
