import withCssHandles from '../withCssHandles'
import ExampleComponent from '../testUtils/exampleComponent'

jest.mock('../hooks/useExtension', () => ({
  useExtension: jest.fn(() => ({
    component: 'vtex.app@2.1.0',
    props: {
      blockClass: 'blockClass',
    },
  })),
}))

describe('withCssHandles propTypes', () => {
  it('should apply proper classes to proper handles', () => {
    const CSS_HANDLES = ['element1', 'element2']
    const EnhancedComponent = withCssHandles(CSS_HANDLES)(ExampleComponent)
    expect(EnhancedComponent.propTypes.cssHandles).toBeDefined()
    expect(EnhancedComponent.defaultProps.cssHandles).toBeDefined()
  })
})
