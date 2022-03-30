import { ethers, utils } from 'ethers'
import { hexDataSlice, isHexString } from 'ethers/lib/utils'

export class CrossAddress {
  /**
   * @param {string} contractAddress
   * @param {ethers.providers.JsonRpcProvider} provider
   * @param {ethers.Signer | undefined} signer
   */
  constructor(contractAddress, provider, signer = undefined) {
    if (!contractAddress) {
      throw new Error('Sorry, miss param [contractAddress]')
    }

    this.contractAddress = contractAddress
    this.provider = provider
    this.signer = signer || provider.getSigner()
  }

  /**
   *
   * @param {{type: string, value: string}} ext
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
