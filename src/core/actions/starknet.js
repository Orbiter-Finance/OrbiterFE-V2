import axios from 'axios'
import * as starknet from 'starknet'
import util from '../../util/util'
import Axios from '../utils/Axios'
import config from '../utils/config'

Axios.axios()

let configNet = config.starknet.Mainnet
// const transferSelector = starknet.number.hexToDecimalString(
//   getSelectorFromName('transfer')
// )
const transferSelector = 'transfer'
const TRANSACTION_CACHES = {}
const getTransaction = async (hash, chainId, retryCount = 0) => {
  // From cache
  if (TRANSACTION_CACHES[hash]) {
    return TRANSACTION_CACHES[hash]
  }

  if (chainId == 44) {
    configNet = config.starknet.Rinkeby
  }

  let header, calldata
  try {
    const resp = await axios.get(`${configNet}/api/txn/${hash}`)
    header = resp.data?.header
    calldata = resp.data?.calldata
  } catch (err) {
    // Out max retry count
    if (retryCount >= 3) {
      // console.error(
      //   `Get starknet transaction [${hash}] failed: ${err.message}, retryCount: ${retryCount}`
      // )
      return undefined
    }

    await util.sleep(1000)
    return getTransaction(hash, chainId, (retryCount += 1))
  }

  // Check data
  if (!header || !calldata || calldata.length < 7) {
    return undefined
  }

  // Check selector
  if (calldata[1] != transferSelector) {
    return undefined
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

  // When transaction isConfirmed, cache it
  if (
    util.equalsIgnoreCase(transaction.txreceipt_status, 'Accepted on L2') ||
    util.equalsIgnoreCase(transaction.txreceipt_status, 'Accepted on L1')
  ) {
    TRANSACTION_CACHES[hash] = transaction
  }

  return transaction
}

export default {
  getTransaction,

  /**
   *
   * @param {{starknetAddress: string, p: number}} req
   * @param {number} chainId
   * @returns {Promise<{hash:string, timestamp: number, type:string}[]>}
   */
  getTransationList: async (req, chainId) => {
    if (chainId === 44) {
      configNet = config.starknet.Rinkeby
    }

    const resp = await axios.get(
      `${configNet}/api/txns?to=${req.starknetAddress}&ps=20&p=${req.p}`
    )
    const { data } = resp

    if (!data?.items) {
      return []
    }

    return data.items
  },
}
