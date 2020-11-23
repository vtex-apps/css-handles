import useCustomClasses, { SYMBOL_CUSTOM_CLASSES } from '../useCustomClasses'

jest.mock('react', () => ({
  useMemo: (callback: () => any) => callback(),
}))

test('useCustomClasses', () => {
  const classes = { foo: 'bar' }

  const result = useCustomClasses(() => classes)

  expect(result.foo).toBe('bar')
  expect(result.__classes).toBe(SYMBOL_CUSTOM_CLASSES)
})
