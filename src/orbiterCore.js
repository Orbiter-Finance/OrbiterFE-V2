import { CHAIN_ID } from './config'
import orbiterHelper from './util/orbiter_helper'

const BigNumber = require('bignumber.js')

const SIZE_OP = {
  P_NUMBER: 4,
}

const MAX_BITS = {
  [CHAIN_ID.zksync]: 35,
  [CHAIN_ID.imx]: 28,
  [CHAIN_ID.dydx]: 28,
  [CHAIN_ID.zkspace]: 35,
  [CHAIN_ID.zksync_test]: 35,
  [CHAIN_ID.imx_test]: 28,
  [CHAIN_ID.dydx_test]: 28,
  [CHAIN_ID.zkspace_test]: 35,
}

function isLPChain(chain) {
  if (
    chain === CHAIN_ID.loopring ||
    chain === CHAIN_ID.loopring_test ||
    chain === 'loopring'
  ) {
    return true
  }
}

function isLimitNumber(chain) {
  if (
    chain === CHAIN_ID.zksync ||
    chain === CHAIN_ID.zksync_test ||
    chain === 'zksync'
  ) {
    return true
  }
  if (
    chain === CHAIN_ID.imx ||
    chain === CHAIN_ID.imx_test ||
    chain === 'immutablex'
  ) {
    return true
  }
  if (
    chain === CHAIN_ID.dydx ||
    chain === CHAIN_ID.dydx_test ||
    chain === 'dydx'
  ) {
    return true
  }
  if (
    chain === CHAIN_ID.zkspace ||
    chain === CHAIN_ID.zksync_test ||
    chain === 'zkspace'
  ) {
    return true
  }
  return false
}

function getToAmountFromUserAmount(userAmount, selectMakerConfig, isWei) {
  const decimals =
    selectMakerConfig.fromChain?.decimals || selectMakerConfig.precision
  const toDecimals = selectMakerConfig.toChain?.decimals
  let toAmount_tradingFee = new BigNumber(userAmount).minus(
    new BigNumber(selectMakerConfig.tradingFee)
  )

  let gasFee = toAmount_tradingFee
    .multipliedBy(new BigNumber(selectMakerConfig.gasFee))
    .dividedBy(new BigNumber(1000))
  let digit =
    orbiterHelper.isMiddleDecimals({ decimals }) ||
    orbiterHelper.isMiddleDecimals({ decimals: toDecimals })
      ? 6
      : decimals === 18
      ? 5
      : 2
  let gasFee_fix = gasFee.decimalPlaces(digit, BigNumber.ROUND_UP)
  let toAmount_fee = toAmount_tradingFee.minus(gasFee_fix)

  if (
    !toAmount_fee ||
    isNaN(toAmount_fee) ||
    toAmount_fee.lt(new BigNumber(0))
  ) {
    return 0
  }
  if (isWei) {
    return toAmount_fee.multipliedBy(new BigNumber(10 ** decimals))
  } else {
    return toAmount_fee
  }
}

function getTAmountFromRAmount(chain, amount, pText) {
  if (amount < 1) {
    return {
      state: false,
      error: "the token doesn't support that many decimal digits",
    }
  }

  let validDigit = AmountValidDigits(chain, amount) // 10 11
  var amountLength = amount.toString().length
  if (amountLength < SIZE_OP.P_NUMBER) {
    return {
      state: false,
      error: 'Amount size must be greater than pNumberSize',
    }
  }
  if (isLimitNumber(chain) && amountLength > validDigit) {
    let tAmount =
      amount.toString().slice(0, validDigit - pText.length) +
      pText +
      amount.toString().slice(validDigit)
    return {
      state: true,
      tAmount,
    }
  } else if (isLPChain(chain)) {
    return {
      state: true,
      tAmount: amount,
    }
  } else {
    let tAmount =
      amount.toString().slice(0, amountLength - pText.length) + pText
    return {
      state: true,
      tAmount,
    }
  }
}

function getRAmountFromTAmount(chain, amount) {
  let pText = ''
  for (let index = 0; index < SIZE_OP.P_NUMBER; index++) {
    pText = pText + '0'
  }
  if (amount < 1) {
    return {
      state: false,
      error: "the token doesn't support that many decimal digits",
    }
  }

  let validDigit = AmountValidDigits(chain, amount) // 10 11
  var amountLength = amount.toString().length
  if (amountLength < SIZE_OP.P_NUMBER) {
    return {
      state: false,
      error: 'Amount size must be greater than pNumberSize',
    }
  }
  if (isLimitNumber(chain) && amountLength > validDigit) {
    let rAmount =
      amount.toString().slice(0, validDigit - SIZE_OP.P_NUMBER) +
      pText +
      amount.toString().slice(validDigit)
    return {
      state: true,
      rAmount,
    }
  } else {
    let rAmount =
      amount.toString().slice(0, amountLength - SIZE_OP.P_NUMBER) + pText
    return {
      state: true,
      rAmount,
    }
  }
}

// 0 ~ (2 ** N - 1)
function AmountRegion(chain) {
  if (typeof chain === 'number') {
    let max = BigNumber(2 ** (MAX_BITS[chain] || 256) - 1)
    return {
      min: BigNumber(0),
      max,
    }
  } else if (typeof chain === 'string') {
    let max = BigNumber(2 ** (MAX_BITS[chain] || 256) - 1)
    return {
      min: BigNumber(0),
      max,
    }
  }
}

function AmountMaxDigits(chain) {
  let amountRegion = AmountRegion(chain)
  if (amountRegion.error) {
    return amountRegion
  }
  return amountRegion.max.toFixed().length
}

function AmountValidDigits(chain, amount) {
  let amountMaxDigits = AmountMaxDigits(chain)
  if (amountMaxDigits.error) {
    return amountMaxDigits.error
  }
  let amountRegion = AmountRegion(chain)

  let ramount = removeSidesZero(amount.toString())

  if (ramount.length > amountMaxDigits) {
    return 'amount is inValid'
  }
  if (ramount > amountRegion.max.toFixed()) {
    return amountMaxDigits - 1
  } else {
    return amountMaxDigits
  }
}

function removeSidesZero(param) {
  if (typeof param !== 'string') {
    return 'param must be string'
  }
  return param.replace(/^0+(\d)|(\d)0+$/gm, '$1$2')
}

/**
 * @param {number} precision
 */
function getDigitByPrecision(precision) {
  return orbiterHelper.isMiddleDecimals({ decimals: precision })
    ? 6
    : precision === 18
    ? 6
    : 2
}

export default {
  getTAmountFromRAmount,
  getRAmountFromTAmount,
  getToAmountFromUserAmount,
  getDigitByPrecision,
}
