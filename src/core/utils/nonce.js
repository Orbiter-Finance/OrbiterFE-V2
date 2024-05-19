import thirdapi from '../actions/thirdapi'
import loopring from '../actions/loopring'
import zkspace from '../actions/zkspace'
import { getStarkNonce } from '../../util/constants/starknet/helper'
import util from '../../util/util'
import { CHAIN_ID } from '../../config'

export default {
  getNonce: async function (
    localChainID,
    tokenAddress,
    tokenName,
    userAddress
  ) {
    if (
      localChainID === CHAIN_ID.zksync ||
      localChainID === CHAIN_ID.zksync_test
    ) {
      const req = {
        account: userAddress,
        localChainID,
        stateType: 'committed',
      }
      try {
        const accountInfo = await thirdapi.getZKAccountInfo(req)
        if (!accountInfo || !accountInfo.result) {
          return 0
        }
        const nonce = accountInfo.result.nonce
        return nonce
      } catch (error) {
        console.warn('error =', error)
        return 0
      }
    } else if (
      localChainID === CHAIN_ID.starknet ||
      localChainID === CHAIN_ID.starknet_test
    ) {
      try {
        const nonce = Number(await getStarkNonce())
        return nonce
      } catch (error) {
        return 0
      }
    } else if (
      localChainID === CHAIN_ID.solana ||
      localChainID === CHAIN_ID.solana_test
    ) {
      return 0
    } else if (
      localChainID === CHAIN_ID.ton ||
      localChainID === CHAIN_ID.ton_test
    ) {
      return 0
    } else if (
      localChainID === CHAIN_ID.imx ||
      localChainID === CHAIN_ID.imx_test
    ) {
      return 0
    } else if (
      localChainID === CHAIN_ID.loopring ||
      localChainID === CHAIN_ID.loopring_test
    ) {
      // https://api3.loopring.io/api/v3/user/balances?accountId=1&tokens=0,1
      const nonceObj = await loopring.getAccountStorageID(
        userAddress,
        localChainID,
        0
      )
      if (nonceObj && nonceObj.offchainId > 0) {
        return (nonceObj.offchainId - 1) / 2
      }
      return 0
    } else if (
      localChainID === CHAIN_ID.dydx ||
      localChainID === CHAIN_ID.dydx_test
    ) {
      return 0
    } else if (
      localChainID === CHAIN_ID.zkspace ||
      localChainID === CHAIN_ID.zkspace_test
    ) {
      const accountInfo = await zkspace.getZKAccountInfo(
        localChainID,
        userAddress
      )
      if (accountInfo) {
        return accountInfo.nonce
      }
      return 0
    } else {
      try {
        const nonce = await util.requestWeb3(
          localChainID,
          'getTransactionCount',
          userAddress
        )
        return nonce
      } catch (err) {
        console.warn('getWeb3NonceError =', err)
        return 0
      }
    }
  },
}
