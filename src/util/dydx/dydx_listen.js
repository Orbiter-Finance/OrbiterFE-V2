import util from '../util'
import { DydxHelper } from './dydx_helper'

const DYDX_LISTEN_TRANSFER_DURATION = 5 * 1000

export class DydxListen {
  chainId = 0
  web3 = undefined
  ethereumAddress = undefined
  isFirstTicker = true
  transferReceivedHashs = {}
  transferConfirmationedHashs = {}
  listens = []
  tickerTimer = null

  constructor(chainId, web3, ethereumAddress, isFirstTicker = true) {
    this.chainId = chainId
    this.web3 = web3
    this.ethereumAddress = ethereumAddress
    this.isFirstTicker = isFirstTicker

    this.start()
  }

  start() {
    const ticker = async () => {
      const dydxHelper = new DydxHelper(this.chainId, this.web3, 'MetaMask')
      const dydxClient = await dydxHelper.getDydxClient(this.ethereumAddress)

      const transfers = await dydxClient.private.getTransfers({
        limit: 10,
      })
      if (!transfers.transfers) {
        return
      }

      for (const item of transfers.transfers) {
        const hash = item.id

        // if (this.transferReceivedHashs[hash] !== undefined) {
        //   continue
        // }

        // Set transferReceivedHashs[hash] = false
        this.transferReceivedHashs[hash] = false

        // Ignore first ticker
        if (this.isFirstTicker) {
          continue
        }

        this.doTransfer(item)
      }

      this.isFirstTicker = false
    }
    ticker()

    this.tickerTimer = setInterval(ticker, DYDX_LISTEN_TRANSFER_DURATION)
  }

  /**
   * @param {any} transfer
   * @returns
   */
  async doTransfer(transfer) {
    const { id } = transfer
    if (!id) {
      return
    }

    const transaction = DydxHelper.toTransaction(transfer, this.ethereumAddress)
    const { hash, from, to, txreceipt_status } = transaction

    const isConfirmed = util.equalsIgnoreCase(txreceipt_status, 'CONFIRMED')

    for (const item of this.listens) {
      const { filter, callbacks } = item

      if (filter) {
        if (filter.from && filter.from.toUpperCase() != from.toUpperCase()) {
          continue
        }
        if (filter.to && filter.to.toUpperCase() != to.toUpperCase()) {
          continue
        }
      }

      if (this.transferReceivedHashs[hash] !== true) {
        callbacks && callbacks.onReceived && callbacks.onReceived(transaction)
      }

      if (
        this.transferConfirmationedHashs[transaction.hash] === undefined &&
        isConfirmed
      ) {
        // console.warn(`Transaction [${transaction.hash}] was confirmed.`)
        callbacks &&
          callbacks.onConfirmation &&
          callbacks.onConfirmation(transaction)
      }
    }

    this.transferReceivedHashs[hash] = true

    if (isConfirmed) {
      this.transferConfirmationedHashs[transaction.hash] = true
    }
  }

  transfer(filter, callbacks = undefined) {
    this.listens.push({ filter, callbacks })
  }

  clearListens() {
    this.listens = []
  }

  destroy() {
    if (this.tickerTimer) {
      clearInterval(this.tickerTimer)
    }
  }
}

const factorys = {}
/**
 *
 * @param {number} chainId
 * @param {Web3} receiver
 * @param {boolean} isFirstTicker
 * @returns {DydxListen}
 */
export function factoryDydxListen(
  chainId,
  web3,
  ethereumAddress,
  isFirstTicker = true
) {
  const factoryKey = `${chainId}:${ethereumAddress}:${isFirstTicker}`

  if (factorys[factoryKey]) {
    return factorys[factoryKey]
  } else {
    return (factorys[factoryKey] = new DydxListen(chainId, web3, isFirstTicker))
  }
}
