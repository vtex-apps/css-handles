import React from 'react'
import { render } from '@vtex/test-tools/react'

import { SYMBOL_CUSTOM_CLASSES } from '../useCustomClasses'
import Root from '../__fixtures__/Root'

jest.mock('../hooks/useExtension', () => ({
  useExtension: jest.fn(() => ({
    component: 'vtex.app@2.1.0',
  })),
}))

test('should create nested CSS Handles', () => {
  const { container } = render(<Root />)

  const rootElement = container.querySelector('.vtex-app-2-x-root')
  const nestedElement = container.querySelector('.vtex-app-2-x-nested')

  expect(rootElement).toBeInTheDocument()
  expect(nestedElement).toBeInTheDocument()
})

test('should work with custom classes', () => {
  const { container } = render(
    <Root
      classes={{
        root: 'customRoot',
        __useCustomClasses: SYMBOL_CUSTOM_CLASSES,
      }}
    />
  )

  const rootElement = container.querySelector('.customRoot')
  const nestedElement = container.querySelector('.vtex-app-2-x-nested')

  expect(rootElement).toBeInTheDocument()
  expect(nestedElement).toBeInTheDocument()
})
