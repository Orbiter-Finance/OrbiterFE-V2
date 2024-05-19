import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { ethers, providers } from 'ethers'
import TonWeb from 'tonweb'

import thirdapi from '../../core/actions/thirdapi'
import zkspace from '../../core/actions/zkspace'
import orbiterCore from '../../orbiterCore'
import { store } from '../../store'
import { exchangeToUsd } from '../coinbase'
import {
  getErc20Balance,
  getStarkTransferFee,
} from '../constants/starknet/helper'
import { IMXHelper } from '../immutablex/imx_helper'
import { getZkSyncProvider } from '../zksync/zkysnc_helper'
import util from '../util'
import loopring from '../../core/actions/loopring'
import { DydxHelper } from '../dydx/dydx_helper'
import Web3 from 'web3'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import {
  transferDataState,
  web3State,
  tradingPairsData,
} from '../../composition/hooks'
import { CHAIN_ID } from '../../config'
import { EBC_ABI } from '../constants/contract/contract'
import { isArgentApp, isBrowserApp, isDev } from '../env'

import tonHelper from '../ton/ton_helper'
import { zeroAddress } from 'viem'

// zk deposit
const ZK_ERC20_DEPOSIT_APPROVEL_ONL1 = 45135
const ZK_ERC20_DEPOSIT_DEPOSIT_ONL1 = 103937
const ZK_ETH_DEPOSIT_DEPOSIT_ONL1 = 62599

// zkspace deposit
const ZKSPACE_ETH_DEPOSIT_DEPOSIT_ONL1 = 160000
// https://rinkeby.etherscan.io/tx/0x6b6c2eacf0cdc5ff70b7923d6225456b8f6d26008de12beec611f7ab81eb2775
const ZKSPACE_ERC20_DEPOSIT_DEPOSIT_ONL1 = 100325
// ar deposit
const AR_ERC20_DEPOSIT_DEPOSIT_ONL1 = 218291
const AR_ETH_DEPOSIT_DEPOSIT_ONL1 = 92000

// ar withdraw
const AR_ERC20_WITHDRAW_ONAR = 801420
const AR_ERC20_WITHDRAW_ONL1 = 234552
const AR_ETH_WITHDRAW_ONAR = 666721
const AR_ETH_WITHDRAW_ONL1 = 161063

// polygon deposit
const PG_ERC20_DEPOSIT_DEPOSIT_ONL1 = 77257

// polygon withdraw
const PG_ERC20_WITHDRAW_ONPG = 32000
const PG_ERC20_WITHDRAW_ONL1 = 480000

// metis deposit
const MT_ERC20_DEPOSIT_DEPOSIT_ONL1 = 170617

// metis withdraw
const MT_ERC20_WITHDRAW_ONMT = 685768
const MT_ERC20_WITHDRAW_ONL1 = 21000

// optimistic deposit
const OP_ETH_DEPOSIT_DEPOSIT_ONL1 = 151000
const OP_ETH_WITHDRAW_ONOP_L2 = 137000
const OP_ETH_WITHDRAW_ONL1 = 820000

// https://ropsten.etherscan.io/tx/0x6182c35a69951a8443d6b7670ecccd7c8327d95faea95d7e949fc96ab6e7e0d7
const OP_ERC20_DEPOSIT_DEPOSIT_ONL1 = 77921
// optimistic withdraw
// https://kovan-optimistic.etherscan.io/tx/0x1df81e482369067c63c20f40d9ce1b8b75813f11957ff90c2fa967feef66e7a7
const OP_ERC20_WITHDRAW_ONOP_L2 = 115340
const OP_ERC20_WITHDRAW_ONL1 = 820000 // not get wanted

// loopring depost
const LP_ETH_DEPOSIT_DEPOSIT_ONL1 = 75000
// https://goerli.etherscan.io/tx/0x2571fa4a6ef7b69e143a9055877319014a770e30f22caec13bb540e0c9daee1e
const LP_ERC20_DEPOSIT_DEPOSIT_ONL1 = 91795
// immutablex deposit
// Testnet deposit contract: 0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864
const IMX_ETH_DEPOSIT_DEPOSIT_ONL1 = 126000
// https://ropsten.etherscan.io/tx/0x3e197cf0122e70aeccc7f7acbdc5418024f2e1e6161ed4f635a2c17e427f52c5
const IMX_ERC20_DEPOSIT_DEPOSIT_ONL1 = 116893
// immutablex withdraw
// Testnet withdraw contract: 0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef
const IMX_ETH_WITHDRAW_ONL1 = 510000
// https://ropsten.etherscan.io/tx/0x791dfb4ed33a12dd0e58febd7de4f00ec3ca396dedc5d7f6ac3fd5291cd706c4
const IMX_ERC20_WITHDRAW_ONL1 = 91304
// dydx deposit
// Mainnet deposit contract: 0x8e8bd01b5A9eb272CC3892a2E40E64A716aa2A40
const DYDX_ETH_DEPOSIT_DEPOSIT_ONL1 = 260000

// boba
const BOBA_TRANSFER_OUT_LIMIT = 10123935
const BOBA_TRANSFER_IN_LIMIT = 1787707

// polygon zkEVM
const PG_EVM_ETH_DEPOSIT_DEPOSIT_ONL1 = 122939
const PG_EVM_ETH_WITHDRAW_ONPG = 94708

// zksync2 deposit
const ZK2_ETH_DEPOSIT_DEPOSIT_ONL1 = 142000
const ZK2_ERC20_DEPOSIT_DEPOSIT_ONL1 = 142000
// zksync2 withdraw
const ZK2_ETH_WITHDRAW_ONZK2 = 1111693
const ZK2_ERC20_WITHDRAW_ONZK2 = 1111693 // same with eth
// starkNet
const STARKNET_ETH_DEPOSIT_ONL1 = 110000
const STARKNET_ETH_WITHDRAW_ONL1 = 60000

// wi
const BASE_ERC20_WITHDRAW_ONAR = 801420
const BASE_ERC20_WITHDRAW_ONL1 = 234552
const BASE_ETH_WITHDRAW_ONAR = 666721
const BASE_ETH_WITHDRAW_ONL1 = 161063
// depo
const BASE_ERC20_DEPOSIT_DEPOSIT_ONL1 = 48485
const BASE_ETH_DEPOSIT_DEPOSIT_ONL1 = 48485

// scroll
const SCROLL_ETH_DEPOSIT = 21000
const SCROLL_ETH_WITHDRAW = 21000

export default {
  // min ~ max
  async getTransferGasLimit(fromChainID, makerAddress, fromTokenAddress) {
    const { selectMakerConfig } = transferDataState
    if (
      fromChainID === CHAIN_ID.zksync ||
      fromChainID === CHAIN_ID.zksync_test
    ) {
      const syncHttpProvider = await getZkSyncProvider(fromChainID)
      if (!makerAddress) {
        return null
      }
      const zkTokenList =
        fromChainID === CHAIN_ID.zksync
          ? store.state.zktokenList.mainnet
          : store.state.zktokenList.rinkeby
      const tokenAddress = selectMakerConfig.fromChain.tokenAddress
      const tokenList = zkTokenList.filter(
        (item) => item.address === tokenAddress
      )
      const resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        makerAddress,
        resultToken.id
      )
      let totalFee = fee.totalFee
      // When account's nonce is zero(0), add ChangePubKey fee
      try {
        const evmAddress =
          compatibleGlobalWalletConf.value.walletPayload.walletAddress
        const addressState = await syncHttpProvider.getState(web3State.coinbase)
        if (!addressState.committed || addressState.committed?.nonce == 0) {
          const changePubKeyFee = await syncHttpProvider.getTransactionFee(
            { ChangePubKey: { onchainPubkeyAuth: false } },
            evmAddress || web3State.coinbase,
            resultToken.id
          )
          totalFee = totalFee.add(changePubKeyFee.totalFee)
        }
      } catch (err) {
        console.error('Get ChangePubKey fee failed: ', err.message)
      }
      return totalFee / 10 ** resultToken.decimals
    } else if (
      fromChainID === CHAIN_ID.zkspace ||
      fromChainID === CHAIN_ID.zkspace_test
    ) {
      let transferFee = 0
      try {
        const evmAddress =
          compatibleGlobalWalletConf.value.walletPayload.walletAddress
        transferFee = await zkspace.getZKSpaceTransferGasFee(
          fromChainID,
          evmAddress
        )
      } catch (error) {
        console.warn('getZKSpaceTransferGasFeeError =', error)
      }
      return transferFee
    } else if (
      fromChainID === CHAIN_ID.starknet ||
      fromChainID === CHAIN_ID.starknet_test
    ) {
      const realTransferAmount = this.realTransferAmount().toString()
      const starkFee = await getStarkTransferFee(
        web3State.coinbase,
        fromTokenAddress,
        makerAddress,
        realTransferAmount,
        fromChainID
      )
      return starkFee / 10 ** 18
    } else if (
      fromChainID === CHAIN_ID.loopring ||
      fromChainID === CHAIN_ID.loopring_test
    ) {
      // loopring fee can only use eth。other erc20 fee will be error
      try {
        const lpTokenInfo = await loopring.getLpTokenInfo(
          fromChainID,
          fromTokenAddress
        )
        const loopringFee = await loopring.getTransferFee(
          web3State.coinbase,
          fromChainID,
          lpTokenInfo
        )
        const decimals = lpTokenInfo ? lpTokenInfo.decimals : 18
        return Number(loopringFee) / 10 ** decimals
      } catch (error) {
        console.warn('lp getTransferFeeerror:')
      }
    } else if (
      fromChainID === CHAIN_ID.imx ||
      fromChainID === CHAIN_ID.imx_test
    ) {
      return 0
    } else if (
      util.isEthTokenAddress(fromChainID, fromTokenAddress) ||
      ((fromChainID === CHAIN_ID.zksync2 ||
        fromChainID === CHAIN_ID.zksync2_test) &&
        fromTokenAddress.toUpperCase() === `0X${'E'.repeat(40)}`)
    ) {
      if (
        fromChainID === CHAIN_ID.zkspace ||
        fromChainID === CHAIN_ID.zkspace_test
      ) {
        // zkspace can only use eth as fee
        let transferFee = 0
        try {
          transferFee = await zkspace.getZKSpaceTransferGasFee(
            fromChainID,
            web3State.coinbase
          )
        } catch (error) {
          console.warn('getZKSpaceTransferGasFeeError =', error)
        }
        return transferFee
      } else if (
        fromChainID === CHAIN_ID.loopring ||
        fromChainID === CHAIN_ID.loopring_test
      ) {
        // loopring fee can only use eth。other erc20 fee will be error
        try {
          const lpTokenInfo = await loopring.getLpTokenInfo(
            fromChainID,
            fromTokenAddress
          )
          const loopringFee = await loopring.getTransferFee(
            web3State.coinbase,
            fromChainID,
            lpTokenInfo
          )
          const decimals = lpTokenInfo ? lpTokenInfo.decimals : 18
          return Number(loopringFee) / 10 ** decimals
        } catch (error) {
          console.warn('lp getTransferFeeerror:')
        }
      }
      const rpcList = await util.getRpcList(fromChainID)
      if (!rpcList.length) {
        return 0
      }
      let estimateGas = await util.requestWeb3(fromChainID, 'estimateGas', {
        from: web3State.coinbase,
        to: makerAddress,
      })
      if (
        fromChainID === CHAIN_ID.zksync2 ||
        fromChainID === CHAIN_ID.zksync2_test
      ) {
        estimateGas = estimateGas * 1.5
      }
      let gasPrice = await util.requestWeb3(fromChainID, 'getGasPrice')
      // EIP1559
      if (
        [CHAIN_ID.base, CHAIN_ID.zora, CHAIN_ID.opbnb].includes(fromChainID)
      ) {
        const provider = new providers.JsonRpcProvider({
          url: await util.stableRpc(fromChainID),
        })
        const fee = await provider.getFeeData()
        gasPrice = fee.maxPriorityFeePerGas.toString()
        estimateGas = 55000
      }

      let gas = new BigNumber(gasPrice).multipliedBy(estimateGas)
      if (fromChainID === CHAIN_ID.op || fromChainID === CHAIN_ID.op_test) {
        const l1GasFee = await this.getOPFee(fromChainID)
        gas = gas.plus(l1GasFee)
      }
      return gas.dividedBy(10 ** 18).toString()
    }
    return 0
  },

  // gasCost-> savingValue
  async transferSpentGas(fromChainID, gasPriceMap, gasLimitMap) {
    const { selectMakerConfig } = transferDataState
    if (
      fromChainID === CHAIN_ID.zksync ||
      fromChainID === CHAIN_ID.zksync_test
    ) {
      const syncHttpProvider = await getZkSyncProvider(fromChainID)
      const zkTokenList =
        fromChainID === CHAIN_ID.zksync
          ? store.state.zktokenList.mainnet
          : store.state.zktokenList.rinkeby
      const tokenAddress = selectMakerConfig.fromChain.tokenAddress
      const tokenList = zkTokenList.filter(
        (item) => item.address === tokenAddress
      )
      const resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        selectMakerConfig.recipient,
        resultToken.id
      )
      return (fee.totalFee / 10 ** resultToken.decimals).toFixed(6)
    }
    if (
      fromChainID === CHAIN_ID.loopring ||
      fromChainID === CHAIN_ID.loopring_test
    ) {
      const tokenAddress = selectMakerConfig.fromChain.tokenAddress
      const lpTokenInfo = await loopring.getLpTokenInfo(
        fromChainID,
        tokenAddress
      )
      const loopringFee = await loopring.getTransferFee(
        web3State.coinbase,
        fromChainID,
        lpTokenInfo
      )
      // lpGasFee must use eth
      const decimals = lpTokenInfo ? lpTokenInfo.decimals : 18
      return Number(loopringFee) / 10 ** decimals
    }
    if (
      fromChainID === CHAIN_ID.zkspace ||
      fromChainID === CHAIN_ID.zkspace_test
    ) {
      let transferFee = 0
      try {
        transferFee = await zkspace.getZKSpaceTransferGasFee(
          fromChainID,
          web3State.coinbase ? web3State.coinbase : selectMakerConfig.recipient
        )
      } catch (error) {
        console.warn('getZKSpaceTransferGasFeeError =', error.message)
        return 0
      }
      return transferFee.toFixed(6)
    }
    if (
      fromChainID === CHAIN_ID.starknet ||
      fromChainID === CHAIN_ID.starknet_test
    ) {
      const realTransferAmount = this.realTransferAmount().toString()
      const fromTokenAddress = selectMakerConfig.fromChain.tokenAddress
      const starkFee = await getStarkTransferFee(
        web3State.coinbase,
        fromTokenAddress,
        selectMakerConfig.recipient,
        realTransferAmount,
        fromChainID
      )
      return (starkFee / 10 ** 18).toFixed(6)
    }

    const gasPrice = await this.getGasPrice(fromChainID.toString())
    if (!gasPrice) {
      const gas =
        ((gasPriceMap[fromChainID.toString()] || 1) *
          (gasLimitMap[fromChainID.toString()] || 21000)) /
        10 ** 9
      return gas.toFixed(6).toString()
    } else {
      let gas = gasPrice * (gasLimitMap[fromChainID.toString()] || 21000)
      if ([CHAIN_ID.op, CHAIN_ID.base, CHAIN_ID.opbnb].includes(fromChainID)) {
        const l1GasFee = await this.getOPFee(fromChainID)
        gas += l1GasFee
      }
      gas = gas / 10 ** 18
      return gas.toFixed(6).toString()
    }
  },

  transferSpentTime(fromChainID, toChainID) {
    let timeSpent = 0
    if ([CHAIN_ID.mainnet, CHAIN_ID.nova].includes(fromChainID)) {
      timeSpent = 30
    } else if (
      [
        CHAIN_ID.zksync,
        CHAIN_ID.zksync_test,
        CHAIN_ID.zkspace,
        CHAIN_ID.zkspace_test,
        CHAIN_ID.imx,
        CHAIN_ID.imx_test,
      ].includes(fromChainID)
    ) {
      timeSpent = 5
    } else if (
      [CHAIN_ID.zkspace, CHAIN_ID.zkspace_test].includes(fromChainID)
    ) {
      timeSpent = 20
    } else if (
      [CHAIN_ID.starknet, CHAIN_ID.starknet_test].includes(fromChainID)
    ) {
      timeSpent = 180
    } else {
      timeSpent = 15
    }

    if ([CHAIN_ID.mainnet, CHAIN_ID.nova].includes(toChainID)) {
      timeSpent += 30
    } else if (
      [CHAIN_ID.starknet, CHAIN_ID.starknet_test].includes(toChainID)
    ) {
      timeSpent += 180
    } else if (
      [
        CHAIN_ID.zksync,
        CHAIN_ID.zksync_test,
        CHAIN_ID.zkspace,
        CHAIN_ID.zksync_test,
        CHAIN_ID.imx,
        CHAIN_ID.imx_test,
        CHAIN_ID.dydx,
        CHAIN_ID.dydx_test,
      ].includes(toChainID)
    ) {
      timeSpent += 5
    } else if (
      [
        CHAIN_ID.linea,
        CHAIN_ID.linea_test,
        CHAIN_ID.pozkevm,
        CHAIN_ID.pozkevm_test,
      ].includes(toChainID)
    ) {
      timeSpent += 30
    } else {
      timeSpent += 15
    }

    return timeSpent + 's'
  },

  transferOrginTime(fromChainID, toChainID) {
    if (fromChainID === CHAIN_ID.mainnet) {
      if (
        [
          CHAIN_ID.imx,
          CHAIN_ID.imx_test,
          CHAIN_ID.dydx,
          CHAIN_ID.dydx_test,
        ].includes(toChainID)
      ) {
        return '~20min'
      } else if (
        [
          CHAIN_ID.bsc,
          CHAIN_ID.bsc_test,
          CHAIN_ID.base,
          CHAIN_ID.base_test,
          CHAIN_ID.opbnb,
          CHAIN_ID.opbnb_test,
          CHAIN_ID.zora,
          CHAIN_ID.zora_test,
        ].includes(toChainID)
      ) {
        return '~15min'
      } else if (
        [
          CHAIN_ID.po,
          CHAIN_ID.po_test,
          CHAIN_ID.op,
          CHAIN_ID.op_test,
          CHAIN_ID.metis,
        ].includes(toChainID)
      ) {
        return '~5min'
      } else {
        return '~10min'
      }
    }

    if (
      [
        CHAIN_ID.linea,
        CHAIN_ID.linea_test,
        CHAIN_ID.starknet,
        CHAIN_ID.starknet_test,
      ].includes(fromChainID)
    ) {
      return '~24 hours'
    } else if (
      [CHAIN_ID.pozkevm, CHAIN_ID.pozkevm_test].includes(fromChainID)
    ) {
      return '~6 hours'
    } else if ([CHAIN_ID.imx, CHAIN_ID.imx_test].includes(fromChainID)) {
      return '~5 hours'
    } else if (
      [
        CHAIN_ID.zksync,
        CHAIN_ID.zksync_test,
        CHAIN_ID.zkspace,
        CHAIN_ID.zkspace_test,
        CHAIN_ID.zksync2,
        CHAIN_ID.zksync2_test,
        CHAIN_ID.loopring,
        CHAIN_ID.loopring_test,
      ].includes(fromChainID)
    ) {
      return '~4 hours'
    } else if ([CHAIN_ID.po, CHAIN_ID.po_test].includes(fromChainID)) {
      return '~3 hours'
    } else if ([CHAIN_ID.bsc, CHAIN_ID.bsc_test].includes(fromChainID)) {
      return '~3 hours'
    } else {
      return '~7 days'
    }
  },

  async transferOrginGasUsd(fromChainID, toChainID, isErc20 = true) {
    let ethGas = 0
    let maticGas = 0
    let metisGas = 0
    let bscGas = 0
    const { selectMakerConfig } = transferDataState

    const m = CHAIN_ID.mainnet
    const g = CHAIN_ID.goerli
    // withdraw
    if (fromChainID === CHAIN_ID.ar || fromChainID === CHAIN_ID.ar_test) {
      try {
        // Ar get
        const fromGasPrice = await this.getGasPrice(fromChainID)
        // AR WithDraw
        const ARWithDrawARGas =
          fromGasPrice *
          (isErc20 ? AR_ERC20_WITHDRAW_ONAR : AR_ETH_WITHDRAW_ONAR)

        const L1ChainID = fromChainID === CHAIN_ID.ar ? m : g
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const ARWithDrawL1Gas =
          L1GasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONL1 : AR_ETH_WITHDRAW_ONL1)
        ethGas = ARWithDrawARGas + ARWithDrawL1Gas
      } catch (error) {
        throw new Error('ar withdraw error')
      }
    }
    if (fromChainID === CHAIN_ID.base || fromChainID === CHAIN_ID.base_test) {
      // base w
      const fromGasPrice = await this.getGasPrice(fromChainID)
      const l2Fee =
        fromGasPrice *
        (isErc20 ? BASE_ERC20_WITHDRAW_ONAR : BASE_ETH_WITHDRAW_ONAR)
      // l1 w
      const L1ChainID = fromChainID === CHAIN_ID.base ? m : g
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const l1Fee =
        L1GasPrice *
        (isErc20 ? BASE_ERC20_WITHDRAW_ONL1 : BASE_ETH_WITHDRAW_ONL1)
      ethGas = l2Fee + l1Fee
    }

    if (
      fromChainID === CHAIN_ID.zksync ||
      fromChainID === CHAIN_ID.zksync_test
    ) {
      try {
        // zk withdraw
        const syncHttpProvider = await getZkSyncProvider(fromChainID)
        const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
          'Withdraw',
          selectMakerConfig.recipient,
          0
        )
        ethGas += Number(zkWithDrawFee.totalFee)
      } catch (error) {
        throw new Error('zksync withdraw error')
      }
    }
    if (
      fromChainID === CHAIN_ID.starknet ||
      fromChainID === CHAIN_ID.starknet_test
    ) {
      // stark cost
      ethGas = 200000000000000
      // mainnet cost
      const L1ChainID = fromChainID === CHAIN_ID.starknet ? m : g
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const SNWithDrawL1Gas = L1GasPrice * STARKNET_ETH_WITHDRAW_ONL1
      ethGas += SNWithDrawL1Gas
    }
    if (
      fromChainID === CHAIN_ID.solana ||
      fromChainID === CHAIN_ID.solana_test
    ) {
      // solana cost
      ethGas = 15 * 10 ** 3
    }
    if (fromChainID === CHAIN_ID.ton || fromChainID === CHAIN_ID.ton_test) {
      // solana cost
      ethGas = 1 * 10 ** 8
    }
    if (fromChainID === CHAIN_ID.po || fromChainID === CHAIN_ID.po_test) {
      try {
        const fromGasPrice = await this.getGasPrice(fromChainID)

        // Polygon WithDraw
        const PGWithDrawARGas = fromGasPrice * PG_ERC20_WITHDRAW_ONPG
        maticGas += PGWithDrawARGas

        const L1ChainID = fromChainID === CHAIN_ID.po ? m : g
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const PGWithDrawL1Gas = L1GasPrice * PG_ERC20_WITHDRAW_ONL1
        ethGas += PGWithDrawL1Gas
      } catch (error) {
        throw new Error('po withdraw error')
      }
    }
    if (fromChainID === CHAIN_ID.op || fromChainID === CHAIN_ID.op_test) {
      try {
        // OP get
        const fromGasPrice = await this.getGasPrice(fromChainID)
        // op WithDraw
        const OPWithDrawOPGas =
          fromGasPrice *
          (isErc20 ? OP_ERC20_WITHDRAW_ONOP_L2 : OP_ETH_WITHDRAW_ONOP_L2)

        const L1ChainID = fromChainID === CHAIN_ID.op ? m : g

        const L1GasPrice = await this.getGasPrice(L1ChainID)

        const OPWithDrawL1Gas =
          L1GasPrice * (isErc20 ? OP_ERC20_WITHDRAW_ONL1 : OP_ETH_WITHDRAW_ONL1)

        const OPWithDrawOP_L1 = await this.getOPFee(fromChainID)

        ethGas = OPWithDrawOPGas + OPWithDrawL1Gas + Number(OPWithDrawOP_L1)

        //  let gas = gasPrice * GasLimitMap[fromChainID.toString()]
        //  if (fromChainID === 7 || fromChainID === 77) {
        //    let l1GasFee = await this.getOPFee(fromChainID)
        //    gas += l1GasFee
        //  }
        //  gas = gas / 10 ** 18
        //  return gas.toFixed(6).toString()
      } catch (error) {
        throw new Error('op withdraw error')
      }
    }
    if (fromChainID === CHAIN_ID.imx || fromChainID === CHAIN_ID.imx_test) {
      try {
        const L1ChainID = fromChainID === CHAIN_ID.imx ? m : g
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const IMXWithDrawL1Gas =
          L1GasPrice *
          (isErc20 ? IMX_ERC20_WITHDRAW_ONL1 : IMX_ETH_WITHDRAW_ONL1)
        ethGas += IMXWithDrawL1Gas
      } catch (error) {
        throw new Error('imx withdraw error')
      }
    }
    if (
      fromChainID === CHAIN_ID.loopring ||
      fromChainID === CHAIN_ID.loopring_test
    ) {
      try {
        const loopringWithDrawFee = await loopring.getWithDrawFee(
          web3State.coinbase,
          fromChainID,
          selectMakerConfig.fromChain.symbol
        )
        ethGas += Number(loopringWithDrawFee)
      } catch (error) {
        throw new Error('loopring withdraw error')
      }
    }
    if (fromChainID === CHAIN_ID.metis) {
      try {
        // MT get
        const fromGasPrice = await this.getGasPrice(fromChainID)
        // MT WithDraw
        const MTWithDrawARGas = fromGasPrice * MT_ERC20_WITHDRAW_ONMT
        metisGas += MTWithDrawARGas
        const L1ChainID = fromChainID === CHAIN_ID.metis ? m : g
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const MTWithDrawL1Gas = L1GasPrice * MT_ERC20_WITHDRAW_ONL1
        ethGas += MTWithDrawL1Gas
      } catch (error) {
        throw new Error('metis withdraw error')
      }
    }
    if (
      fromChainID === CHAIN_ID.zkspace ||
      fromChainID === CHAIN_ID.zkspace_test
    ) {
      try {
        const zkspaceWithDrawFee = await zkspace.getZKSpaceWithDrawGasFee(
          fromChainID,
          web3State.coinbase ? web3State.coinbase : selectMakerConfig.recipient
        )
        ethGas += Number(
          zkspaceWithDrawFee * 10 ** selectMakerConfig.fromChain.decimals
        )
      } catch (error) {
        console.error('zkspace withdraw error', error)
        throw new Error('zkspace withdraw error')
      }
    }
    if (fromChainID === CHAIN_ID.boba) {
      // BOBA get
      const fromGasPrice = await this.getGasPrice(fromChainID)
      ethGas = fromGasPrice * BOBA_TRANSFER_OUT_LIMIT
    }
    if (fromChainID === CHAIN_ID.bsc || fromChainID === CHAIN_ID.bsc_test) {
      try {
        const fromGasPrice = await this.getGasPrice(fromChainID)
        // BSC WithDraw
        const bscWithDrawARGas = fromGasPrice * 150000
        bscGas += bscWithDrawARGas
      } catch (error) {
        throw new Error('bsc withdraw error')
      }
    }
    if (
      fromChainID === CHAIN_ID.zksync2 ||
      fromChainID === CHAIN_ID.zksync2_test
    ) {
      // zk2 widthdraw
      const fromGasPrice = await this.getGasPrice(fromChainID)
      ethGas =
        fromGasPrice *
        (isErc20 ? ZK2_ERC20_WITHDRAW_ONZK2 : ZK2_ETH_WITHDRAW_ONZK2)
    }
    if (fromChainID === CHAIN_ID.nova) {
      try {
        // Ar get
        const fromGasPrice = await this.getGasPrice(fromChainID)
        // AR WithDraw
        const ARWithDrawARGas = fromGasPrice * (isErc20 ? 300000 : 65000)
        const L1ChainID = fromChainID === CHAIN_ID.nova ? m : g
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const WithDrawL1Gas = L1GasPrice * (isErc20 ? 160000 : 115000)
        ethGas = ARWithDrawARGas + WithDrawL1Gas
      } catch (error) {
        throw new Error('ar withdraw error')
      }
    }
    if (
      fromChainID === CHAIN_ID.pozkevm ||
      fromChainID === CHAIN_ID.pozkevm_test
    ) {
      const fromGasPrice = await this.getGasPrice(fromChainID)
      ethGas = fromGasPrice * PG_EVM_ETH_WITHDRAW_ONPG
    }

    // deposit
    if (toChainID === CHAIN_ID.ar || toChainID === CHAIN_ID.ar_test) {
      try {
        // Ar deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.ar ? m : g
        )
        const arDepositGas =
          toGasPrice *
          (isErc20
            ? AR_ERC20_DEPOSIT_DEPOSIT_ONL1
            : AR_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += arDepositGas
      } catch (error) {
        throw new Error('ar deposit error')
      }
    }
    if (toChainID === CHAIN_ID.base || toChainID === CHAIN_ID.base_test) {
      const toGasPrice = await this.getGasPrice(
        toChainID === CHAIN_ID.base ? m : g
      )
      const arDepositGas =
        toGasPrice *
        (isErc20
          ? BASE_ERC20_DEPOSIT_DEPOSIT_ONL1
          : BASE_ETH_DEPOSIT_DEPOSIT_ONL1)
      ethGas += arDepositGas
    }
    if (toChainID === CHAIN_ID.zksync || toChainID === CHAIN_ID.zksync_test) {
      try {
        // zk deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.zksync ? m : g
        )
        const zkDepositGas =
          toGasPrice *
          (isErc20
            ? ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1
            : ZK_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += zkDepositGas
      } catch (error) {
        throw new Error('zksync deposit error')
      }
    }
    if (
      toChainID === CHAIN_ID.starknet ||
      toChainID === CHAIN_ID.starknet_test
    ) {
      const L1ChainID = toChainID === CHAIN_ID.starknet ? m : g
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const SNDepositL1Gas = L1GasPrice * STARKNET_ETH_DEPOSIT_ONL1
      ethGas += SNDepositL1Gas
    }
    if (toChainID === CHAIN_ID.po || toChainID === CHAIN_ID.po_test) {
      try {
        // Polygon deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.po ? m : g
        )
        const pgDepositGas = toGasPrice * PG_ERC20_DEPOSIT_DEPOSIT_ONL1
        ethGas += pgDepositGas
      } catch (error) {
        throw new Error('po deposit error')
      }
    }
    if (toChainID === CHAIN_ID.op || toChainID === CHAIN_ID.op_test) {
      try {
        // op deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.op ? m : g
        )
        const opDepositGas =
          toGasPrice *
          (isErc20
            ? OP_ERC20_DEPOSIT_DEPOSIT_ONL1
            : OP_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += opDepositGas
      } catch (error) {
        throw new Error('op deposit error')
      }
    }
    if (toChainID === CHAIN_ID.imx || toChainID === CHAIN_ID.imx_test) {
      try {
        // imx deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.imx ? m : g
        )
        const imxDepositGas =
          toGasPrice *
          (isErc20
            ? IMX_ERC20_DEPOSIT_DEPOSIT_ONL1
            : IMX_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += imxDepositGas
      } catch (error) {
        throw new Error('imx deposit error')
      }
    }
    if (
      toChainID === CHAIN_ID.loopring ||
      toChainID === CHAIN_ID.loopring_test
    ) {
      try {
        // loopring deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.loopring ? m : g
        )
        const lpDepositGas =
          toGasPrice *
          (isErc20
            ? LP_ERC20_DEPOSIT_DEPOSIT_ONL1
            : LP_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += lpDepositGas
      } catch (error) {
        throw new Error('loopring deposit error')
      }
    }
    if (toChainID === CHAIN_ID.metis) {
      try {
        // MT deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.metis ? m : g
        )
        // MT deposit
        const mtDepositGas = toGasPrice * MT_ERC20_DEPOSIT_DEPOSIT_ONL1
        ethGas += mtDepositGas
      } catch (error) {
        throw new Error('metis deposit error')
      }
    }
    if (toChainID === CHAIN_ID.dydx || toChainID === CHAIN_ID.dydx_test) {
      try {
        // dydx deposit
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.dydx ? m : g
        )
        const dydxDepositGas = toGasPrice * DYDX_ETH_DEPOSIT_DEPOSIT_ONL1
        ethGas += dydxDepositGas
      } catch (error) {
        throw new Error('metis deposit error')
      }
    }
    if (toChainID === CHAIN_ID.zkspace || toChainID === CHAIN_ID.zkspace_test) {
      try {
        const toGasPrice = await this.getGasPrice(
          toChainID === CHAIN_ID.zkspace ? m : g
        )
        const zkspaceDepositGas =
          toGasPrice *
          (isErc20
            ? ZKSPACE_ERC20_DEPOSIT_DEPOSIT_ONL1
            : ZKSPACE_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += zkspaceDepositGas
      } catch (error) {
        throw new Error('zkspace deposit error')
      }
    }
    if (toChainID === CHAIN_ID.boba) {
      // BOBA deposit
      const toGasPrice = await this.getGasPrice(toChainID)
      const depositGas = toGasPrice * BOBA_TRANSFER_IN_LIMIT
      ethGas += depositGas
    }

    if (toChainID === CHAIN_ID.bsc || toChainID === CHAIN_ID.bsc_test) {
      try {
        // MT deposit
        const toGasPrice = await this.getGasPrice(toChainID)
        // MT deposit
        const mtDepositGas = toGasPrice * 150000
        bscGas += mtDepositGas
      } catch (error) {
        throw new Error('bsc deposit error')
      }
    }
    if (toChainID === CHAIN_ID.zksync2 || toChainID === CHAIN_ID.zksync2_test) {
      // zk2 get
      const toGasPrice = await this.getGasPrice(
        toChainID === CHAIN_ID.zksync2 ? m : g
      )
      ethGas =
        toGasPrice *
        (isErc20
          ? ZK2_ERC20_DEPOSIT_DEPOSIT_ONL1
          : ZK2_ETH_DEPOSIT_DEPOSIT_ONL1)
    }
    if (toChainID === CHAIN_ID.pozkevm || toChainID === CHAIN_ID.pozkevm_test) {
      const toGasPrice = await this.getGasPrice(toChainID)
      ethGas = toGasPrice * PG_EVM_ETH_DEPOSIT_DEPOSIT_ONL1
    }

    let usd = new BigNumber(0)
    if (ethGas > 0) {
      usd = usd.plus(
        await exchangeToUsd(new BigNumber(ethGas).dividedBy(10 ** 18))
      )
    }
    if (maticGas > 0) {
      usd = usd.plus(
        await exchangeToUsd(
          new BigNumber(maticGas).dividedBy(10 ** 18),
          'MATIC'
        )
      )
    }
    if (bscGas > 0) {
      usd = usd.plus(
        await exchangeToUsd(new BigNumber(bscGas).dividedBy(10 ** 18), 'BNB')
      )
    }
    if (metisGas > 0) {
      usd = usd.plus(
        await exchangeToUsd(
          new BigNumber(metisGas).dividedBy(10 ** 18),
          'METIS'
        )
      )
    }
    return usd.toNumber()
  },

  async getTransferBalance(
    localChainID,
    tokenAddress,
    tokenName,
    userAddress,
    isMaker = false
  ) {
    if (
      isArgentApp() &&
      !isMaker &&
      ![CHAIN_ID.starknet, CHAIN_ID.starknet_test].includes(localChainID)
    ) {
      return 0
    }
    if (!isArgentApp() && isBrowserApp()) {
      return 0
    }
    const { selectMakerConfig } = transferDataState
    if (
      localChainID === CHAIN_ID.zksync ||
      localChainID === CHAIN_ID.zksync_test
    ) {
      const req = {
        account: userAddress,
        localChainID,
        stateType: 'committed',
      }
      try {
        const balanceInfo = await thirdapi.getZKAccountInfo(req)
        if (
          !balanceInfo ||
          !balanceInfo.result ||
          !balanceInfo.result.balances
        ) {
          return 0
        }
        const balances = balanceInfo.result.balances
        return balances[tokenName] ? balances[tokenName] : 0
      } catch (error) {
        console.warn('error =', error)
        throw 'getZKBalanceError'
      }
    } else if (
      localChainID === CHAIN_ID.starknet ||
      localChainID === CHAIN_ID.starknet_test
    ) {
      const networkId = localChainID === CHAIN_ID.starknet ? 1 : 5
      let starknetAddress = web3State.starkNet.starkNetAddress
      if (!isMaker) {
        if (!starknetAddress) {
          return 0
        }
      } else {
        starknetAddress = userAddress
      }
      return await getErc20Balance(starknetAddress, tokenAddress, networkId)
    } else if (
      localChainID === CHAIN_ID.solana ||
      localChainID === CHAIN_ID.solana_test
    ) {
      try {
        const tokenAccountBalance = await util.getSolanaBalance(
          localChainID,
          userAddress,
          tokenAddress
        )

        return String(tokenAccountBalance || '0')
      } catch (error) {
        return '0'
      }
    } else if (
      localChainID === CHAIN_ID.ton ||
      localChainID === CHAIN_ID.ton_test
    ) {
      try {
        if (isMaker) {
          const tokenAccountBalance = await util.getTonBalance(
            localChainID,
            userAddress,
            tokenAddress
          )
          return String(tokenAccountBalance || '0')
        }

        const tonweb = tonHelper.tonwebProvider()

        const userTonAddress = new TonWeb.Address(userAddress)
        try {
          if (tokenAddress === zeroAddress) {
            const res = await tonweb.getBalance(userTonAddress)
            return res.toString()
          }
          const cell = new TonWeb.boc.Cell()

          cell.bits.writeAddress(userTonAddress)

          const getWalletAddressResponse = await tonweb.provider.call2(
            tokenAddress,
            'get_wallet_address',
            [['tvm.Slice', tonHelper.bytesToBase64(await cell.toBoc(false))]]
          )

          const jettonWalletAddress = tonHelper.parseAddress(
            getWalletAddressResponse
          )
          const jettonWalletData = await tonweb.provider.call2(
            jettonWalletAddress.toString(true, true, true),
            'get_wallet_data'
          )
          const balance = jettonWalletData[0]
          return balance.toString()
        } catch (e) {
          if (e.result.exit_code === -13) {
            return '0'
          } else {
            throw e
          }
        }
      } catch (error) {
        return '0'
      }
    } else if (
      localChainID === CHAIN_ID.imx ||
      localChainID === CHAIN_ID.imx_test
    ) {
      const imxHelper = new IMXHelper(localChainID)
      const balance = await imxHelper.getBalanceBySymbol(userAddress, tokenName)
      return Number(balance + '')
    } else if (
      localChainID === CHAIN_ID.loopring ||
      localChainID === CHAIN_ID.loopring_test
    ) {
      const lpTokenInfo = await loopring.getLpTokenInfo(
        localChainID,
        tokenAddress
      )
      return await loopring.getLoopringBalance(
        userAddress,
        localChainID,
        isMaker,
        lpTokenInfo
      )
    } else if (
      localChainID === CHAIN_ID.dydx ||
      localChainID === CHAIN_ID.dydx_test
    ) {
      const dydxHelper = new DydxHelper(
        localChainID,
        new Web3(compatibleGlobalWalletConf.value.walletPayload.provider),
        'MetaMask'
      )
      return await dydxHelper.getBalanceUsdc(userAddress, false) // Dydx only usdc
    } else if (
      localChainID === CHAIN_ID.zkspace ||
      localChainID === CHAIN_ID.zkspace_test
    ) {
      const zkReq = {
        account: userAddress,
        localChainID,
      }
      try {
        const balanceInfo = await zkspace.getZKspaceBalance(zkReq)
        if (!balanceInfo) {
          return 0
        }
        const zksTokenInfos =
          localChainID === CHAIN_ID.zkspace
            ? store.state.zksTokenList.mainnet
            : store.state.zksTokenList.rinkeby
        const tokenInfo = zksTokenInfos.find(
          (item) => item.address === tokenAddress
        )
        const theBalanceInfo = balanceInfo.find(
          (item) => item.id === tokenInfo.id
        )
        return theBalanceInfo
          ? theBalanceInfo.amount * 10 ** selectMakerConfig.fromChain.decimals
          : 0
      } catch (error) {
        throw new Error(`getZKSBalanceError,${error.message}`)
      }
    } else {
      return this.getBalanceByRPC(localChainID, userAddress, tokenAddress)
    }
  },
  async getBalanceByRPC(chainId, userAddress, tokenAddress) {
    if (util.isEthTokenAddress(chainId, tokenAddress)) {
      // When is ETH
      const balance = await util.requestWeb3(chainId, 'getBalance', userAddress)
      return Number(balance) || 0
    } else {
      // When is ERC20
      const tokenBalance = await util.getWeb3TokenBalance(
        chainId,
        userAddress,
        tokenAddress
      )
      return Number(tokenBalance)
    }
  },
  async getGasPrice(fromChainId) {
    if (
      fromChainId === CHAIN_ID.zksync ||
      fromChainId === CHAIN_ID.zksync_test
    ) {
      return null
    }
    const rpcList = await util.getRpcList(fromChainId)
    for (const rpc of rpcList) {
      try {
        const response = await axios.post(rpc, {
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 0,
        })
        if (response.status === 200) {
          util.setStableRpc(fromChainId, rpc, 'eth_gasPrice')
          return parseInt(response.data.result)
        }
      } catch (e) {
        util.setStableRpc(fromChainId, '', 'eth_gasPrice')
      }
    }
    util.setStableRpc(fromChainId, '', 'eth_gasPrice')
    return null
  },

  async getOPFee(fromChainID) {
    // Create an ethers provider connected to the public mainnet endpoint.
    const provider = new ethers.providers.JsonRpcProvider(
      await util.stableRpc(fromChainID)
    )
    // Create contract instances connected to the GPO and WETH contracts.
    const GasPriceOracle = getContractFactory('OVM_GasPriceOracle')
      .attach(predeploys.OVM_GasPriceOracle)
      .connect(provider)
    const ETH = getContractFactory('WETH9')
      .attach(predeploys.WETH9)
      .connect(provider)
    // Arbitrary recipient address.
    const to = transferDataState.selectMakerConfig.recipient

    // Small amount of WETH to send (in wei).
    const amount = ethers.utils.parseUnits('5', 18)
    // Compute the estimated fee in wei
    const l1FeeInWei = await GasPriceOracle.getL1Fee(
      ethers.utils.serializeTransaction({
        ...(await ETH.populateTransaction.transfer(to, amount)),
        gasPrice: await provider.getGasPrice(),
        gasLimit: 21000,
      })
    )
    return Number(l1FeeInWei)
  },

  async getTokenConvertUsd(tokenName) {
    try {
      return (await exchangeToUsd(1, tokenName)).toNumber()
    } catch (error) {
      throw error.message
    }
  },

  safeCode() {
    const { selectMakerConfig, toChainID, fromCurrency } = transferDataState

    const currency = fromCurrency || selectMakerConfig?.fromChain?.symbol

    if (currency?.toLocaleLowerCase() === 'btc') {
      const chainInfo = util.getV3ChainInfoByChainId(toChainID)
      return String(chainInfo.internalId)
    }

    let makerConfig = selectMakerConfig
    const isCheck = String(toChainID) === String(makerConfig.toChain.chainId)
    if (!isCheck) {
      makerConfig =
        tradingPairsData.data.filter(
          (item) =>
            String(item.pairId).toLocaleLowerCase() ===
              String(makerConfig.pairId).toLocaleLowerCase() &&
            String(item.recipient).toLocaleLowerCase() ===
              String(makerConfig.recipient).toLocaleLowerCase()
        )[0] || selectMakerConfig
    }

    const internalId =
      String(makerConfig.toChain.id).length < 2
        ? '0' + makerConfig.toChain.id
        : makerConfig.toChain.id
    const dealerId =
      String(makerConfig.dealerId || 0).length < 2
        ? '0' + makerConfig.dealerId
        : makerConfig.dealerId
    const chainInfo = util.getV3ChainInfoByChainId(toChainID)
    return makerConfig.ebcId
      ? dealerId + makerConfig.ebcId + internalId
      : 9000 + Number(chainInfo.internalId) + ''
  },

  getTradingFee() {
    const { selectMakerConfig } = transferDataState
    return new BigNumber(selectMakerConfig.tradingFee).minus(
      new BigNumber(this.discount())
    )
  },

  getTransferTValue() {
    const { selectMakerConfig, transferValue, fromChainID } = transferDataState
    const rAmount = new BigNumber(transferValue)
      .plus(this.getTradingFee())
      .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
    const rAmountValue = rAmount.toFixed()
    const p_text = this.safeCode()
    return orbiterCore.getTAmountFromRAmount(fromChainID, rAmountValue, p_text)
  },
  async calEBCValue() {
    const { selectMakerConfig, fromChainID, toChainID } = transferDataState
    const web3 = await util.stableWeb3(isDev() ? 5 : 1)
    const provider = new ethers.providers.Web3Provider(web3.currentProvider)
    util.log('ebcAddress', selectMakerConfig.ebcAddress)
    const contractInstance = new ethers.Contract(
      selectMakerConfig.ebcAddress,
      EBC_ABI,
      provider
    )
    const ro = [
      fromChainID,
      toChainID,
      selectMakerConfig.status,
      web3.utils.hexToNumberString(selectMakerConfig.fromChain.tokenAddress),
      web3.utils.hexToNumberString(selectMakerConfig.toChain.tokenAddress),
      selectMakerConfig.fromChain._minPrice,
      selectMakerConfig.fromChain._maxPrice,
      selectMakerConfig._withholdingFee,
      selectMakerConfig._tradeFee,
      selectMakerConfig.spentTime,
      selectMakerConfig._compensationRatio,
    ]
    util.log(
      'getResponseIntent params',
      'amount',
      this.getTransferTValue().tAmount,
      'sourceChainId',
      fromChainID,
      'destChainId',
      toChainID,
      'status',
      selectMakerConfig.status,
      'sourceToken',
      web3.utils.hexToNumberString(selectMakerConfig.fromChain.tokenAddress),
      'destToken',
      web3.utils.hexToNumberString(selectMakerConfig.toChain.tokenAddress),
      'minPrice',
      selectMakerConfig.fromChain._minPrice,
      'maxPrice',
      selectMakerConfig.fromChain._maxPrice,
      'withholdingFee',
      selectMakerConfig._withholdingFee,
      'tradingFee',
      selectMakerConfig._tradeFee,
      'responseTime',
      selectMakerConfig.spentTime,
      'compensationRatio',
      selectMakerConfig._compensationRatio
    )
    return await contractInstance.getResponseIntent(
      this.getTransferTValue().tAmount,
      ro
    )
  },
  realTransferAmount() {
    const { selectMakerConfig, transferValue, fromChainID } = transferDataState
    const userValue = new BigNumber(transferValue).plus(this.getTradingFee())

    if (!fromChainID || !userValue) {
      return 0
    }
    const rAmount = new BigNumber(userValue).multipliedBy(
      new BigNumber(10 ** selectMakerConfig.fromChain.decimals)
    )
    const rAmountValue = rAmount.toFixed()
    const p_text = this.safeCode()
    const tValue = orbiterCore.getTAmountFromRAmount(
      fromChainID,
      rAmountValue,
      p_text
    )
    if (!tValue.state) {
      return userValue
    } else {
      return new BigNumber(tValue.tAmount).dividedBy(
        new BigNumber(10 ** selectMakerConfig.fromChain.decimals)
      )
    }
  },
  max() {
    const { selectMakerConfig, transferValue } = transferDataState

    const { tieredFee } = selectMakerConfig

    const tieredFeeList = tieredFee
      ?.filter((item) => {
        const [min, max] = item?.range
        return (
          Number(min) <= Number(transferValue) &&
          Number(max) >= Number(transferValue)
        )
      })
      ?.map((item) => item?.discount || '0')

    const tieredFeeMax = Math.max(...(tieredFeeList || []), 0)
    return tieredFeeMax
  },
  discount() {
    const { selectMakerConfig } = transferDataState

    const withholdingFee = +(selectMakerConfig.tradingFee || 0)

    const tieredFeeMax = this.max()
    let discount = '0'
    if (tieredFeeMax) {
      const w = ethers.utils.parseEther(withholdingFee + '')
      discount = ethers.utils.formatEther(
        w
          .mul(ethers.utils.parseEther(tieredFeeMax / 100 + ''))
          .div(ethers.utils.parseEther('1'))
      )
    }

    return discount
  },
}
