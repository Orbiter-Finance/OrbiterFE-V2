import {
  //   UserAPI,
  ExchangeAPI,
  GlobalAPI,
  ConnectorNames,
  ChainId,
  generateKeyPair,
  UserAPI,
  VALID_UNTIL,
  OffchainFeeReqType,
  //   WhitelistedUserAPI,
} from '@loopring-web/loopring-sdk'
import axios from 'axios'
import config from '../utils/config'
import Web3 from 'web3'
import { store } from '../../store'
var configNet = config.loopring.Mainnet

export default {
  getUserAPI: function (localChainID) {
    let netWorkID = localChainID == 9 ? 1 : 5
    return new UserAPI(netWorkID)
  },

  getExchangeAPI: function (localChainID) {
    let netWorkID = localChainID == 9 ? 1 : 5
    return new ExchangeAPI(netWorkID)
  },

  getLoopringBalance: async function (address, localChainID) {
    const accountResult = await this.accountInfo(address, localChainID)
    if (!accountResult) {
      return 0
    }
    let accountInfo
    if (accountResult.code) {
      return 0
    } else {
      accountInfo = accountResult.accountInfo
    }
    if (localChainID == 99) {
      configNet = config.loopring.Rinkeby
    }
    try {
      const resp = await axios.get(
        `${configNet}/api/v3/user/balances?accountId=${accountInfo.accountId}&tokens=0`
      )
      if (resp.status == 200 && resp.statusText == 'OK') {
        if (!Array.isArray(resp.data)) {
          return 0
        }
        if (resp.data.length == 0) {
          return 0
        }
        let balanceMap = resp.data[0]
        let totalBalance = balanceMap.total ? balanceMap.total : 0
        let locked = balanceMap.locked ? balanceMap.locked : 0
        let withDraw = balanceMap.withDraw ? balanceMap.withDraw : 0
        return totalBalance - locked - withDraw
      }
    } catch (err) {
      console.error(`Get loopring balance failed: ${err.message}`)
    }
  },

  accountInfo: async function (address, localChainID) {
    let accountInfo = store.state.lpAccountInfo
    if (accountInfo) {
      return {
        accountInfo: accountInfo,
        code: 0,
      }
    }
    if (!address || !localChainID) {
      return null
    }
    const exchangeApi = this.getExchangeAPI(localChainID)
    let GetAccountRequest = {
      owner: address,
    }
    let response = await exchangeApi.getAccount(GetAccountRequest)
    if (response.accInfo && response.raw_data) {
      let info = {
        accountInfo: response.accInfo,
        code: 0,
      }
      store.commit('updatelpAccountInfo', response.accInfo)
      return info
    } else {
      if (response.code == 101002) {
        let info = {
          code: 101002,
          errorMessage: 'noAccount',
        }
        return info
      } else {
        let info = {
          code: response.code,
          errorMessage: response.message,
        }
        return info
      }
    }
  },

  sendTransfer: async function (
    address,
    localChainID,
    toAddress,
    toAddressID,
    tokenAddress,
    amount,
    memo
  ) {
    const exchangeApi = this.getExchangeAPI(localChainID)
    const userApi = this.getUserAPI(localChainID)
    const accountResult = await this.accountInfo(address, localChainID)
    if (!accountResult) {
      throw Error('获取用户信息失败')
    }
    let accInfo
    if (accountResult.code) {
      throw Error('Get account error')
    } else {
      accInfo = accountResult?.accountInfo
    }
    if (
      accInfo.nonce == 0 &&
      accInfo.keyNonce == 0 &&
      accInfo.publicKey.x == '' &&
      accInfo.publicKey.y == '' &&
      accInfo.keySeed == ''
    ) {
      throw Error('用户账号未激活')
    }
    if (accInfo.frozen) {
      throw Error('用户路印账号被冻结')
    }
    const { exchangeInfo } = await exchangeApi.getExchangeInfo()
    const web3 = new Web3(window.ethereum)
    let options = {
      web3,
      address: accInfo.owner,
      keySeed:
        accInfo.keySeed && accInfo.keySeed !== ''
          ? accInfo.keySeed
          : GlobalAPI.KEY_MESSAGE.replace(
              '${exchangeAddress}',
              exchangeInfo.exchangeAddress
            ).replace('${nonce}', (accInfo.nonce - 1).toString()),
      walletType: ConnectorNames.MetaMask,
      chainId: localChainID == 99 ? ChainId.GOERLI : ChainId.MAINNET,
    }

    const eddsaKey = await generateKeyPair(options)

    let GetUserApiKeyRequest = {
      accountId: accInfo.accountId,
    }
    const { apiKey } = await userApi.getUserApiKey(
      GetUserApiKeyRequest,
      eddsaKey.sk
    )
    if (!apiKey) {
      throw Error('Get Loopring ApiKey Error')
    }
    console.log('apiKey =', apiKey)
    store.commit('updatelpApiKey', apiKey)
    // step 3 get storageId
    const GetNextStorageIdRequest = {
      accountId: accInfo.accountId,
      sellTokenId: 0,
    }
    const storageId = await userApi.getNextStorageId(
      GetNextStorageIdRequest,
      apiKey
    )
    // step 4 transfer
    const OriginTransferRequestV3 = {
      exchange: exchangeInfo.exchangeAddress,
      payerAddr: address,
      payerId: accInfo.accountId,
      payeeAddr: toAddress,
      payeeId: toAddressID,
      storageId: storageId.offchainId,
      token: {
        tokenId: 0,
        volume: amount + '',
      },
      maxFee: {
        tokenId: 0,
        volume: '94000000000000000',
      },
      validUntil: VALID_UNTIL,
      memo: memo,
    }
    const response = await userApi.submitInternalTransfer({
      request: OriginTransferRequestV3,
      web3: web3,
      chainId: localChainID == 99 ? ChainId.GOERLI : ChainId.MAINNET,
      walletType: ConnectorNames.MetaMask,
      eddsaKey: eddsaKey.sk,
      apiKey: apiKey,
      isHWAddr: false,
    })
    return response
  },

  getTransferFee: async function (address, localChainID) {
    const accountResult = await this.accountInfo(address, localChainID)
    if (!accountResult) {
      return 0
    }
    let acc
    if (accountResult.code) {
      return 0
    } else {
      acc = accountResult.accountInfo
    }
    let sendAmount = store.state.transferData.transferValue
    const GetOffchainFeeAmtRequest = {
      accountId: acc.accountId,
      requestType: OffchainFeeReqType.TRANSFER,
      tokenSymbol: 'ETH',
      amount: sendAmount,
    }
    let userApi = this.getUserAPI(localChainID)
    const response = await userApi.getOffchainFeeAmt(
      GetOffchainFeeAmtRequest,
      ''
    )
    if (response?.fees?.ETH?.fee) {
      return response.fees.ETH.fee
    }
    return 0
  },
}
