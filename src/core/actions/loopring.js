import {
  //   UserAPI,
  ExchangeAPI,
  GlobalAPI,
  ConnectorNames,
  ChainId,
  generateKeyPair,
  UserAPI,
  OffchainFeeReqType,
  sleep,
  //   WhitelistedUserAPI,
} from '@loopring-web/loopring-sdk'
import axios from 'axios'
import config from '../utils/config'
import Web3 from 'web3'
import { store } from '../../store'
import {
  transferDataState,
  lpAccountInfo,
  updatelpAccountInfo,
  updatelpApiKey,
} from '../../composition/hooks'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { CHAIN_ID } from '../../config'
let configNet = config.loopring.Mainnet

export default {
  getUserAPI: function (localChainID) {
    const netWorkID = localChainID === CHAIN_ID.loopring ? 1 : 5
    return new UserAPI({ chainId: netWorkID })
  },

  getExchangeAPI: function (localChainID) {
    const netWorkID = localChainID === CHAIN_ID.loopring ? 1 : 5
    return new ExchangeAPI({ chainId: netWorkID })
  },
  getLpTokenInfoOnce(fromChainID, tokenAddress) {
    const lpTokenInfos =
      fromChainID === CHAIN_ID.loopring
        ? store.state.lpTokenList.mainnet
        : store.state.lpTokenList.rinkeby
    return lpTokenInfos.find((item) => item.address == tokenAddress)
  },
  async getLpTokenInfo(fromChainID, tokenAddress, count = 10) {
    const theLpTokenInfo = this.getLpTokenInfoOnce(fromChainID, tokenAddress)
    if (theLpTokenInfo) {
      return theLpTokenInfo
    } else {
      await sleep(100)
      count--
      if (count > 0) {
        await this.getLpTokenInfo(fromChainID, tokenAddress, count)
      } else {
        return 0
      }
    }
  },
  getLoopringBalance: async function (
    address,
    localChainID,
    isMaker,
    lpTokenInfo
  ) {
    try {
      let accountInfo
      if (isMaker) {
        const exchangeApi = this.getExchangeAPI(localChainID)
        const GetAccountRequest = {
          owner: address,
        }
        const response = await exchangeApi.getAccount(GetAccountRequest)
        if (response.accInfo && response.raw_data) {
          accountInfo = response.accInfo
        } else {
          if (response.code === 101002) {
            return 0
          } else {
            return 0
          }
        }
      } else {
        const accountResult = await this.accountInfo(address, localChainID)
        if (!accountResult || accountResult.code) {
          return 0
        }
        accountInfo = accountResult.accountInfo
      }
      if (localChainID === CHAIN_ID.loopring_test) {
        configNet = config.loopring.Rinkeby
      }
      const resp = await axios.get(
        `${configNet}/api/v3/user/balances?accountId=${
          accountInfo.accountId
        }&tokens=${lpTokenInfo ? lpTokenInfo.tokenId : 0}`
      )
      if (resp.status === 200) {
        if (!Array.isArray(resp.data)) {
          return 0
        }
        if (resp.data.length === 0) {
          return 0
        }
        const balanceMap = resp.data[0]
        const totalBalance = balanceMap.total ? Number(balanceMap.total) : 0
        const locked = balanceMap.locked ? Number(balanceMap.locked) : 0
        const withdraw = balanceMap.pending.withdraw
          ? Number(balanceMap.pending.withdraw)
          : 0
        return totalBalance - locked - withdraw
      }
    } catch (err) {
      console.error(`Get loopring balance failed: ${err.message}`)
    }
  },

  accountInfo: async function (address, localChainID) {
    const accountInfoGroup = lpAccountInfo.value
    const accountInfo = accountInfoGroup?.[address?.toLocaleLowerCase() || '']
    if (accountInfo) {
      return {
        accountInfo,
        code: 0,
      }
    }
    if (!address || !localChainID) {
      return null
    }
    try {
      const exchangeApi = this.getExchangeAPI(localChainID)
      const response = await exchangeApi.getAccount({ owner: address })
      if (response.accInfo && response.raw_data) {
        const info = {
          accountInfo: response.accInfo,
          code: 0,
        }
        updatelpAccountInfo({
          ...(accountInfoGroup || {}),
          [address.toLocaleLowerCase()]: response.accInfo,
        })
        return info
      } else {
        const info = {
          code: response.code,
          errorMessage:
            response.code == 101002 ? 'noAccount' : response.message,
        }
        return info
      }
    } catch (error) {
      console.warn(`get lp accountInfo error:${error.message}`)
      return null
    }
  },
  sendTransfer: async function (
    address,
    localChainID,
    toAddress,
    _toAddressID,
    tokenAddress,
    amount,
    memo
  ) {
    const exchangeApi = this.getExchangeAPI(localChainID)
    const userApi = this.getUserAPI(localChainID)
    const accountResult = await this.accountInfo(address, localChainID)
    const toAccountResult = await this.accountInfo(toAddress, localChainID)
    if (!accountResult) {
      throw Error('get account error')
    }
    let accInfo, toaccInfo
    if (accountResult.code) {
      throw Error('Get account error')
    } else {
      accInfo = accountResult?.accountInfo
    }
    if (!toAccountResult) {
      throw Error('get account error')
    }
    if (toAccountResult.code) {
      throw Error('Get account error')
    } else {
      toaccInfo = toAccountResult?.accountInfo
    }
    const accountId = accInfo?.accountId
    const toAccountId = toaccInfo?.accountId
    const info = await userApi?.getCounterFactualInfo({ accountId })
    const isCounterFactual = !!info?.counterFactualInfo?.walletOwner

    if (
      accInfo.nonce == 0 &&
      accInfo.keyNonce == 0 &&
      accInfo.publicKey.x == '' &&
      accInfo.publicKey.y == '' &&
      accInfo.keySeed == ''
    ) {
      throw Error('account is not activated')
    }
    if (accInfo.frozen) {
      throw Error('User account is frozen')
    }
    const { exchangeInfo } = await exchangeApi.getExchangeInfo()
    const web3 = new Web3(
      compatibleGlobalWalletConf.value.walletPayload.provider
    )
    const options = {
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
      chainId:
        localChainID === CHAIN_ID.loopring_test
          ? ChainId.GOERLI
          : ChainId.MAINNET,
    }
    if (isCounterFactual) {
      Object.assign(options, { accountId })
    }

    const eddsaKey = await generateKeyPair(options)

    const GetUserApiKeyRequest = {
      accountId,
    }
    const { apiKey } = await userApi.getUserApiKey(
      GetUserApiKeyRequest,
      eddsaKey.sk
    )
    if (!apiKey) {
      throw Error('Get Loopring ApiKey Error')
    }
    updatelpApiKey(apiKey)
    // step 3 get storageId
    const lpTokenInfo = await this.getLpTokenInfo(localChainID, tokenAddress)
    if (Number(lpTokenInfo.tokenId) !== 0 && !lpTokenInfo?.tokenId) {
      throw new Error(`TokenId not found: ${lpTokenInfo.tokenId} `)
    }
    const GetNextStorageIdRequest = {
      accountId,
      sellTokenId: lpTokenInfo.tokenId,
    }
    const storageId = await userApi.getNextStorageId(
      GetNextStorageIdRequest,
      apiKey
    )
    const ts = Math.round(new Date().getTime() / 1000) + 30 * 86400
    // step 4 transfer
    const OriginTransferRequestV3 = {
      exchange: exchangeInfo.exchangeAddress,
      payerAddr: address,
      payerId: accountId,
      payeeAddr: toAddress,
      payeeId: toAccountId,
      storageId: storageId.offchainId,
      token: {
        tokenId: lpTokenInfo.tokenId,
        volume: amount + '',
      },
      maxFee: {
        tokenId: lpTokenInfo.tokenId,
        volume: '94000000000000000',
      },
      validUntil: ts,
      memo,
    }
    const response = isCounterFactual
      ? await userApi.submitInternalTransfer(
          {
            request: OriginTransferRequestV3,
            web3,
            chainId:
              localChainID === CHAIN_ID.loopring_test
                ? ChainId.GOERLI
                : ChainId.MAINNET,
            walletType: ConnectorNames.MetaMask,
            eddsaKey: eddsaKey.sk,
            apiKey,
            isHWAddr: false,
          },
          { accountId, counterFactualInfo: info.counterFactualInfo }
        )
      : await userApi.submitInternalTransfer({
          request: OriginTransferRequestV3,
          web3,
          chainId:
            localChainID === CHAIN_ID.loopring_test
              ? ChainId.GOERLI
              : ChainId.MAINNET,
          walletType: ConnectorNames.MetaMask,
          eddsaKey: eddsaKey.sk,
          apiKey,
          isHWAddr: false,
        })
    return response
  },

  getWithDrawFee: async function (address, localChainID, tokenName) {
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
    const sendAmount = transferDataState.transferValue
    const GetOffchainFeeAmtRequest = {
      accountId: acc.accountId,
      requestType: OffchainFeeReqType.OFFCHAIN_WITHDRAWAL,
      tokenSymbol: tokenName,
      amount: sendAmount,
    }
    const userApi = this.getUserAPI(localChainID)
    const response = await userApi.getOffchainFeeAmt(
      GetOffchainFeeAmtRequest,
      ''
    )
    const fee = response?.fees?.[tokenName]?.fee
    if (fee) {
      return fee
    }
    return 0
  },

  getTransferFee: async function (address, localChainID, lpTokenInfo) {
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
    const sendAmount = transferDataState.transferValue
    const GetOffchainFeeAmtRequest = {
      accountId: acc.accountId,
      requestType: OffchainFeeReqType.TRANSFER,
      tokenSymbol: lpTokenInfo ? lpTokenInfo.symbol : 'ETH',
      amount: sendAmount,
    }
    const userApi = this.getUserAPI(localChainID)
    const response = await userApi.getOffchainFeeAmt(
      GetOffchainFeeAmtRequest,
      ''
    )
    return response && lpTokenInfo && response.fees[lpTokenInfo.symbol]
      ? response.fees[lpTokenInfo.symbol].fee
      : 0
  },

  getAccountStorageID: async function (address, localChainID, tokenID) {
    try {
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

      const userApi = this.getUserAPI(localChainID)

      const GetNextStorageIdRequest = {
        accountId: acc.accountId,
        sellTokenId: tokenID,
      }
      const storageId = await userApi.getNextStorageId(
        GetNextStorageIdRequest,
        localChainID === CHAIN_ID.loopring
          ? process.env.VUE_APP_LP_MK_KEY
          : process.env.VUE_APP_LP_MKTEST_KEY
      )
      return storageId
    } catch (error) {
      console.warn('getLoopringNonceError =', error)
      return 0
    }
  },
}
