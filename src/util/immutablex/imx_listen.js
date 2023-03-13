import util from '../util'
import { IMXHelper } from './imx_helper'

const IMX_LISTEN_TRANSFER_DURATION = 5 * 1000

export class IMXListen {
  chainId = 0
  receiver = undefined
  isFirstTicker = true
  transferReceivedHashs = {}
  transferConfirmationedHashs = {}
  listens = []
  tickerTimer = null

  constructor(chainId, receiver = undefined, isFirstTicker = true) {
    this.chainId = chainId
    this.receiver = receiver
    this.isFirstTicker = isFirstTicker

    this.start()
  }

  start() {
    const ticker = async () => {
      const imxHelper = new IMXHelper(this.chainId)

      const imxClient = await imxHelper.getImmutableXClient()

      const transfers = await imxClient.getTransfers({
        page_size: 200,
        direction: 'desc',
        receiver: this.receiver,
      })

      if (!transfers.result) {
        return
      }

      for (const item of transfers.result) {
        const hash = item.transaction_id

        if (this.transferReceivedHashs[hash] !== undefined) {
          continue
        }

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

    this.tickerTimer = setInterval(ticker, IMX_LISTEN_TRANSFER_DURATION)
  }

  /**
   * @param {any} transfer
   * @param {number} retryCount
   * @returns
   */
  async doTransfer(transfer, retryCount = 0) {
    const { transaction_id } = transfer
    if (!transaction_id) {
      return
    }
    const imxHelper = new IMXHelper(this.chainId)

    // When retryCount > 0, get new data
    if (retryCount > 0) {
      try {
        const imxClient = await imxHelper.getImmutableXClient()
        transfer = await imxClient.getTransfer({
          id: transfer.transaction_id,
        })
      } catch (err) {
        console.error(
          `Get imx transaction [${transaction_id}] failed: ${err.message}, retryCount: ${retryCount}`
        )

        // Out max retry count
        if (retryCount >= 10) {
          return
        }

        await util.sleep(10000)
        return this.doTransfer(transfer, (retryCount += 1))
      }

      if (!transfer) {
        return
      }
    }

    const transaction = imxHelper.toTransaction(transfer)
    const { hash, from, to, txreceipt_status } = transaction

    const isConfirmed =
      util.equalsIgnoreCase(txreceipt_status, 'confirmed') ||
      util.equalsIgnoreCase(txreceipt_status, 'success')
    const isRejected = util.equalsIgnoreCase(txreceipt_status, 'rejected')

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
    } else if (!isRejected) {
      await util.sleep(2000)
      this.doTransfer(transfer)
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
 * @param {string} receiver
 * @param {boolean} isFirstTicker
 * @returns {IMXListen}
 */
export function factoryIMXListen(
  chainId,
  receiver = undefined,
  isFirstTicker = true
) {
  const factoryKey = `${chainId}:${receiver}:${isFirstTicker}`

  if (factorys[factoryKey]) {
    return factorys[factoryKey]
  } else {
    return (factorys[factoryKey] = new IMXListen(
      chainId,
      receiver,
      isFirstTicker
    ))
  }
}
