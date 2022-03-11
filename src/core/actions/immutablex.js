import { IMXHelper } from '../../util/immutablex/imx_helper'
import util from '../../util/util'

export default {
  /**
   *
   * @param {{user?: string, receiver?: string, cursor?: string}} req
   * @param {number} chainId
   * @param {number} needTimeStamp
   * @returns
   */
  getTransationList: async (req, chainId, needTimeStamp) => {
    const imxHelper = new IMXHelper(chainId)
    const imxClient = await imxHelper.getImmutableXClient()

    const transactions = []

    let isNext = true
    let currentCursor = req.cursor
    while (isNext) {
      const resp = await imxClient.getTransfers({
        user: req.user,
        receiver: req.receiver,
        cursor: currentCursor,
        direction: 'desc',
        page_size: 100,
      })
      if (!resp?.result || resp.result.length < 1) {
        break
      }

      currentCursor = resp.cursor

      for (const item of resp.result) {
        const transaction = imxHelper.toTransaction(item)
        if (transaction.timeStamp < needTimeStamp) {
          isNext = false
          break
        }

        if (util.equalsIgnoreCase(transaction.txreceipt_status, 'rejected')) {
          continue
        }

        transactions.push(transaction)
      }
    }

    return transactions
  },
}
