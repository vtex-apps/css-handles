import useCssHandles from '../useCssHandles'
import { useExtension } from '../hooks/useExtension'

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

console.error = jest.fn()

describe('useCssHandles', () => {
  it('should apply proper classes to proper handles', () => {
    const CSS_HANDLES = ['element1', 'element2']

    const handles = useCssHandles(CSS_HANDLES)

    expect(handles).toStrictEqual({
      element1: 'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass',
      element2: 'vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass',
    })
  })
  it('should not apply blockClasses if not available', () => {
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
})
