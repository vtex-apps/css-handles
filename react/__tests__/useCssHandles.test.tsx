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

jest.spyOn(console, 'error').mockImplementation()

test('should apply proper classes to proper handles', () => {
  const CSS_HANDLES = ['element1', 'element2']

  const handles = useCssHandles(CSS_HANDLES)

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

  const handles = useCssHandles(CSS_HANDLES)

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

  const handles = useCssHandles(CSS_HANDLES)

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

    const handles = useCssHandles(CSS_HANDLES, {
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

    const handles = useCssHandles(CSS_HANDLES, {
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

    const handles = useCssHandles(CSS_HANDLES, {
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

    const handles = useCssHandles(CSS_HANDLES, {
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
