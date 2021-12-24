/*
 * Remove flag
 *amount
 *tokenDecimal
 *useDigits
 */
function realAmount(amount, tokenDecimal, useDigits) {
  tokenDecimal = tokenDecimal ? tokenDecimal : 18
  useDigits = useDigits ? useDigits : 5
  var deleteLength = tokenDecimal - useDigits
  var amountLength = amount.length
  var realAmount
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
  var len = _arr.length
  for (var i = 0; i < len; i++) {
    if (isObjectValueEqual(_arr[i], _obj)) {
      return i
    }
  }
  return -1
}

function isObjectValueEqual(obj1, obj2) {
  if (typeof obj1 != 'object' && typeof obj2 != 'object') {
    if (obj1 == obj2) {
      return true
    } else {
      return false
    }
  }
  var obj1Props = Object.getOwnPropertyNames(obj1)
  var obj2Props = Object.getOwnPropertyNames(obj2)

  if (obj1Props.length != obj2Props.length) {
    return false
  }
  for (var i = 0; i < obj1Props.length; i++) {
    var propName = obj1Props[i]
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
