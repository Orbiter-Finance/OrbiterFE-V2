import axios from 'axios'
import * as starknet from 'starknet'
import { getSelectorFromName } from 'starknet/dist/utils/hash'
import util from '../util'
import {
  getProviderByChainId,
  getStarkNetValidAddress,
} from '../constants/starknet/helper'

const STARKNET_LISTEN_TRANSFER_DURATION = 5 * 1000

class StarknetListen {
  constructor(api, apiParamsTo = '', localChainID) {
    this.api = api
    this.apiParamsTo = apiParamsTo
    this.selectorDec = getSelectorFromName('transfer')

    this.isFirstTicker = true
    this.transferReceivedHashs = {}
    this.transferConfirmationedHashs = {}
    this.listens = []
    this.provider = getProviderByChainId(localChainID)
    this.localChainID = localChainID
  }

  start() {
    let clearTiker
    const ticker = async () => {
      // if (this.localChainID == 11) {
      //   const resp = await axios.get(
      //     `${this.api.endPoint}/txns?to=${this.apiParamsTo}&ps=10&p=${p}`
      //   )
      //   const { data } = resp
      //   if (!data?.items) {
      //     return
      //   }

      //   let isGetNextPage = true

      //   for (const item of data.items) {
      //     const { hash, type } = item

      //     if (!util.equalsIgnoreCase(type, 'invoke')) {
      //       continue
      //     }
      //     if (this.transferReceivedHashs[hash] !== undefined) {
      //       isGetNextPage = false
      //       continue
      //     }

      //     // Set transferReceivedHashs[hash] = false
      //     this.transferReceivedHashs[hash] = false

      //     // Ignore first ticker
      //     if (this.isFirstTicker) {
      //       isGetNextPage = false
      //       continue
      //     }

      //     this.getTransaction(hash).catch((err) => {
      //       console.error(
      //         `Starknet getTransaction faild [${hash}]: ${err.message}`
      //       )
      //     })
      //   }

      //   if (isGetNextPage) {
      //     await ticker((p += 1))
      //   }

      //   this.isFirstTicker = false
      // } else {
      const blockInfo = await this.provider.getBlock('pending')
      if (blockInfo) {
        const transactions = blockInfo.transactions
        for (const tx of transactions.filter(
          (tx) =>
            tx.type === 'INVOKE_FUNCTION' &&
            getStarkNetValidAddress(tx.contract_address) ==
              getStarkNetValidAddress(this.apiParamsTo)
        )) {
          const calldata = tx.calldata
          // Check data
          if (!calldata || calldata.length < 7) {
            break
          }
          // Check selector
          if (calldata[2] != this.selectorDec) {
            break
          }
          // Clear front zero
          const from = starknet.number.toHex(
            starknet.number.toBN(
              starknet.number.hexToDecimalString(tx.contract_address)
            )
          )
          const to = starknet.number.toHex(starknet.number.toBN(calldata[6]))
          const contractAddress = starknet.number.toHex(
            starknet.number.toBN(calldata[1])
          )
          const transaction = {
            timeStamp: Number(blockInfo.timestamp),
            hash: tx.transaction_hash,
            nonce: tx.nonce,
            blockHash: '',
            transactionIndex: '',
            from,
            to,
            value: Number(calldata[7]),
            txreceipt_status: blockInfo.status,
            contractAddress,
            confirmations: 0,
          }
          const isConfirmed =
            util.equalsIgnoreCase(
              transaction.txreceipt_status,
              'ACCEPTED_ON_L2'
            ) ||
            util.equalsIgnoreCase(
              transaction.txreceipt_status,
              'ACCEPTED_ON_L2'
            ) ||
            util.equalsIgnoreCase(transaction.txreceipt_status, 'PENDING')

          for (const item of this.listens) {
            const { filter, callbacks } = item

            if (filter) {
              if (
                getStarkNetValidAddress(filter.from) &&
                getStarkNetValidAddress(filter.from).toUpperCase() !=
                  getStarkNetValidAddress(from).toUpperCase()
              ) {
                continue
              }
              if (
                getStarkNetValidAddress(filter.to) &&
                getStarkNetValidAddress(filter.to).toUpperCase() !=
                  getStarkNetValidAddress(to).toUpperCase()
              ) {
                continue
              }
              if (filter.amount != transaction.value) {
                continue
              }
            }

            if (this.transferReceivedHashs[tx.transaction_hash] !== true) {
              this.transferReceivedHashs[tx.transaction_hash] = true
              callbacks &&
                callbacks.onReceived &&
                callbacks.onReceived(transaction)
            }

            if (
              this.transferConfirmationedHashs[transaction.hash] ===
                undefined &&
              isConfirmed
            ) {
              if (isConfirmed) {
                this.transferConfirmationedHashs[transaction.hash] = true
              }
              console.warn(`Transaction [${transaction.hash}] was confirmed.`)
              if (clearTiker) {
                clearInterval(clearTiker)
              }
              callbacks &&
                callbacks.onConfirmation &&
                callbacks.onConfirmation(transaction)
            }
          }
        }
      }
      // }
    }
    ticker()
    clearTiker = setInterval(ticker, STARKNET_LISTEN_TRANSFER_DURATION)
  }

  async getTransaction(hash, retryCount = 0) {
    if (!hash) {
      return
    }

    let header, calldata
    try {
      const resp = await axios.get(`${this.api.endPoint}/txn/${hash}`)
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
    if (calldata[2] != this.selectorDec) {
      return
    }

    // Clear front zero
    const from = starknet.number.toHex(
      starknet.number.toBN(starknet.number.hexToDecimalString(header.to))
    )
    const to = starknet.number.toHex(starknet.number.toBN(calldata[6]))
    const contractAddress = starknet.number.toHex(
      starknet.number.toBN(calldata[1])
    )
    const transaction = {
      timeStamp: header.timestamp,
      hash: header.hash,
      nonce: calldata[9],
      blockHash: header.blockId,
      transactionIndex: header.index,
      from,
      to,
      value: Number(calldata[7]),
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
export function factoryStarknetListen(api, apiParamsTo = '', localChainID) {
  const factoryKey = `${api.endPoint}:${api.key}:${apiParamsTo}:${localChainID}`

  if (factorys[factoryKey]) {
    return factorys[factoryKey]
  } else {
    return (factorys[factoryKey] = new StarknetListen(
      api,
      apiParamsTo,
      localChainID
    ))
  }
}
