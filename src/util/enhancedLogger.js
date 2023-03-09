// in some cases, more striking logs may be more expected, so this file will bring
// more power to console

/**
 *
 * @param bgColor
 * @param textColor
 * @param description description will be colored, but printParams will be not, so u can custom it with ur own mind
 * @param printParams the more params u want log in console
 * @returns void
 */
console.enhancedLog = (
  bgColor = '#fff',
  textColor = '#333',
  description = '',
  ...printParams
) => {
  console.log(
    `%c${description}`,
    `color:${textColor};background:${bgColor}`,
    ...printParams
  )
}

const withColorBinding = (bgColor) => {
  return (description = '', ...printParams) => {
    console.enhancedLog(bgColor, '#fff', description, ...printParams)
  }
}

console.errorLog = withColorBinding('red')

console.warnLog = withColorBinding('orange')

console.successLog = withColorBinding('green')

console.notifyLog = withColorBinding('#1e90ff')
