import useCssHandles from '../useCssHandles'
import { useExtension } from '../hooks/useExtension'
import { SYMBOL_CUSTOM_CLASSES } from '../useCustomClasses'

jest.mock('react', () => ({
  useMemo: (callback: () => any) => callback(),
}))

jest.mock('../hooks/useExtension', () => ({
  useExtension: jest.fn(() => ({
    component: 'vtex.app@2.1.0',
    props: {
      blockClass: 'blockClass',
    },
  })),
}))

jest.useFakeTimers()

const consoleError = jest.spyOn(console, 'error').mockImplementation()

beforeEach(() => {
  consoleError.mockClear()
})

test('should apply proper classes to proper handles', () => {
  const CSS_HANDLES = ['element1', 'element2']

  const { handles } = useCssHandles(CSS_HANDLES)

  expect(handles).toStrictEqual({
    element1: 'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass',
    element2: 'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass',
  })
})

test('should not apply blockClasses if not available', () => {
  const CSS_HANDLES = ['element1', 'element2']

  ;(useExtension as any).mockImplementationOnce(() => ({
    component: 'vtex.app@2.1.0',
    props: {},
  }))

  const { handles } = useCssHandles(CSS_HANDLES)

  expect(handles).toStrictEqual({
    element1: 'vtex-app-2-x-element1',
    element2: 'vtex-app-2-x-element2',
  })
})

test('make invalid class names be transformed to empty strings', () => {
  const CSS_HANDLES = ['element1', 'element-2', 'element+3', '4element']

  ;(useExtension as any).mockImplementationOnce(() => ({
    component: 'vtex.app@2.1.0',
    props: {},
  }))

  const { handles } = useCssHandles(CSS_HANDLES)

  expect(handles).toStrictEqual({
    element1: 'vtex-app-2-x-element1',
    'element-2': 'vtex-app-2-x-element-2',
    'element+3': '',
    '4element': '',
  })
})

describe('migration', () => {
  it('should add both the current app and the migration app', () => {
    const CSS_HANDLES = ['element1', 'element2']

    const { handles } = useCssHandles(CSS_HANDLES, {
      migrationFrom: 'vtex.previous-app@3.0.0',
    })

    expect(handles).toStrictEqual({
      element1:
        'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass',
      element2:
        'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass',
    })
  })

  it('should add more than one migration if needed', () => {
    const CSS_HANDLES = ['element1', 'element2']

    const { handles } = useCssHandles(CSS_HANDLES, {
      migrationFrom: ['vtex.previous-app@2.0.0', 'vtex.previous-app@3.0.0'],
    })

    expect(handles).toStrictEqual({
      element1:
        'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-2-x-element1 vtex-previous-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass',
      element2:
        'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-2-x-element2 vtex-previous-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass',
    })
  })

  it('doesnt repeat the migration if the current app happens to be the same as the migration one', () => {
    const CSS_HANDLES = ['element1', 'element2']

    const { handles } = useCssHandles(CSS_HANDLES, {
      migrationFrom: [
        'vtex.previous-app@2.0.0',
        'vtex.previous-app@3.0.0',
        'vtex.app@2.1.0',
      ],
    })

    expect(handles).toStrictEqual({
      element1:
        'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-2-x-element1 vtex-previous-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass',
      element2:
        'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-2-x-element2 vtex-previous-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass',
    })
  })
})

describe('custom classes', () => {
  it('should override handles with passed custom classes', () => {
    const CSS_HANDLES = [
      'element1',
      'element2',
      'element3',
      'element4',
      'element5',
      'element6',
      'element7',
      'element8',
    ] as const

    const { handles } = useCssHandles(CSS_HANDLES, {
      classes: {
        element2: 'a',
        element3: ['b'],
        element4: { name: 'a' },
        element5: [{ name: 'a' }],
        element6: ['a', { name: 'b' }],
        element7: ['a', 'b'],
        element8: [{ name: 'a' }, { name: 'b' }],
        // @ts-expect-error not public
        __classes: SYMBOL_CUSTOM_CLASSES,
      },
    })

    expect(handles).toMatchObject({
      element1: 'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass',
      element2: 'a',
      element3: 'b',
      element4: 'a',
      element5: 'a',
      element6: 'a b',
      element7: 'a b',
      element8: 'a b',
    })
  })
})

describe('withModifiers', () => {
  it('should work with no custom classes', () => {
    const CSS_HANDLES = ['handle1'] as const

    const { withModifiers } = useCssHandles(CSS_HANDLES)

    const result = withModifiers('handle1', 'mod')

    expect(result).toBe(
      'vtex-app-2-x-handle1 vtex-app-2-x-handle1--blockClass vtex-app-2-x-handle1--mod vtex-app-2-x-handle1--blockClass--mod'
    )
  })

  it('should not add an invalid modifier parameter', () => {
    const CSS_HANDLES = ['handle1'] as const

    const { withModifiers } = useCssHandles(CSS_HANDLES)

    const invalidModifierParam = 1
    // @ts-expect-error passing wrong param for test
    const result = withModifiers('handle1', invalidModifierParam)

    expect(consoleError).toHaveBeenCalledWith(
      'Invalid modifier type on `withModifier`. Please use either a string or an array of strings'
    )
    expect(result).toBe('vtex-app-2-x-handle1 vtex-app-2-x-handle1--blockClass')
  })

  it('should not add an invalid modifier value', async () => {
    const CSS_HANDLES = ['handle1'] as const

    const { withModifiers } = useCssHandles(CSS_HANDLES)

    const invalidModifierValue = 'i.n.v.a.l.i.d'
    const result = withModifiers('handle1', invalidModifierValue)

    jest.runAllTimers()

    expect(consoleError).toHaveBeenLastCalledWith(
      'Invalid CSS modifiers. All modifiers should be strings, and only contain letters, numbers, or -. Found: i.n.v.a.l.i.d'
    )
    expect(result).toBe('vtex-app-2-x-handle1 vtex-app-2-x-handle1--blockClass')
  })

  it('should return custom classes without modifiers if there is not applyModifiers', () => {
    const CSS_HANDLES = ['handle1', 'handle2', 'handle3'] as const
    const classes = {
      handle1: 'customClass',
      handle2: ['customClass', { name: 'anotherClass' }],
      handle3: { name: 'customClass' },
    }

    const { withModifiers } = useCssHandles(CSS_HANDLES, { classes })

    const handle1 = withModifiers('handle1', 'mod')
    const handle2 = withModifiers('handle2', 'mod')
    const handle3 = withModifiers('handle3', 'mod')

    expect(handle1).toBe('customClass')
    expect(handle2).toBe('customClass anotherClass')
    expect(handle3).toBe('customClass')
  })

  it('should apply modifiers only on custom classes with applyModifiers', () => {
    const CSS_HANDLES = ['handle1', 'handle2', 'handle3'] as const
    const classes = {
      handle1: 'customClass',
      handle2: ['customClass', { name: 'anotherClass', applyModifiers: true }],
      handle3: { name: 'customClass', applyModifiers: true },
    }

    const { withModifiers } = useCssHandles(CSS_HANDLES, { classes })

    const handle1 = withModifiers('handle1', 'mod')
    const handle2 = withModifiers('handle2', 'mod')
    const handle3 = withModifiers('handle3', 'mod')

    expect(handle1).toBe('customClass')
    expect(handle2).toBe('customClass anotherClass anotherClass--mod')
    expect(handle3).toBe('customClass customClass--mod')
  })
})
