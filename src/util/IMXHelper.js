import { ImmutableXClient } from '@imtbl/imx-sdk'
import { ethers, providers } from 'ethers'
import Web3 from 'web3'

const CONTRACTS = {
  ropsten: {
    publicApiUrl: 'https://api.ropsten.x.immutable.com/v1',
    starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
    registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
  },
  mainnet: {
    publicApiUrl: 'https://api.x.immutable.com/v1',
    starkContractAddress: '',
    registrationContractAddress: '',
  },
}

const IMMUTABLEX_CLIENTS = {}

export class IMXHelper {
  publicApiUrl = ''
  starkContractAddress = ''
  registrationContractAddress = ''

  /**
   * @param {number} chainId
   */
  constructor(chainId) {
    if (chainId == 8) {
      this.publicApiUrl = CONTRACTS.mainnet.publicApiUrl
      this.starkContractAddress = CONTRACTS.mainnet.starkContractAddress
      this.registrationContractAddress =
        CONTRACTS.mainnet.registrationContractAddress
    }
    if (chainId == 88) {
      this.publicApiUrl = CONTRACTS.ropsten.publicApiUrl
      this.starkContractAddress = CONTRACTS.ropsten.starkContractAddress
      this.registrationContractAddress =
        CONTRACTS.ropsten.registrationContractAddress
    }
  }

  /**
   *
   * @param {string | number | undefined} addressOrIndex
   * @returns {Promise<ImmutableXClient>}
   */
  async getImmutableXClient(addressOrIndex = '') {
    const immutableXClientKey = String(addressOrIndex)

    if (IMMUTABLEX_CLIENTS[immutableXClientKey]) {
      return IMMUTABLEX_CLIENTS[immutableXClientKey]
    }

    if (!this.starkContractAddress) {
      throw new Error('Sorry, miss param [starkContractAddress]')
    }
    if (!this.registrationContractAddress) {
      throw new Error('Sorry, miss param [registrationContractAddress]')
    }

    let signer = undefined
    if (addressOrIndex) {
      const web3Provider = new Web3(window.ethereum)
      const provider = new providers.Web3Provider(web3Provider.currentProvider)
      signer = provider.getSigner(addressOrIndex)
    }

    return (IMMUTABLEX_CLIENTS[immutableXClientKey] =
      await ImmutableXClient.build({
        publicApiUrl: this.publicApiUrl,
        signer,
        starkContractAddress: this.starkContractAddress,
        registrationContractAddress: this.registrationContractAddress,
      }))
  }

  /**
   * @param {string} user
   * @param {string} s
   * @returns {Promise<ethers.BigNumber>}
   */
  async getBalanceBySymbol(user, s = 'ETH') {
    if (!user) {
      throw new Error('Sorry, miss param [user]')
    }
    if (!s) {
      throw new Error('Sorry, miss param [s]')
    }

    let balance = ethers.BigNumber.from(0)

    try {
      const imxc = await this.getImmutableXClient()
      const data = await imxc.listBalances({ user })

      if (!data.result) {
        return balance
      }

      for (const item of data.result) {
        if (item.symbol.toUpperCase() != s.toUpperCase()) {
          continue
        }

        balance = balance.add(item.balance)
      }
    } catch (err) {
      console.warn('GetBalanceBySymbol failed: ' + err.message)
    }

    return balance
  }

  /**
   * The api does not return the nonce value, timestamp(ms) last three number is the nonce
   *  (warnning: there is a possibility of conflict)
   * @param {number | string} timestamp ms
   * @returns {string}
   */
  timestampToNonce(timestamp) {
    let nonce = 0

    if (timestamp) {
      timestamp = String(timestamp)
      const match = timestamp.match(/(\d{3})$/i)
      if (match.length > 1) {
        nonce = Number(match[1]) || 0
      }

      if (nonce > 900) {
        nonce = nonce - 100
      }
    }

    return nonce + ''
  }
}
