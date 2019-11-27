export default function generateBlockClass(
  baseClass: string = '',
  blockClass: string = ''
) {
  return blockClass
    ? `${baseClass} ${baseClass}--${blockClass.split(' ')[0]}`
    : baseClass
}
