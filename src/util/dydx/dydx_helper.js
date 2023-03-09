import { DydxClient } from '@dydxprotocol/v3-client'
import { getAccountId } from '@dydxprotocol/v3-client/build/src/lib/db'
import BigNumber from 'bignumber.js'
import { ethers, utils } from 'ethers'
import config from '../../core/utils/config'
import util from '../util'
const DYDX_MAKERS = {
  '0x694434EC84b7A8Ad8eFc57327ddD0A428e23f8D5': {
    starkKey:
      '04e69175389829db733f41ae75e7ba59ea2b2849690c734fcd291c94d6ec6017',
    positionId: '60620',
  },
}

const DYDX_CLIENTS = {}
const DYDX_ACCOUNTS = {}

export class DydxHelper {
  chainId = 0
  networkId = 0
  host = ''
  web3 = undefined
  signingMethod = ''

  /**
   * @param {number} chainId
   * @param {Web3 | undefined} web3
   * @param {string} signingMethod TypedData | MetaMask
   */
  constructor(chainId, web3, signingMethod = 'TypedData') {
    if (chainId == 11) {
      this.networkId = 1
      this.host = config.dydx.Mainnet
    }
    if (chainId == 511) {
      this.networkId = 3
      this.host = config.dydx.Rinkeby
    }

    this.chainId = chainId
    this.web3 = web3
    this.signingMethod = signingMethod
  }

  /**
   * @param {string} ethereumAddress
   * @param {boolean} alwaysNew
   * @param {boolean} alwaysDeriveStarkKey
   * @returns {Promise<DydxClient>}
   */
  async getDydxClient(
    ethereumAddress = '',
    alwaysNew = false,
    alwaysDeriveStarkKey = false
  ) {
    const dydxClientKey = ethereumAddress.toLowerCase()
    const clientOld = DYDX_CLIENTS[dydxClientKey]

    if (clientOld && !alwaysNew) {
      if (alwaysDeriveStarkKey && ethereumAddress) {
        // Reset DyDxClient.private, It will new when use
        clientOld._private = null

        clientOld.starkPrivateKey = await clientOld.onboarding.deriveStarkKey(
          ethereumAddress,
          this.signingMethod
        )
      }

      return clientOld
    }

    if (!this.host) {
      throw new Error('Sorry, miss param [host]')
    }
    // if (!this.web3) {
    //   throw new Error('Sorry, miss param [web3]')
    // }
    // Ensure network
    if (!(await util.ensureWalletNetwork(this.chainId))) {
      throw new Error('Network error')
    }
    const client = new DydxClient(this.host, {
      networkId: this.networkId,
      web3: this.web3,
    })
    if (ethereumAddress && this.web3) {
      const userExists = await client.public.doesUserExistWithAddress(
        ethereumAddress
      )
      if (userExists.exists) {
        if (alwaysDeriveStarkKey) {
          client.starkPrivateKey = await client.onboarding.deriveStarkKey(
            ethereumAddress,
            this.signingMethod
          )
        }

        const apiCredentials =
          await client.onboarding.recoverDefaultApiCredentials(
            ethereumAddress,
            this.signingMethod
          )
        client.apiKeyCredentials = apiCredentials
      } else {
        const keyPair = await client.onboarding.deriveStarkKey(
          ethereumAddress,
          this.signingMethod
        )
        client.starkPrivateKey = keyPair

        const user = await client.onboarding.createUser(
          {
            starkKey: keyPair.publicKey,
            starkKeyYCoordinate: keyPair.publicKeyYCoordinate,
          },
          ethereumAddress,
          undefined,
          this.signingMethod
        )
        client.apiKeyCredentials = user.apiKey
      }
    }

    return (DYDX_CLIENTS[dydxClientKey] = client)
  }

  /**
   * @param {string} ethereumAddress
   * @param {boolean} ensureUser
   * @returns {Promise<ethers.BigNumber>}
   */
  async getBalanceUsdc(ethereumAddress, ensureUser = true) {
    if (!ethereumAddress) {
      throw new Error('Sorry, miss param [user]')
    }

    let balance = ethers.BigNumber.from(0)

    try {
      let dydxClient = DYDX_CLIENTS[ethereumAddress]
      if (ensureUser && !dydxClient) {
        dydxClient = await this.getDydxClient(ethereumAddress)
      }

      if (dydxClient) {
        const { account } = await dydxClient.private.getAccount(ethereumAddress)
        const usdc = parseInt((account.freeCollateral || 0) * 10 ** 6)
        balance = balance.add(usdc)
      }
    } catch (err) {
      console.warn('GetBalanceUsdc failed: ' + err.message)
    }

    return balance
  }

  /**
   * @param {string} ethereumAddress
   * @param {boolean} alwaysNew
   * @returns {Promise<import('@dydxprotocol/v3-client').AccountResponseObject>}
   */
  async getAccount(ethereumAddress, alwaysNew = false) {
    const dydxAccountKey = String(ethereumAddress)

    if (DYDX_ACCOUNTS[dydxAccountKey] && !alwaysNew) {
      return DYDX_ACCOUNTS[dydxAccountKey]
    }

    const dydxClient = await this.getDydxClient(ethereumAddress)
    const { account } = await dydxClient.private.getAccount(ethereumAddress)

    return (DYDX_ACCOUNTS[dydxAccountKey] = account)
  }

  /**
   * @param {string} ethereumAddress
   * @returns {string}
   */
  getAccountId(ethereumAddress) {
    return getAccountId({ address: ethereumAddress })
  }

  /**
   * @param {string} ethereumAddress
   * @returns {{starkKey: string, positionId: string}}
   */
  getMakerInfo(ethereumAddress) {
    const info = DYDX_MAKERS[ethereumAddress]
    if (!info) {
      throw new Error(`Sorry, miss DYDX_MAKERS: ${ethereumAddress}`)
    }
    return info
  }

  /**
   * @param {string} starkKey ex: 0x0367e161e41f692fc96ee22a8ab313d71bbd310617df4a02675bcfc87a3b708f
   * @param {string} positionId ex: 58011
   * @returns 0x...
   */
  conactStarkKeyPositionId(starkKey, positionId) {
    let positionIdStr = Number(positionId).toString(16)
    if (positionIdStr.length % 2 !== 0) {
      positionIdStr = `0${positionIdStr}`
    }
    return `${starkKey}${positionIdStr}`
  }

  /**
   * @param {string} data 0x...
   * @returns {{starkKey: string, positionId:string}}
   */
  splitStarkKeyPositionId(data) {
    const starkKey = utils.hexDataSlice(data, 0, 32)
    const positionId = parseInt(utils.hexDataSlice(data, 32), 16)
    return { starkKey, positionId: String(positionId) }
  }

  /**
   * @param {string} ethereumAddress 0x...
   * @returns {string}
   */
  generateClientId(ethereumAddress) {
    const time = new Date().getTime()
    const rand = parseInt(Math.random() * 899 + 100)
    let sourceStr = `${ethereumAddress}${time}${rand}`
    if (sourceStr.length % 2 != 0) {
      sourceStr += '0'
    }
    sourceStr = sourceStr.replace(/^0x/i, '')

    return Buffer.from(sourceStr, 'hex').toString('base64')
  }

  /**
   * @param {string} clientId base64 string
   * @returns {string} 0x...
   */
  getEthereumAddressFromClientId(clientId) {
    const sourceStr = Buffer.from(clientId, 'base64').toString('hex')
    return utils.hexDataSlice('0x' + sourceStr, 0, 20)
  }

  /**
   * DYDX transfer => Eth transaction
   * @param {any} transfer dYdX transfer
   * @param {string} ethereumAddress 0x...
   * @returns
   */
  static toTransaction(transfer, ethereumAddress) {
    const timeStampMs = new Date(transfer.createdAt).getTime()
    const nonce = DydxHelper.timestampToNonce(timeStampMs)

    const isTransferIn = util.equalsIgnoreCase('TRANSFER_IN', transfer.type)
    const isTransferOut = util.equalsIgnoreCase('TRANSFER_OUT', transfer.type)

    const transaction = {
      timeStamp: parseInt(timeStampMs / 1000 + ''),
      hash: transfer.id,
      nonce,
      blockHash: '',
      transactionIndex: 0,
      from: '',
      to: '',
      value: new BigNumber(
        isTransferIn ? transfer.creditAmount : transfer.debitAmount
      )
        .multipliedBy(10 ** 6)
        .toString(), // Only usdc
      txreceipt_status: transfer.status,
      contractAddress: '', // Only usdc
      confirmations: 0,
    }

    if (isTransferIn) {
      transaction.to = ethereumAddress
    }
    if (isTransferOut) {
      transaction.from = ethereumAddress
    }

    return transaction
  }

  /**
   * The api does not return the nonce value, timestamp(ms) last three number is the nonce
   *  (warnning: there is a possibility of conflict)
   * @param {number | string} timestamp ms
   * @returns {string}
   */
  static timestampToNonce(timestamp) {
    let nonce = 0

    if (timestamp) {
      timestamp = String(timestamp)
      const match = timestamp.match(/(\d{3})$/i)
      if (match && match.length > 1) {
        nonce = Number(match[1]) || 0
      }

      if (nonce > 900) {
        nonce = nonce - 100
      }
    }

    return nonce + ''
  }
}
