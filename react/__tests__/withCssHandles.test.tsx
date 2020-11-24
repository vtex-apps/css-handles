import React, { FC } from 'react'
import { render } from '@vtex/test-tools/react'

import withCssHandles from '../withCssHandles'
import { useExtension } from '../hooks/useExtension'
import type {
  CssHandlesList,
  CssHandles,
  CssHandlesOptions,
} from '../CssHandlesTypes'

interface Props<T extends CssHandlesList> {
  cssHandles: CssHandles<T>
}

const ExampleComponent: FC<Props<any>> = ({ cssHandles }) => {
  return (
    <div
      data-testid="test-div"
      className={Object.values(cssHandles).join(' ')}
    />
  )
}

jest.mock('../hooks/useExtension', () => ({
  useExtension: jest.fn(() => ({
    component: 'vtex.app@2.1.0',
    props: {
      blockClass: 'blockClass',
    },
  })),
}))

describe('withCssHandles', () => {
  const renderComponent = (
    handlesNames: CssHandlesList,
    options?: CssHandlesOptions<any>
  ) => {
    const EnhancedComponent = withCssHandles<
      typeof handlesNames,
      Props<typeof handlesNames>
    >(
      handlesNames,
      options
    )(ExampleComponent)

    return render(<EnhancedComponent />)
  }

  it('should apply proper classes to proper handles', () => {
    const CSS_HANDLES = ['element1', 'element2'] as const
    const { getByTestId } = renderComponent(CSS_HANDLES)

    expect(getByTestId('test-div').className).toBe(
      'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass'
    )
  })

  it('should not apply blockClasses if not available', () => {
    const CSS_HANDLES = ['element1', 'element2'] as const

    ;(useExtension as any).mockImplementationOnce(() => ({
      component: 'vtex.app@2.1.0',
      props: {},
    }))

    const { getByTestId } = renderComponent(CSS_HANDLES)

    expect(getByTestId('test-div').className).toBe(
      'vtex-app-2-x-element1 vtex-app-2-x-element2'
    )
  })

  describe('migration', () => {
    it('should add both the current app and the migration app', () => {
      const CSS_HANDLES = ['element1', 'element2']
      const options = {
        migrationFrom: 'vtex.previous-app@3.0.0',
      }

      const { getByTestId } = renderComponent(CSS_HANDLES, options)

      expect(getByTestId('test-div').className).toBe(
        'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass'
      )
    })

    it('should add more than one migration if needed', () => {
      const CSS_HANDLES = ['element1', 'element2']
      const options = {
        migrationFrom: ['vtex.previous-app@2.0.0', 'vtex.previous-app@3.0.0'],
      }

      const { getByTestId } = renderComponent(CSS_HANDLES, options)

      expect(getByTestId('test-div').className).toBe(
        'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-2-x-element1 vtex-previous-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-2-x-element2 vtex-previous-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass'
      )
    })

    it('doesnt repeat the migration if the current app happens to be the same as the migration one', () => {
      const CSS_HANDLES = ['element1', 'element2']
      const options = {
        migrationFrom: [
          'vtex.previous-app@2.0.0',
          'vtex.previous-app@3.0.0',
          'vtex.app@2.1.0',
        ],
      }

      const { getByTestId } = renderComponent(CSS_HANDLES, options)

      expect(getByTestId('test-div').className).toBe(
        'vtex-app-2-x-element1 vtex-app-2-x-element1--blockClass vtex-previous-app-2-x-element1 vtex-previous-app-2-x-element1--blockClass vtex-previous-app-3-x-element1 vtex-previous-app-3-x-element1--blockClass vtex-app-2-x-element2 vtex-app-2-x-element2--blockClass vtex-previous-app-2-x-element2 vtex-previous-app-2-x-element2--blockClass vtex-previous-app-3-x-element2 vtex-previous-app-3-x-element2--blockClass'
      )
    })
  })
})
