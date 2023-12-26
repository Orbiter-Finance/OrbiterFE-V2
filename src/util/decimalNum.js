export const decimalNum = (
  num = 0,
  decimal,
  delimiter = '',
  currencySymbol = ''
) => {
  decimal = Number(decimal) || 2

  const big = num ? num.toString() : '0'

  const negativeNChar = Number(big) < 0 ? '-' : ''

  const bigArr = (Number(big) < 0 ? big.slice(1) : big).toString().split('.')
  let intStr = ''
  let decStr = bigArr[1]?.slice(0, Number(decimal)) || ''

  while (!Number(decStr[decStr.length - 1]) && !!decStr) {
    decStr = decStr.slice(0, decStr.length - 1)
  }
  bigArr[0]
    .split('')
    .reverse()
    .forEach((item, idx) => {
      if (!!idx && !(idx % 3) && idx !== bigArr[0].length) {
        intStr = item + delimiter + intStr
      } else {
        intStr = item + intStr
      }
    })

  if (Number(decimal)) {
    if (decStr) {
      intStr += '.' + decStr
    }
  }

  return currencySymbol + negativeNChar + intStr
}
