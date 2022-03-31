import { ethers, utils } from 'ethers'
import { hexDataSlice, isHexString } from 'ethers/lib/utils'
import env from '../../env'
import { Coin_ABI } from './constants/contract/contract'

const CROSS_ADDRESS_ABI = [
  {
    inputs: [
      { internalType: 'address payable', name: '_to', type: 'address' },
      { internalType: 'bytes', name: '_ext', type: 'bytes' },
    ],
    name: 'transfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'bytes', name: '_ext', type: 'bytes' },
    ],
    name: 'transferERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export const CrossAddressTypes = {
  '0x01': 'Cross Ethereum Address',
  '0x02': 'Cross Stark Address',
}

export class CrossAddress {
  /**
   * @param {ethers.providers.JsonRpcProvider} provider
   * @param {number | undefined} orbiterChainId
   * @param {ethers.Signer | undefined} signer
   */
  constructor(
    provider,
    orbiterChainId,
    signer = undefined,
  ) {
    this.contractAddress = env.crossAddressContracts[orbiterChainId]
    if (!this.contractAddress) {
      throw new Error('Sorry, miss param [contractAddress]')
    }

    this.provider = provider
    this.signer = signer || provider.getSigner()
    this.networkId = env.localChainID_netChainID[orbiterChainId]
  }

  async checkNetworkId() {
    if (!this.currentNetworkId) {
      this.currentNetworkId = (await this.provider.getNetwork()).chainId
    }
    if (this.currentNetworkId != this.networkId) {
      throw new Error(
        `Sorry, currentNetworkId: ${this.currentNetworkId} no equal networkId: ${this.networkId}`
      )
    }
  }

  /**
   *
   * @param {string} tokenAddress 0x...
   * @param {ethers.BigNumber} amount
   */
  async approveERC20(tokenAddress, amount = ethers.constants.MaxUint256) {
    await this.checkNetworkId()

    const contract = new ethers.Contract(tokenAddress, Coin_ABI, this.signer)
    await contract.approve(this.contractAddress, amount)
  }

  /**
   *
   * @param {string} tokenAddress 0x...
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @param {{type: string, value: string} | undefined} ext
   * @return
   */
  async transfer(to, amount, ext = undefined) {
    await this.checkNetworkId()

    if (ext && !CrossAddressTypes[ext.type]) {
      throw new Error(`Invalid crossAddressType : ${ext.type}`)
    }

    const contract = new ethers.Contract(
      this.contractAddress,
      CROSS_ADDRESS_ABI,
      this.signer
    )

    const extHex = this.encodeExt(ext)
    const options = { value: amount.toHexString() }

    return await contract.transfer(to, extHex, options)
  }

  /**
   *
   * @param {string} tokenAddress 0x...
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @param {{type: string, value: string} | undefined} ext
   * @return
   */
  async transferERC20(tokenAddress, to, amount, ext = undefined) {
    await this.checkNetworkId()

    if (ext && !CrossAddressTypes[ext.type]) {
      throw new Error(`Invalid crossAddressType : ${ext.type}`)
    }

    // Check and approve erc20 amount
    const contractErc20 = new ethers.Contract(
      tokenAddress,
      Coin_ABI,
      this.provider
    )
    const ownerAddress = await this.signer.getAddress()
    const allowance = await contractErc20.allowance(
      ownerAddress,
      this.contractAddress
    )
    if (amount.gt(allowance)) {
      await this.approveERC20(tokenAddress)
    }

    const contract = new ethers.Contract(
      this.contractAddress,
      CROSS_ADDRESS_ABI,
      this.signer
    )
    const extHex = this.encodeExt(ext)
    return await contract.transferERC20(
      tokenAddress,
      to,
      amount.toHexString(),
      extHex
    )
  }

  /**
   *
   * @param {{type: string, value: string} | undefined} ext
   * @returns {string} hex
   */
  encodeExt(ext) {
    if (!ext || !isHexString(ext.type)) {
      return '0x'
    }
    if (!ext.value) {
      return ext.type
    }
    return utils.hexConcat([ext.type, ext.value])
  }

  /**
   *
   * @param {string} hex
   * @returns {{type: string, value: string} | undefined}
   */
  decodeExt(hex) {
    if (isHexString(hex)) {
      return undefined
    }

    const type = hexDataSlice(hex, 0, 1)
    const value = hexDataSlice(hex, 1)
    return { type, value }
  }
}
