import { Notification } from 'element-ui'
import { ethers, utils } from 'ethers'
import env from '../../env'
import { Coin_ABI } from './constants/contract/contract'
import util from './util'

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
  '0x02': 'Cross Dydx Address',
  '0x03': 'Cross Stark Address',
}

export class CrossAddress {
  /**
   * @param {ethers.providers.JsonRpcProvider} provider
   * @param {number} orbiterChainId
   * @param {ethers.Signer | undefined} signer
   */
  constructor(provider, orbiterChainId = 5, signer = undefined) {
    this.contractAddress = env.crossAddressContracts[orbiterChainId]
    if (!this.contractAddress) {
      throw new Error('Sorry, miss param [contractAddress]')
    }

    this.provider = provider
    this.signer = signer || provider.getSigner()
    this.networkId = env.localChainID_netChainID[orbiterChainId]
  }

  async checkNetworkId() {
    if (!this.providerNetworkId) {
      this.providerNetworkId = (await this.provider.getNetwork()).chainId
    }
    if (this.providerNetworkId != this.networkId) {
      throw new Error(
        `Sorry, currentNetworkId: ${this.providerNetworkId} no equal networkId: ${this.networkId}`
      )
    }
  }

  /**
   * @param {Contract} contractErc20
   */
  async getAllowance(contractErc20) {
    const ownerAddress = await this.signer.getAddress()
    const allowance = await contractErc20.allowance(
      ownerAddress,
      this.contractAddress
    )
    return allowance
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

    const n = Notification({
      duration: 0,
      title: 'Approving...',
      type: 'warning',
    })
    try {
      // Waitting approve succeed
      for (let index = 0; index < 5000; index++) {
        const allowance = await this.getAllowance(contract)
        if (amount.lte(allowance)) {
          break
        }

        await util.sleep(2000)
      }

      n.close()
    } catch (error) {
      n.close()
      throw error
    }
  }

  /**
   *
   * @param {string} tokenAddress 0x...
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @param {{type: string, value: string} | undefined} ext
   * @return {Promise<{hash: string}>}
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

    const extHex = CrossAddress.encodeExt(ext)

    const options = { value: amount.toHexString() }

    return await contract.transfer(to, extHex, options)
  }

  /**
   *
   * @param {string} tokenAddress 0x...
   * @param {string} to
   * @param {ethers.BigNumber} amount
   * @param {{type: string, value: string} | undefined} ext
   * @return {Promise<{hash: string}>}
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
    const allowance = await this.getAllowance(contractErc20)
    if (amount.gt(allowance)) {
      await this.approveERC20(tokenAddress)
    }

    const contract = new ethers.Contract(
      this.contractAddress,
      CROSS_ADDRESS_ABI,
      this.signer
    )
    const extHex = CrossAddress.encodeExt(ext)
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
  static encodeExt(ext) {
    if (!ext || !utils.isHexString(ext.type)) {
      return '0x'
    }
    if (!ext.value) {
      return ext.type
    }

    if (
      ext.type == '0x03' &&
      utils.isHexString(ext.value) &&
      ext.value.length % 2 == 1
    ) {
      let starkAddress = ext.value.substring(2)
      ext.value = '0x0' + starkAddress
    }
    return utils.hexConcat([ext.type, ext.value])
  }

  /**
   *
   * @param {string} hex
   * @returns {{type: string, value: string} | undefined}
   */
  static decodeExt(hex) {
    if (!utils.isHexString(hex)) {
      return undefined
    }

    const type = utils.hexDataSlice(hex, 0, 1)
    const value = utils.hexDataSlice(hex, 1)
    return { type, value }
  }

  /**
   * @param {string} input 0x...
   */
  static parseTransferInput(input) {
    const [to, ext] = utils.defaultAbiCoder.decode(
      ['address', 'bytes'],
      utils.hexDataSlice(input, 4)
    )
    return { to, ext: CrossAddress.decodeExt(ext) }
  }

  /**
   * @param {string} input 0x...
   */
  static parseTransferERC20Input(input) {
    const [token, to, amount, ext] = utils.defaultAbiCoder.decode(
      ['address', 'address', 'uint256', 'bytes'],
      utils.hexDataSlice(input, 4)
    )
    return { token, to, amount, ext: CrossAddress.decodeExt(ext) }
  }
}
