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
    let metisExchangeRates = await getRates('metis')
    if (metisExchangeRates && metisExchangeRates["USD"]) {
      let usdToMetis = 1 / Number(metisExchangeRates["USD"])
      exchangeRates["METIS"] = String(usdToMetis)
    }
  } else {
    return undefined
  }
}

async function getRates(currency) {
  const resp = await axios.get(
    `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`
  )
  const data = resp.data?.data
  // check
  if (!data || !util.equalsIgnoreCase(data.currency, currency) || !data.rates) {
    return undefined
  }
  return data.rates
}

setInterval(() => cacheExchangeRates(), 10 * 1000)

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
