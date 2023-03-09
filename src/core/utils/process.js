/*
 * Remove flag
 *amount
 *tokenDecimal
 *useDigits
 */
function realAmount(amount, tokenDecimal, useDigits) {
  tokenDecimal = tokenDecimal || 18
  useDigits = useDigits || 5
  const deleteLength = tokenDecimal - useDigits
  const amountLength = amount.length
  let realAmount
  if (amountLength - deleteLength > 0) {
    realAmount =
      amount.slice(0, amountLength - deleteLength) +
      '0'.padEnd(deleteLength, '0')
  } else {
    realAmount = 0
  }
  return realAmount
}

function getIndexInArr(_arr, _obj) {
  const len = _arr.length
  for (let i = 0; i < len; i++) {
    if (isObjectValueEqual(_arr[i], _obj)) {
      return i
    }
  }
  return -1
}

function isObjectValueEqual(obj1, obj2) {
  if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
    if (obj1 == obj2) {
      return true
    } else {
      return false
    }
  }
  const obj1Props = Object.getOwnPropertyNames(obj1)
  const obj2Props = Object.getOwnPropertyNames(obj2)

  if (obj1Props.length != obj2Props.length) {
    return false
  }
  for (let i = 0; i < obj1Props.length; i++) {
    const propName = obj1Props[i]
    if (obj1[propName] !== obj2[propName]) {
      return false
    }
  }
  return true
}

export default {
  isObjectValueEqual,
  realAmount,
  getIndexInArr,
}
