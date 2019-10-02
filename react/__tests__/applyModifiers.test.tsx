import applyModifiers from '../applyModifiers'

console.error = jest.fn()

describe('applyModifier', () => {
  it('should apply a single modifier properly', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifier = 'test'

    const modified = applyModifiers(handle, modifier)

    expect(modified).toBe(
      `vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--test vtex-app-2-x-handle--blockClass--test`
    )
  })
  it('should apply multiple modifiers properly', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifiers = ['test', 'test2']

    const modified = applyModifiers(handle, modifiers)

    expect(modified).toBe(
      'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--test vtex-app-2-x-handle--blockClass--test vtex-app-2-x-handle--test2 vtex-app-2-x-handle--blockClass--test2'
    )
  })
  it('should not apply modifier if its not a string', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifier = 0 as any

    const modified = applyModifiers(handle, modifier)

    expect(modified).toBe('vtex-app-2-x-handle vtex-app-2-x-handle--blockClass')
  })
  it('should refrain from applying a modifier from an array if its not a string', () => {
    const handle = 'vtex-app-2-x-handle vtex-app-2-x-handle--blockClass'
    const modifiers = ['test', 0, null] as any

    const modified = applyModifiers(handle, modifiers)

    expect(modified).toBe(
      `vtex-app-2-x-handle vtex-app-2-x-handle--blockClass vtex-app-2-x-handle--test vtex-app-2-x-handle--blockClass--test`
    )
  })
})
