import { DydxClient } from '@dydxprotocol/v3-client'
import { ethers } from 'ethers'
import Web3 from 'web3'

const HOSTS = {
  ropsten: 'https://api.stage.dydx.exchange',
  mainnet: 'https://api.dydx.exchange',
}

const DYDX_CLIENTS = {}
const DYDX_ACCOUNTS = {}

export class DydxHelper {
  networkId = 0
  host = ''
  web3 = null
  signingMethod = ''

  /**
   * @param {number} chainId
   * @param {Web3} web3
   * @param {string} signingMethod TypedData | MetaMask
   */
  constructor(chainId, web3, signingMethod = 'TypedData') {
    if (chainId == 11) {
      this.networkId = 1
      this.host = HOSTS.mainnet
    }
    if (chainId == 511) {
      this.networkId = 3
      this.host = HOSTS.ropsten
    }

    this.web3 = web3
    this.signingMethod = signingMethod
  }

  /**
   * @param {string} ethereumAddress
   * @param {boolean} alwaysNew
   * @returns {Promise<DydxClient>}
   */
  async getDydxClient(ethereumAddress = '', alwaysNew = false) {
    const dydxClientKey = String(ethereumAddress)

    if (DYDX_CLIENTS[dydxClientKey] && !alwaysNew) {
      return DYDX_CLIENTS[dydxClientKey]
    }

    if (!this.host) {
      throw new Error('Sorry, miss param [host]')
    }
    if (!this.web3) {
      throw new Error('Sorry, miss param [web3]')
    }

    const client = new DydxClient(this.host, {
      networkId: this.networkId,
      web3: this.web3,
    })
    if (ethereumAddress) {
      const userExists = await client.public.doesUserExistWithAddress(
        ethereumAddress
      )

      if (userExists.exists) {
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
   * @param {string} user
   * @param {ensureUser} user
   * @returns {Promise<ethers.BigNumber>}
   */
  async getBalanceUsdc(user, ensureUser = true) {
    if (!user) {
      throw new Error('Sorry, miss param [user]')
    }

    let balance = ethers.BigNumber.from(0)

    try {
      let dydxClient = DYDX_CLIENTS[user]
      if (ensureUser && !dydxClient) {
        dydxClient = await this.getDydxClient(user)
      }

      if (dydxClient) {
        const { account } = await dydxClient.private.getAccount(user)
        const usdc = parseInt((account.freeCollateral || 0) * 10 ** 6)
        balance = balance.add(usdc)
      }
    } catch (err) {
      console.warn('GetBalanceUsdc failed: ' + err.message)
    }

    return balance
  }

  async getAccount(){}

  // /**
  //  * IMX transfer => Eth transaction
  //  * @param {any} transfer IMX transfer
  //  * @returns
  //  */
  // toTransaction(transfer) {
  //   const timeStampMs = transfer.timestamp.getTime()
  //   const nonce = this.timestampToNonce(timeStampMs)

  //   // When it is ETH
  //   let contractAddress = transfer.token.data.token_address
  //   if (transfer.token.type == ETHTokenType.ETH) {
  //     contractAddress = '0x0000000000000000000000000000000000000000'
  //   }

  //   const transaction = {
  //     timeStamp: parseInt(timeStampMs / 1000),
  //     hash: transfer.transaction_id,
  //     nonce,
  //     blockHash: '',
  //     transactionIndex: 0,
  //     from: transfer.user,
  //     to: transfer.receiver,
  //     value: transfer.token.data.quantity + '',
  //     txreceipt_status: transfer.status,
  //     contractAddress,
  //     confirmations: 0,
  //   }

  //   return transaction
  // }

  // /**
  //  * The api does not return the nonce value, timestamp(ms) last three number is the nonce
  //  *  (warnning: there is a possibility of conflict)
  //  * @param {number | string} timestamp ms
  //  * @returns {string}
  //  */
  // timestampToNonce(timestamp) {
  //   let nonce = 0

  //   if (timestamp) {
  //     timestamp = String(timestamp)
  //     const match = timestamp.match(/(\d{3})$/i)
  //     if (match && match.length > 1) {
  //       nonce = Number(match[1]) || 0
  //     }

  //     if (nonce > 900) {
  //       nonce = nonce - 100
  //     }
  //   }

  //   return nonce + ''
  // }
}
