import { Notification } from 'element-ui'
import { ethers, utils } from 'ethers'
import { Coin_ABI, CROSS_ADDRESS_ABI } from './constants/contract/contract'
import util from './util'
import walletDispatchers, { WALLETCONNECT } from './walletsDispatchers'
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'

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
  constructor(
    provider,
    orbiterChainId = 5,
    signer = undefined,
    contractAddress
  ) {
    const chainInfo = util.getChainInfoByChainId(orbiterChainId)
    this.contractAddress =
      contractAddress ||
      (chainInfo?.xvmList && chainInfo.xvmList.length
        ? chainInfo.xvmList[0]
        : '')
    if (!this.contractAddress) {
      console.log('Sorry, miss param [contractAddress]')
    }

    this.provider = provider
    this.orbiterChainId = orbiterChainId
    this.signer = signer || provider.getSigner()
    this.networkId = util.chainNetWorkId(orbiterChainId)
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
  async getAllowance(contractErc20, contractAddress = this.contractAddress) {
    const ownerAddress = await this.signer.getAddress()
    return await contractErc20.allowance(ownerAddress, contractAddress)
  }

  /**
   *
   * @param {string} tokenAddress 0x...
   * @param {ethers.BigNumber} amount
   */
  async approveERC20(
    tokenAddress,
    amount,
    contractAddress = this.contractAddress
  ) {
    await this.checkNetworkId()
    const contract = new ethers.Contract(tokenAddress, Coin_ABI, this.signer)
    const currentAllowance = await this.getAllowance(contract, contractAddress)
    await contract.approve(contractAddress, amount)

    const n = Notification({
      duration: 0,
      title: 'Approving...',
      type: 'warning',
    })
    try {
      // Waitting approve succeed
      for (let index = 0; index < 5000; index++) {
        const allowance = await this.getAllowance(contract, contractAddress)
        if (!currentAllowance.eq(allowance)) {
          n.close();
          if (amount.gt(allowance)) {
            throw new Error(`Approval amount is insufficient`);
          }
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

  async wallConnTransfer(to, value, ext = undefined) {
    if (ext && !CrossAddressTypes[ext.type]) {
      throw new Error(`Invalid crossAddressType : ${ext.type}`)
    }

    const iface = new ethers.utils.Interface(CROSS_ADDRESS_ABI)
    const extHex = CrossAddress.encodeExt(ext)
    const data = iface.encodeFunctionData('transfer', [to, extHex])
    const ownerAddress = await this.signer.getAddress()
    return await walletDispatchers.walletConnectSendTransaction(
      this.orbiterChainId,
      ownerAddress,
      this.contractAddress,
      value,
      data
    )
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
      await this.approveERC20(tokenAddress, amount)
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

  async walletConnApproveERC20(
    tokenAddress,
    amount = ethers.constants.MaxUint256,
    contractAddress = this.contractAddress
  ) {
    await this.checkNetworkId()

    const contract = new ethers.Contract(tokenAddress, Coin_ABI, this.signer)
    const iface = new ethers.utils.Interface(Coin_ABI)
    const data = iface.encodeFunctionData('approve', [contractAddress, amount])
    const ownerAddress = await this.signer.getAddress()
    const transferHash = await walletDispatchers.walletConnectSendTransaction(
      this.orbiterChainId,
      ownerAddress,
      tokenAddress,
      0,
      data
    )
    const n = Notification({
      duration: 0,
      title: 'Approving...',
      type: 'warning',
    })
    try {
      // Waitting approve succeed
      for (let index = 0; index < 5000; index++) {
        const allowance = await this.getAllowance(contract, contractAddress)
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

  async walletConnTransferERC20(tokenAddress, to, amount, ext = undefined) {
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
      await this.walletConnApproveERC20(tokenAddress)
    }
    // transfer
    const extHex = CrossAddress.encodeExt(ext)
    const iface = new ethers.utils.Interface(CROSS_ADDRESS_ABI)
    const data = iface.encodeFunctionData('transferERC20', [
      tokenAddress,
      to,
      amount.toHexString(),
      extHex,
    ])
    const ownerAddress = await this.signer.getAddress()
    return await walletDispatchers.walletConnectSendTransaction(
      this.orbiterChainId,
      ownerAddress,
      this.contractAddress,
      0,
      data
    )
  }

  async contractApprove(tokenAddress, contractAddress, amount) {
    const contractErc20 = new ethers.Contract(
      tokenAddress,
      Coin_ABI,
      this.provider
    )
    const allowance = await this.getAllowance(contractErc20, contractAddress)
    if (amount.gt(allowance)) {
      if (compatibleGlobalWalletConf.value.walletType === WALLETCONNECT) {
        await this.walletConnApproveERC20(
          tokenAddress,
          ethers.constants.MaxUint256,
          contractAddress
        )
      } else {
        await this.approveERC20(
          tokenAddress,
            amount,
          contractAddress
        )
      }
    }
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
      const starkAddress = ext.value.substring(2)
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
