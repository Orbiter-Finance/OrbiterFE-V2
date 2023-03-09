import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import util from './util'

let exchangeRates = null

/**
 * @param currency
 * @returns
 */
async function cacheExchangeRates(currency = 'USD') {
  // cache
  exchangeRates = await getRates(currency)
  if (exchangeRates) {
    const metisExchangeRates = await getRates('metis')
    if (metisExchangeRates && metisExchangeRates.USD) {
      const usdToMetis = 1 / Number(metisExchangeRates.USD)
      exchangeRates.METIS = String(usdToMetis)
    }
    const bnbExchangeRates = await getRates('bnb')
    if (bnbExchangeRates && bnbExchangeRates.USD) {
      const usdTobnb = 1 / Number(bnbExchangeRates.USD)
      exchangeRates.BNB = String(usdTobnb)
    }
    return exchangeRates
  } else {
    return undefined
  }
}
export async function getRates(currency) {
  try {
    const resp = await axios.get(
      `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`
    )
    const data = resp.data?.data
    // check
    if (
      !data ||
      !util.equalsIgnoreCase(data.currency, currency) ||
      !data.rates
    ) {
      return undefined
    }
    return data.rates
  } catch (error) {
    return undefined
  }
}

/**
 * @param sourceCurrency
 * @returns {Promise<BigNumber>}
 */
export async function getExchangeToUsdRate(sourceCurrency = 'ETH') {
  // toUpperCase
  sourceCurrency = sourceCurrency.toUpperCase()

  const currency = 'USD'

  let rate = -1
  try {
    if (!exchangeRates) {
      exchangeRates = await cacheExchangeRates(currency)
    }
    if (exchangeRates?.[sourceCurrency]) {
      rate = exchangeRates[sourceCurrency]
    }
  } catch (error) {
    console.error(error)
  }

  return new BigNumber(rate)
}
/**
 * @param sourceCurrency
 * @returns BigNumber
 */
export function asyncGetExchangeToUsdRate(sourceCurrency = 'ETH') {
  // toUpperCase
  sourceCurrency = sourceCurrency.toUpperCase()
  let rate = -1
  if (exchangeRates?.[sourceCurrency]) {
    rate = exchangeRates[sourceCurrency]
  }
  return new BigNumber(rate)
}

/**
 * @param value
 * @param sourceCurrency
 * @returns {Promise<BigNumber>}
 */
export async function exchangeToUsd(value = 1, sourceCurrency = 'ETH') {
  if (!(value instanceof BigNumber)) {
    value = new BigNumber(value)
  }

  const rate = await getExchangeToUsdRate(sourceCurrency)
  if (rate.comparedTo(0) !== 1) {
    return new BigNumber(0)
  }

  return value.dividedBy(rate)
}

export async function exchangeToCoin(
  value = 1,
  sourceCurrency = 'ETH',
  toCurrency,
  rates
) {
  if (!(value instanceof BigNumber)) {
    value = new BigNumber(value)
  }
  const exchangeRates = rates || (await getRates(sourceCurrency))
  const fromRate = exchangeRates[sourceCurrency]
  const toRate = exchangeRates[toCurrency]
  if (!fromRate || !toRate) {
    return new BigNumber(0)
  }
  util.log(`${sourceCurrency} rate`, fromRate, `${toCurrency} rate`, toRate)
  return value.dividedBy(fromRate).multipliedBy(toRate)
}
