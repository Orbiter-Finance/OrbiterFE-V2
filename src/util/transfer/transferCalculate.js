import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import * as zksync from 'zksync'
import env from '../../../env'
import thirdapi from '../../core/actions/thirdapi'
import zkspace from '../../core/actions/zkspace'
import orbiterCore from '../../orbiterCore'
import { store } from '../../store'
import { exchangeToUsd } from '../coinbase'
import { getLocalCoinContract } from '../constants/contract/getContract'
import { localWeb3 } from '../constants/contract/localWeb3'
import {
  getErc20Balance,
  getNetworkIdByChainId,
  getStarkMakerAddress,
  getStarkTransferFee,
} from '../constants/starknet/helper'
import { IMXHelper } from '../immutablex/imx_helper'
import util from '../util'
import loopring from '../../core/actions/loopring'
import { DydxHelper } from '../dydx/dydx_helper'
import Web3 from 'web3'

// zk deposit
const ZK_ERC20_DEPOSIT_APPROVEL_ONL1 = 45135
const ZK_ERC20_DEPOSIT_DEPOSIT_ONL1 = 103937
const ZK_ETH_DEPOSIT_DEPOSIT_ONL1 = 62599

// zkspace deposit
const ZKSPACE_ETH_DEPOSIT_DEPOSIT_ONL1 = 160000

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

//optimistic deposit
const OP_ETH_DEPOSIT_DEPOSIT_ONL1 = 151000

// optimistic withdraw
const OP_ETH_WITHDRAW_ONOP_L2 = 137000
const OP_ETH_WITHDRAW_ONL1 = 820000

// loopring depost
const LP_ETH_DEPOSIT_DEPOSIT_ONL1 = 75000

// immutablex deposit
// Testnet deposit contract: 0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864
const IMX_ETH_DEPOSIT_DEPOSIT_ONL1 = 126000

// immutablex withdraw
// Testnet withdraw contract: 0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef
const IMX_ETH_WITHDRAW_ONL1 = 510000

// dydx deposit
// Mainnet deposit contract: 0x8e8bd01b5A9eb272CC3892a2E40E64A716aa2A40
const DYDX_ETH_DEPOSIT_DEPOSIT_ONL1 = 260000

// boba
const BOBA_TRANSFER_OUT_LIMIT = 10123935
const BOBA_TRANSFER_IN_LIMIT = 1787707

// starkNet
const STARKNET_ETH_DEPOSIT_ONL1 = 110000
const STARKNET_ETH_WITHDRAW_ONL1 = 60000

const LocalNetWorks = env.supportLocalNetWorksIDs
export default {
  // min ~ max
  async getTransferGasLimit(fromChainID, makerAddress, fromTokenAddress) {
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let selectMakerInfo = store.getters.realSelectMakerInfo
      if (!makerAddress) {
        return null
      }
      let zkTokenList =
        fromChainID === 3
          ? store.state.zktokenList.mainnet
          : store.state.zktokenList.rinkeby
      let tokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      var tokenList = zkTokenList.filter(
        (item) => item.address === tokenAddress
      )
      let resultToken = tokenList.length > 0 ? tokenList[0] : null
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
        const addressState = await syncHttpProvider.getState(
          store.state.web3.coinbase
        )
        if (!addressState.committed || addressState.committed?.nonce == 0) {
          const changePubKeyFee = await syncHttpProvider.getTransactionFee(
            { ChangePubKey: { onchainPubkeyAuth: false } },
            store.state.web3.coinbase,
            resultToken.id
          )
          totalFee = totalFee.add(changePubKeyFee.totalFee)
        }
      } catch (err) {
        console.error('Get ChangePubKey fee failed: ', err.message)
      }
      return totalFee / 10 ** resultToken.decimals
    } else if (fromChainID === 12 || fromChainID === 512) {
      let transferFee = 0
      try {
        transferFee = await zkspace.getZKTransferGasFee(
          fromChainID,
          store.state.web3.coinbase
        )
      } catch (error) {
        console.warn('getZKTransferGasFeeError =', error)
      }
      return transferFee
    } else if (fromChainID == 4 || fromChainID == 44) {
      let realTransferAmount = this.realTransferAmount().toString()
      let starkFee = await getStarkTransferFee(
        store.state.web3.coinbase,
        fromTokenAddress,
        makerAddress,
        realTransferAmount,
        fromChainID
      )
      return starkFee / 10 ** 18
    } else if (util.isEthTokenAddress(fromTokenAddress)) {
      if (fromChainID == 9 || fromChainID == 99) {
        let loopringFee = await loopring.getTransferFee(
          store.state.web3.coinbase,
          fromChainID
        )
        return loopringFee / 10 ** 18
      }
      const web3 = localWeb3(fromChainID)
      if (web3) {
        const estimateGas = await web3.eth.estimateGas({
          from: store.state.web3.coinbase,
          to: makerAddress,
        })
        const gasPrice = await web3.eth.getGasPrice()
        let gas = new BigNumber(gasPrice).multipliedBy(estimateGas)
        if (fromChainID === 7 || fromChainID === 77) {
          let l1GasFee = await this.getOPFee(fromChainID)
          gas = gas.plus(l1GasFee)
        }
        return gas.dividedBy(10 ** 18).toString()
      }
    }
    return 0
  },

  // gasCost-> savingValue
  async transferSpentGas(fromChainID) {
    const GasPriceMap = {
      1: 100,
      2: 1.9,
      3: 100,
      4: 100,
      5: 1,
      6: 60,
      7: 0.001,
      8: 1.7,
      9: 100,
      10: 1,
      11: 1,
      22: 0.02,
      33: 100,
      44: 50,
      66: 60,
      77: 0.001,
      88: 1.7,
      99: 1,
      510: 1,
      511: 1,
      13: 1,
      513: 1,
    }
    const GasLimitMap = {
      1: 35000,
      2: 810000,
      3: 100,
      4: 35000,
      5: 35000,
      6: 1500,
      7: 21000,
      8: 51000,
      9: 75000,
      10: 28000,
      11: 100000,
      13: 646496,
      22: 810000,
      33: 100,
      44: 35000,
      66: 1500,
      77: 21000,
      88: 51000,
      99: 75000,
      510: 16000,
      511: 100000,
      513: 646496,
    }
    const GasTokenMap = {
      1: 'ETH',
      2: 'AETH',
      3: 'ETH',
      4: 'ETH',
      5: 'ETH',
      6: 'MATIC',
      7: 'ETH',
      8: 'ETH',
      11: 'ETH',
      9: 'ETH',
      10: 'METIS',
      22: 'AETH',
      33: 'ETH',
      44: 'ETH',
      66: 'MATIC',
      77: 'ETH',
      88: 'ETH',
      99: 'ETH',
      510: 'METIS',
      511: 'ETH',
      13: 'ETH',
      513: 'ETH',
    }
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let selectMakerInfo = store.getters.realSelectMakerInfo
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (!transferAddress) {
        return null
      }
      let zkTokenList =
        fromChainID === 3
          ? store.state.zktokenList.mainnet
          : store.state.zktokenList.rinkeby
      let tokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      var tokenList = zkTokenList.filter(
        (item) => item.address === tokenAddress
      )
      let resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        transferAddress,
        resultToken.id
      )
      return (fee.totalFee / 10 ** resultToken.decimals).toFixed(6)
    }
    if (fromChainID == 9 || fromChainID == 99) {
      let loopringFee = await loopring.getTransferFee(
        store.state.web3.coinbase,
        fromChainID
      )
      return (loopringFee / 10 ** 18).toFixed(6)
    }
    if (fromChainID === 12 || fromChainID === 512) {
      let selectMakerInfo = store.getters.realSelectMakerInfo
      let transferFee = 0
      try {
        transferFee = await zkspace.getZKTransferGasFee(
          fromChainID,
          store.state.web3.coinbase
            ? store.state.web3.coinbase
            : selectMakerInfo.makerAddress
        )
      } catch (error) {
        console.warn('getZKSpaceTransferGasFeeError =', error)
        return 0
      }
      return transferFee.toFixed(6)
    }
    if (fromChainID == 4 || fromChainID == 44) {
      let realTransferAmount = this.realTransferAmount().toString()
      let selectMakerInfo = store.getters.realSelectMakerInfo
      let makerAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      let fromTokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      let starkFee = await getStarkTransferFee(
        store.state.web3.coinbase,
        fromTokenAddress,
        makerAddress,
        realTransferAmount,
        fromChainID
      )
      return (starkFee / 10 ** 18).toFixed(6)
    }
    if (
      GasPriceMap[fromChainID.toString()] &&
      GasLimitMap[fromChainID.toString()] &&
      GasTokenMap[fromChainID.toString()]
    ) {
      let gasPrice = await this.getGasPrice(fromChainID.toString())
      if (!gasPrice) {
        let gas =
          (GasPriceMap[fromChainID.toString()] *
            GasLimitMap[fromChainID.toString()]) /
          10 ** 9
        return gas.toFixed(6).toString()
      } else {
        let gas = gasPrice * GasLimitMap[fromChainID.toString()]
        if (fromChainID === 7 || fromChainID === 77) {
          let l1GasFee = await this.getOPFee(fromChainID)
          gas += l1GasFee
        }
        gas = gas / 10 ** 18
        return gas.toFixed(6).toString()
      }
    } else {
      return null
    }
  },

  transferSpentTime(fromChainID, toChainID) {
    let timeSpent = 0
    if (fromChainID === 1 || fromChainID === 4 || fromChainID === 5) {
      timeSpent = 30
    }
    if (fromChainID === 2 || fromChainID === 22) {
      timeSpent = 15
    }
    if (fromChainID === 10 || fromChainID === 510) {
      timeSpent = 15
    }
    if (
      fromChainID === 3 ||
      fromChainID === 33 ||
      fromChainID === 12 ||
      fromChainID === 512
    ) {
      timeSpent = 5
    }
    if (fromChainID === 6 || fromChainID === 66) {
      timeSpent = 15
    }
    if (fromChainID === 7 || fromChainID === 77) {
      timeSpent = 15
    }
    if (fromChainID === 8 || fromChainID === 88) {
      timeSpent = 5
    }
    if (fromChainID === 9 || fromChainID === 99) {
      timeSpent = 15
    }
    if (fromChainID === 13 || fromChainID === 513) {
      timeSpent = 20
    }
    if (fromChainID === 4 || fromChainID === 44) {
      timeSpent = 180
    }
    if (toChainID === 4 || toChainID === 44) {
      timeSpent = 180
    }
    if (toChainID === 1 || toChainID === 5) {
      timeSpent += 30
    }
    if (toChainID === 2 || toChainID === 22) {
      timeSpent += 15
    }
    if (
      toChainID === 3 ||
      toChainID === 33 ||
      toChainID === 12 ||
      toChainID === 512
    ) {
      timeSpent += 5
    }
    if (toChainID === 6 || toChainID === 66) {
      timeSpent += 15
    }
    if (toChainID === 7 || toChainID === 77) {
      timeSpent += 15
    }
    if (toChainID === 8 || toChainID === 88) {
      timeSpent += 5
    }
    if (toChainID === 9 || toChainID === 99) {
      timeSpent += 15
    }
    if (toChainID === 10 || toChainID === 510) {
      timeSpent += 15
    }
    if (toChainID === 11 || toChainID === 511) {
      timeSpent += 5
    }

    if (toChainID === 13 || toChainID === 513) {
      timeSpent += 20
    }
    let timeSpentStr = timeSpent + 's'
    return timeSpentStr
  },

  transferOrginTime(fromChainID, toChainID) {
    if (fromChainID === 2 || fromChainID === 22) {
      return '~7 days'
    }
    if (fromChainID === 4 || fromChainID === 44) {
      return '~24 hours'
    }
    if (
      fromChainID === 3 ||
      fromChainID === 33 ||
      fromChainID === 12 ||
      fromChainID === 512
    ) {
      return '~4 hours'
    }
    // https://docs.polygon.technology/docs/develop/ethereum-polygon/getting-started/
    if (fromChainID === 6 || fromChainID === 66) {
      return '~3 hours'
    }
    if (fromChainID === 7 || fromChainID === 77) {
      return '~7 days'
    }
    if (fromChainID === 8 || fromChainID === 88) {
      return '~5 hours'
    }
    if (fromChainID === 9 || fromChainID === 99) {
      return '~4 hours'
    }
    if (fromChainID === 10 || fromChainID === 510) {
      return '~7 days'
    }

    if (fromChainID === 1 || fromChainID === 5) {
      if (toChainID === 2 || toChainID === 22) {
        //  eth ->  ar
        return '~10min'
      }
      if (toChainID === 4 || toChainID === 44) {
        //  eth ->  ar
        return '~10min'
      }
      if (
        toChainID === 3 ||
        toChainID === 33 ||
        toChainID === 12 ||
        toChainID === 512
      ) {
        // eth -> zk
        return '~10min'
      }
      if (toChainID === 6 || toChainID === 66) {
        // eth -> polygon
        return '~5min'
      }
      if (toChainID === 7 || toChainID === 77) {
        // eth -> optimistic
        return '~5min'
      }
      if (toChainID === 8 || toChainID === 88) {
        // eth -> immutablex
        return '~20min'
      }
      if (toChainID === 9 || toChainID === 99) {
        return '~10min'
      }
      if (toChainID === 10 || toChainID === 510) {
        // eth -> metis
        return '~5min'
      }
      if (toChainID === 11 || toChainID === 511) {
        return '~20min'
      }
    }
    if (fromChainID === 13 || fromChainID === 513) {
      return '~7 days'
    }
    if (toChainID === 13 || toChainID === 513) {
      return '~10min'
    }
  },

  transferSavingTime(fromChainID, toChainID) {
    if (fromChainID === 2 || fromChainID === 22) {
      return ' 7 days'
    }
    if (
      fromChainID === 3 ||
      fromChainID === 33 ||
      fromChainID === 12 ||
      fromChainID === 512
    ) {
      return ' 4 hours'
    }
    if (fromChainID === 6 || fromChainID === 66) {
      return ' 3 hours'
    }
    if (fromChainID === 7 || fromChainID === 77) {
      return ' 7 days'
    }
    if (fromChainID === 8 || fromChainID === 88) {
      return ' 4 hours'
    }
    if (fromChainID === 9 || fromChainID === 99) {
      return ' 4 hours'
    }
    if (fromChainID === 10 || fromChainID === 510) {
      return ' 7 days'
    }
    if (fromChainID === 4 || fromChainID === 44) {
      return ' 24 hours'
    }
    if (fromChainID === 1 || fromChainID === 5) {
      if (toChainID === 2 || toChainID === 22) {
        //  eth ->  ar
        return ' 9.25min'
      }
      if (
        toChainID === 3 ||
        toChainID === 33 ||
        toChainID === 12 ||
        toChainID === 512
      ) {
        // eth -> zk
        return ' 9.5min'
      }
      if (toChainID === 6 || toChainID === 66) {
        // eth -> polygon
        return ' 4.25min'
      }
      if (toChainID === 7 || toChainID === 77) {
        // eth -> optimistic
        return ' 9.25min'
      }
      if (toChainID === 8 || toChainID === 88) {
        // eth -> immutablex
        return ' 19.95min'
      }
      if (toChainID === 9 || toChainID === 99) {
        // eth -> loopring
        return ' 9.25min'
      }
      if (toChainID === 10 || toChainID === 510) {
        // eth -> metis
        return ' 4.25min'
      }
      if (toChainID === 11 || toChainID === 511) {
        // eth -> dydx
        return ' 19.95min'
      }
      if (toChainID === 13 || toChainID === 513) {
        // eth -> dydx
        return ' 10 min'
      }
      if (toChainID === 4 || toChainID === 44) {
        return ' 7 min'
      }
    }
    if (fromChainID === 13 || fromChainID === 513) {
      return ' 7 days'
    }
  },
  /**
   * @deprecated Move to transferOrginGasUsd
   */
  async transferOrginGas(fromChainID, toChainID, isErc20 = true) {
    let resultGas = 0
    let selectMakerInfo = store.getters.realSelectMakerInfo
    if (fromChainID === 2 || fromChainID === 22) {
      // Ar get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // AR WithDraw
      let ARWithDrawARGas =
        fromGasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONAR : AR_ETH_WITHDRAW_ONAR)

      let L1ChainID = fromChainID === 2 ? 1 : 5
      let L1GasPrice = await this.getGasPrice(L1ChainID)
      let ARWithDrawL1Gas =
        L1GasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONL1 : AR_ETH_WITHDRAW_ONL1)
      resultGas = ARWithDrawARGas + ARWithDrawL1Gas
    }
    if (fromChainID === 3 || fromChainID === 33) {
      // zk withdraw
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (transferAddress) {
        const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
          'Withdraw',
          transferAddress,
          0
        )
        resultGas += Number(zkWithDrawFee.totalFee)
      }
    }
    if (toChainID === 2 || toChainID === 22) {
      // Ar deposit
      let toGasPrice = await this.getGasPrice(toChainID === 2 ? 1 : 5)
      let arDepositGas =
        toGasPrice *
        (isErc20 ? AR_ERC20_DEPOSIT_DEPOSIT_ONL1 : AR_ETH_DEPOSIT_DEPOSIT_ONL1)
      resultGas += arDepositGas
    }
    if (toChainID === 3 || toChainID === 33) {
      // zk deposit
      let toGasPrice = await this.getGasPrice(toChainID === 3 ? 1 : 5)
      let zkDepositGas =
        toGasPrice *
        (isErc20
          ? ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1
          : ZK_ETH_DEPOSIT_DEPOSIT_ONL1)
      resultGas += zkDepositGas
    }
    return resultGas / 10 ** 18
  },

  async transferOrginGasUsd(fromChainID, toChainID, isErc20 = true) {
    let ethGas = 0
    let maticGas = 0
    let metisGas = 0
    const selectMakerInfo = store.getters.realSelectMakerInfo

    // withdraw
    if (fromChainID === 2 || fromChainID === 22) {
      // Ar get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // AR WithDraw
      let ARWithDrawARGas =
        fromGasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONAR : AR_ETH_WITHDRAW_ONAR)

      let L1ChainID = fromChainID === 2 ? 1 : 5
      let L1GasPrice = await this.getGasPrice(L1ChainID)
      let ARWithDrawL1Gas =
        L1GasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONL1 : AR_ETH_WITHDRAW_ONL1)
      ethGas = ARWithDrawARGas + ARWithDrawL1Gas
    }
    if (fromChainID === 3 || fromChainID === 33) {
      // zk withdraw
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (transferAddress) {
        const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
          'Withdraw',
          transferAddress,
          0
        )
        ethGas += Number(zkWithDrawFee.totalFee)
      }
    }
    if (fromChainID === 4 || fromChainID === 44) {
      // stark cost
      ethGas = 200000000000000
      // mainnet cost
      const L1ChainID = fromChainID == 4 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const SNWithDrawL1Gas = L1GasPrice * STARKNET_ETH_WITHDRAW_ONL1
      ethGas += SNWithDrawL1Gas
    }
    if (fromChainID === 6 || fromChainID === 66) {
      const fromGasPrice = await this.getGasPrice(fromChainID)

      // Polygon WithDraw
      const PGWithDrawARGas = fromGasPrice * PG_ERC20_WITHDRAW_ONPG
      maticGas += PGWithDrawARGas

      const L1ChainID = fromChainID === 6 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const PGWithDrawL1Gas = L1GasPrice * PG_ERC20_WITHDRAW_ONL1
      ethGas += PGWithDrawL1Gas
    }
    if (fromChainID === 7 || fromChainID === 77) {
      // OP get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // op WithDraw
      let OPWithDrawOPGas = fromGasPrice * OP_ETH_WITHDRAW_ONOP_L2

      let L1ChainID = fromChainID === 7 ? 1 : 5

      let L1GasPrice = await this.getGasPrice(L1ChainID)

      let OPWithDrawL1Gas = L1GasPrice * OP_ETH_WITHDRAW_ONL1

      let OPWithDrawOP_L1 = await this.getOPFee(fromChainID)

      ethGas = OPWithDrawOPGas + OPWithDrawL1Gas + Number(OPWithDrawOP_L1)

      //  let gas = gasPrice * GasLimitMap[fromChainID.toString()]
      //  if (fromChainID === 7 || fromChainID === 77) {
      //    let l1GasFee = await this.getOPFee(fromChainID)
      //    gas += l1GasFee
      //  }
      //  gas = gas / 10 ** 18
      //  return gas.toFixed(6).toString()
    }
    if (fromChainID === 8 || fromChainID === 88) {
      const L1ChainID = fromChainID === 8 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const IMXWithDrawL1Gas = L1GasPrice * IMX_ETH_WITHDRAW_ONL1
      ethGas += IMXWithDrawL1Gas
    }
    if (fromChainID === 9 || fromChainID === 99) {
      let loopringWithDrawFee = await loopring.getWithDrawFee(
        store.state.web3.coinbase,
        fromChainID
      )
      ethGas += Number(loopringWithDrawFee)
    }
    if (fromChainID === 10 || fromChainID === 510) {
      // MT get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // MT WithDraw
      const MTWithDrawARGas = fromGasPrice * MT_ERC20_WITHDRAW_ONMT
      metisGas += MTWithDrawARGas
      const L1ChainID = fromChainID === 10 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const MTWithDrawL1Gas = L1GasPrice * MT_ERC20_WITHDRAW_ONL1
      ethGas += MTWithDrawL1Gas
    }
    if (fromChainID === 12 || fromChainID === 512) {
      let zkspaceWithDrawFee = await zkspace.getZKSpaceWithDrawGasFee(
        fromChainID,
        store.state.web3.coinbase
          ? store.state.web3.coinbase
          : selectMakerInfo.makerAddress
      )
      ethGas += Number(zkspaceWithDrawFee * 10 ** selectMakerInfo.precision)
    }
    if (fromChainID === 13 || fromChainID === 513) {
      // BOBA get
      const fromGasPrice = await this.getGasPrice(fromChainID)
      ethGas = fromGasPrice * BOBA_TRANSFER_OUT_LIMIT
    }
    // deposit
    if (toChainID === 2 || toChainID === 22) {
      // Ar deposit
      const toGasPrice = await this.getGasPrice(toChainID === 2 ? 1 : 5)
      const arDepositGas =
        toGasPrice *
        (isErc20 ? AR_ERC20_DEPOSIT_DEPOSIT_ONL1 : AR_ETH_DEPOSIT_DEPOSIT_ONL1)
      ethGas += arDepositGas
    }
    if (toChainID === 3 || toChainID === 33) {
      // zk deposit
      const toGasPrice = await this.getGasPrice(toChainID === 3 ? 1 : 5)
      const zkDepositGas =
        toGasPrice *
        (isErc20
          ? ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1
          : ZK_ETH_DEPOSIT_DEPOSIT_ONL1)
      ethGas += zkDepositGas
    }
    if (toChainID === 4 || toChainID === 44) {
      const L1ChainID = toChainID == 4 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const SNDepositL1Gas = L1GasPrice * STARKNET_ETH_DEPOSIT_ONL1
      ethGas += SNDepositL1Gas
    }
    if (toChainID === 6 || toChainID === 66) {
      // Polygon deposit
      const toGasPrice = await this.getGasPrice(toChainID === 6 ? 1 : 5)
      const pgDepositGas = toGasPrice * PG_ERC20_DEPOSIT_DEPOSIT_ONL1
      ethGas += pgDepositGas
    }
    if (toChainID === 7 || toChainID === 77) {
      // op deposit
      let toGasPrice = await this.getGasPrice(toChainID === 7 ? 1 : 5)
      let opDepositGas = toGasPrice * OP_ETH_DEPOSIT_DEPOSIT_ONL1
      ethGas += opDepositGas
    }
    if (toChainID === 8 || toChainID === 88) {
      // imx deposit
      const toGasPrice = await this.getGasPrice(toChainID === 8 ? 1 : 5)
      const imxDepositGas = toGasPrice * IMX_ETH_DEPOSIT_DEPOSIT_ONL1
      ethGas += imxDepositGas
    }
    if (toChainID === 9 || toChainID === 99) {
      //loopring deposit
      let toGasPrice = await this.getGasPrice(toChainID === 9 ? 1 : 5)
      let lpDepositGas = toGasPrice * LP_ETH_DEPOSIT_DEPOSIT_ONL1
      ethGas += lpDepositGas
    }
    if (toChainID === 10 || toChainID === 510) {
      // MT deposit
      let toGasPrice = await this.getGasPrice(toChainID === 10 ? 1 : 5)
      // MT deposit
      const mtDepositGas = toGasPrice * MT_ERC20_DEPOSIT_DEPOSIT_ONL1
      ethGas += mtDepositGas
    }
    if (toChainID === 11 || toChainID === 511) {
      // dydx deposit
      const toGasPrice = await this.getGasPrice(toChainID === 11 ? 1 : 5)
      const dydxDepositGas = toGasPrice * DYDX_ETH_DEPOSIT_DEPOSIT_ONL1
      ethGas += dydxDepositGas
    }
    if (toChainID === 12 || toChainID === 512) {
      let toGasPrice = await this.getGasPrice(toChainID === 12 ? 1 : 5)
      let zkspaceDepositGas = toGasPrice * ZKSPACE_ETH_DEPOSIT_DEPOSIT_ONL1
      ethGas += zkspaceDepositGas
    }

    if (toChainID === 13 || toChainID === 513) {
      // BOBA deposit
      let toGasPrice = await this.getGasPrice(toChainID)
      const depositGas = toGasPrice * BOBA_TRANSFER_IN_LIMIT
      ethGas += depositGas
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
    if (localChainID === 3 || localChainID === 33) {
      var req = {
        account: userAddress,
        localChainID: localChainID,
        stateType: 'committed',
      }
      try {
        let balanceInfo = await thirdapi.getZKAccountInfo(req)
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
    } else if (localChainID === 4 || localChainID === 44) {
      const networkId = getNetworkIdByChainId(localChainID)
      let starknetAddress = store.state.web3.starkNet.starkNetAddress
      if (!isMaker) {
        if (!starknetAddress) {
          return 0
        }
      } else {
        starknetAddress = getStarkMakerAddress(userAddress, localChainID)
      }
      const balance = await getErc20Balance(
        starknetAddress,
        tokenAddress,
        networkId
      )

      return balance
    } else if (localChainID === 8 || localChainID === 88) {
      const imxHelper = new IMXHelper(localChainID)
      const balance = await imxHelper.getBalanceBySymbol(userAddress, tokenName)
      return Number(balance + '')
    } else if (localChainID === 9 || localChainID === 99) {
      // https://api3.loopring.io/api/v3/user/balances?accountId=1&tokens=0,1
      const balance = await loopring.getLoopringBalance(
        userAddress,
        localChainID,
        isMaker
      )
      return balance
    } else if (localChainID === 11 || localChainID === 511) {
      const dydxHelper = new DydxHelper(
        localChainID,
        new Web3(window.ethereum),
        'MetaMask'
      )
      const balance = await dydxHelper.getBalanceUsdc(userAddress, false) // Dydx only usdc
      return balance
    } else if (localChainID === 12 || localChainID === 512) {
      var zkReq = {
        account: userAddress,
        localChainID: localChainID,
      }
      try {
        let selectMakerInfo = store.getters.realSelectMakerInfo
        let balanceInfo = await zkspace.getZKspaceBalance(zkReq)
        if (
          !balanceInfo ||
          !balanceInfo.length ||
          balanceInfo.findIndex((item) => item.id == 0) == -1
        ) {
          return 0
        }
        let defaultIndex = balanceInfo.findIndex((item) => item.id == 0)
        if (defaultIndex < 0) {
          return 0
        }

        const balances =
          balanceInfo[defaultIndex].amount * 10 ** selectMakerInfo.precision
        return balances
      } catch (error) {
        console.warn('error =', error)
        throw 'getZKBalanceError'
      }
    } else {
      let balance = 0
      if (util.isEthTokenAddress(tokenAddress)) {
        // When is ETH
        const web3 = localWeb3(localChainID)
        balance = Number(await web3.eth.getBalance(userAddress)) || 0
      } else {
        // When is ERC20
        var tokenContract = getLocalCoinContract(localChainID, tokenAddress, 0)
        if (!tokenContract) {
          throw 'getBalance_tokenContractError'
        }
        balance = await tokenContract.methods.balanceOf(userAddress).call()
      }
      return balance
    }
  },

  async getGasPrice(fromChainID) {
    if (fromChainID === 33 || fromChainID === 3) {
      return null
    }
    if (LocalNetWorks.indexOf(fromChainID.toString()) > -1) {
      if (!env.localProvider[fromChainID]) {
        return null
      }

      let response = await axios.post(env.localProvider[fromChainID], {
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 0,
      })
      if (
        response.status === 200 &&
        (response.statusText === 'OK' || response.statusText === '')
      ) {
        return parseInt(response.data.result)
      } else {
        return null
      }
    } else {
      return null
    }
  },

  async getOPFee(fromChainID) {
    // Create an ethers provider connected to the public mainnet endpoint.
    const provider = new ethers.providers.JsonRpcProvider(
      env.localProvider[fromChainID]
    )
    // Create contract instances connected to the GPO and WETH contracts.
    const GasPriceOracle = getContractFactory('OVM_GasPriceOracle')
      .attach(predeploys.OVM_GasPriceOracle)
      .connect(provider)
    const ETH = getContractFactory('WETH9')
      .attach(predeploys.WETH9)
      .connect(provider)
    // Arbitrary recipient address.
    const to = store.state.transferData.selectMakerInfo.makerAddress

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
    // console.log(`Estimated L1 fee (in wei): ${l1FeeInWei.toString()}`)
    return Number(l1FeeInWei)
  },

  async getTokenConvertUsd(tokenName) {
    try {
      return (await exchangeToUsd(1, tokenName)).toNumber()
    } catch (error) {
      throw error.message
    }
  },

  realTransferOPID() {
    let toChainID = store.state.transferData.toChainID
    const p_text = 9000 + Number(toChainID) + ''
    return p_text
  },

  realTransferAmount() {
    let fromChainID = store.state.transferData.fromChainID
    let toChainID = store.state.transferData.toChainID
    let selectMakerInfo = store.getters.realSelectMakerInfo
    let userValue = new BigNumber(store.state.transferData.transferValue).plus(
      new BigNumber(selectMakerInfo.tradingFee)
    )
    if (!fromChainID || !userValue) {
      return 0
    }
    let rAmount = new BigNumber(userValue).multipliedBy(
      new BigNumber(10 ** selectMakerInfo.precision)
    )
    let rAmountValue = rAmount.toFixed()
    const p_text = 9000 + Number(toChainID) + ''
    const tValue = orbiterCore.getTAmountFromRAmount(
      fromChainID,
      rAmountValue,
      p_text
    )
    if (!tValue.state) {
      console.warn('getTralTransferAmountError')
      return userValue
    } else {
      return new BigNumber(tValue.tAmount).dividedBy(
        new BigNumber(10 ** selectMakerInfo.precision)
      )
    }
  },
}
