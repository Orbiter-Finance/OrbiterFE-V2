import axios from 'axios'
import * as starknet from 'starknet'
import { getSelectorFromName } from 'starknet/dist/utils/stark'
import util from '../util'

const STARKNET_LISTEN_TRANSFER_DURATION = 5 * 1000

class StarknetListen {
  constructor(api, apiParamsTo = '') {
    this.api = api
    this.apiParamsTo = apiParamsTo
    this.selectorDec = starknet.number.hexToDecimalString(
      getSelectorFromName('transfer')
    )
    this.isFirstTicker = true
    this.transferReceivedHashs = {}
    this.transferConfirmationedHashs = {}
    this.listens = []

    this.start()
  }

  start() {
    const ticker = async (p = 1) => {
      const resp = await axios.get(
        `${this.api.endPoint}/api/txns?to=${this.apiParamsTo}&ps=10&p=${p}`
      )
      const { data } = resp

      if (!data?.items) {
        return
      }

      let isGetNextPage = true

      for (const item of data.items) {
        const { hash, type } = item

        if (!util.equalsIgnoreCase(type, 'invoke')) {
          continue
        }
        if (this.transferReceivedHashs[hash] !== undefined) {
          isGetNextPage = false
          continue
        }

        // Set transferReceivedHashs[hash] = false
        this.transferReceivedHashs[hash] = false

        // Ignore first ticker
        if (this.isFirstTicker) {
          isGetNextPage = false
          continue
        }

        this.getTransaction(hash).catch((err) => {
          console.error(
            `Starknet getTransaction faild [${hash}]: ${err.message}`
          )
        })
      }

      if (isGetNextPage) {
        await ticker((p += 1))
      }

      this.isFirstTicker = false
    }
    ticker()

    setInterval(ticker, STARKNET_LISTEN_TRANSFER_DURATION)
  }

  async getTransaction(hash, retryCount = 0) {
    if (!hash) {
      return
    }

    let header, calldata
    try {
      const resp = await axios.get(`${this.api.endPoint}/api/txn/${hash}`)
      header = resp.data?.header
      calldata = resp.data?.calldata
    } catch (err) {
      console.error(
        `Get starknet transaction [${hash}] failed: ${err.message}, retryCount: ${retryCount}`
      )

      // Out max retry count
      if (retryCount >= 10) {
        return
      }

      await util.sleep(10000)
      return this.getTransaction(hash, (retryCount += 1))
    }

    // Check data
    if (!header || !calldata || calldata.length < 7) {
      return
    }

    // Check selector
    if (calldata[1] != this.selectorDec) {
      return
    }

    // Clear front zero
    const from = starknet.number.toHex(
      starknet.number.toBN(starknet.number.hexToDecimalString(header.to))
    )
    const to = starknet.number.toHex(starknet.number.toBN(calldata[3]))
    const contractAddress = starknet.number.toHex(
      starknet.number.toBN(calldata[0])
    )

    const transaction = {
      timeStamp: header.timestamp,
      hash: header.hash,
      nonce: calldata[6],
      blockHash: header.blockId,
      transactionIndex: header.index,
      from,
      to,
      value: calldata[4],
      txreceipt_status: header.status,
      contractAddress,
      confirmations: 0,
    }

    const isConfirmed =
      util.equalsIgnoreCase(transaction.txreceipt_status, 'Accepted on L2') ||
      util.equalsIgnoreCase(transaction.txreceipt_status, 'Accepted on L1')

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
        console.warn(`Transaction [${transaction.hash}] was confirmed.`)
        callbacks &&
          callbacks.onConfirmation &&
          callbacks.onConfirmation(transaction)
      }
    }

    this.transferReceivedHashs[hash] = true

    if (isConfirmed) {
      this.transferConfirmationedHashs[transaction.hash] = true
    } else {
      await util.sleep(2000)
      this.getTransaction(hash)
    }
  }

  transfer(filter, callbacks = undefined) {
    this.listens.push({ filter, callbacks })
  }
}

const factorys = {}
/**
 *
 * @param {any} api
 * @param {string} apiParamsTo
 * @returns {StarknetListen}
 */
export function factoryStarknetListen(api, apiParamsTo = '') {
  const factoryKey = `${api.endPoint}:${api.key}`

  if (factorys[factoryKey]) {
    return factorys[factoryKey]
  } else {
    return (factorys[factoryKey] = new StarknetListen(api, apiParamsTo))
  }
}
