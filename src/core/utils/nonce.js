import thirdapi from '../actions/thirdapi'
import loopring from '../actions/loopring'
import zkspace from '../actions/zkspace'
import { localWeb3 } from '../../util/constants/contract/localWeb3'
import { getStarkNonce } from '../../util/constants/starknet/helper'

export default {
  getNonce: async function (
    localChainID,
    tokenAddress,
    tokenName,
    userAddress
  ) {
    if (localChainID == 3 || localChainID == 33) {
      var req = {
        account: userAddress,
        localChainID: localChainID,
        stateType: 'committed',
      }
      try {
        let accountInfo = await thirdapi.getZKAccountInfo(req)
        if (!accountInfo || !accountInfo.result) {
          return 0
        }
        const nonce = accountInfo.result.nonce
        return nonce
      } catch (error) {
        console.warn('error =', error)
        return 0
      }
    } else if (localChainID === 4 || localChainID === 44) {
      try {
        let nonce = Number(await getStarkNonce())
        return nonce
      } catch (error) {
        return 0
      }
    } else if (localChainID === 8 || localChainID === 88) {
      return 0
    } else if (localChainID === 9 || localChainID === 99) {
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
    } else if (localChainID === 11 || localChainID === 511) {
      return 0
    } else if (localChainID === 12 || localChainID === 512) {
      const accountInfo = await zkspace.getZKAccountInfo(
        localChainID,
        userAddress
      )
      if (accountInfo) {
        return accountInfo.nonce
      }
      return 0
    } else {
      let nonce = 0
      const web3 = localWeb3(localChainID)
      try {
        nonce = await web3.eth.getTransactionCount(userAddress, 'pending')
        return nonce
      } catch (err) {
        console.warn('getWeb3NonceError =', err)
        return 0
      }
    }
  },
}
