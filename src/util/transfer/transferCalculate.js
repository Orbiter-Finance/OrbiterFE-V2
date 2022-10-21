import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import env from '../../../env'
import thirdapi from '../../core/actions/thirdapi'
// import zksync2 from '../../core/actions/zksync2'
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
import {getZkSyncProvider} from '../zksync/zkysnc_helper'
import util from '../util'
import loopring from '../../core/actions/loopring'
import { DydxHelper } from '../dydx/dydx_helper'
import Web3 from 'web3'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import {
  transferDataState,
  realSelectMakerInfo,
  web3State,
} from '../../composition/hooks'

// zk deposit
const ZK_ERC20_DEPOSIT_APPROVEL_ONL1 = 45135
const ZK_ERC20_DEPOSIT_DEPOSIT_ONL1 = 103937
const ZK_ETH_DEPOSIT_DEPOSIT_ONL1 = 62599

// zkspace deposit
const ZKSPACE_ETH_DEPOSIT_DEPOSIT_ONL1 = 160000
//https://rinkeby.etherscan.io/tx/0x6b6c2eacf0cdc5ff70b7923d6225456b8f6d26008de12beec611f7ab81eb2775
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

//optimistic deposit
const OP_ETH_DEPOSIT_DEPOSIT_ONL1 = 151000
const OP_ETH_WITHDRAW_ONOP_L2 = 137000
const OP_ETH_WITHDRAW_ONL1 = 820000

// https://ropsten.etherscan.io/tx/0x6182c35a69951a8443d6b7670ecccd7c8327d95faea95d7e949fc96ab6e7e0d7
const OP_ERC20_DEPOSIT_DEPOSIT_ONL1 = 77921
// optimistic withdraw
// https://kovan-optimistic.etherscan.io/tx/0x1df81e482369067c63c20f40d9ce1b8b75813f11957ff90c2fa967feef66e7a7
const OP_ERC20_WITHDRAW_ONOP_L2 = 115340
const OP_ERC20_WITHDRAW_ONL1 = 820000 //not get wanted

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

// zksync2 deposit
const ZK2_ETH_DEPOSIT_DEPOSIT_ONL1 = 170617
const ZK2_ERC20_DEPOSIT_DEPOSIT_ONL1 = 117858
// zksync2 withdraw
const ZK2_ETH_WITHDRAW_ONZK2 = 10560
const ZK2_ERC20_WITHDRAW_ONZK2 = 10560 //same with eth
// starkNet
const STARKNET_ETH_DEPOSIT_ONL1 = 110000
const STARKNET_ETH_WITHDRAW_ONL1 = 60000

const LocalNetWorks = env.supportLocalNetWorksIDs
export default {
  // min ~ max
  async getTransferGasLimit(fromChainID, makerAddress, fromTokenAddress) {
    const isPolygon =
      (fromChainID == 6 || fromChainID == 66) && //if transfer matic,need to consider reduce matic
      fromTokenAddress == '0x0000000000000000000000000000000000001010' //matic token address
    const isMetis =
      (fromChainID == 10 || fromChainID == 510) && //if transfer metis,need to consider reduce metis
      fromTokenAddress == '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000' //metis token address
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await getZkSyncProvider(fromChainID)
      let selectMakerInfo = realSelectMakerInfo.value
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
        const addressState = await syncHttpProvider.getState(web3State.coinbase)
        if (!addressState.committed || addressState.committed?.nonce == 0) {
          const changePubKeyFee = await syncHttpProvider.getTransactionFee(
            { ChangePubKey: { onchainPubkeyAuth: false } },
            web3State.coinbase,
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
        transferFee = await zkspace.getZKSpaceTransferGasFee(
          fromChainID,
          web3State.coinbase
        )
      } catch (error) {
        console.warn('getZKSpaceTransferGasFeeError =', error)
      }
      return transferFee
    } else if (fromChainID == 4 || fromChainID == 44) {
      let realTransferAmount = this.realTransferAmount().toString()
      let starkFee = await getStarkTransferFee(
        web3State.coinbase,
        fromTokenAddress,
        makerAddress,
        realTransferAmount,
        fromChainID
      )
      return starkFee / 10 ** 18
    } else if (fromChainID == 9 || fromChainID == 99) {
      // loopring fee can only use eth。other erc20 fee will be error
      try {
        const lpTokenInfo = await loopring.getLpTokenInfo(
          fromChainID,
          fromTokenAddress
        )
        let loopringFee = await loopring.getTransferFee(
          web3State.coinbase,
          fromChainID,
          lpTokenInfo
        )
        const decimals = 18 // loopringFee must be use eth
        return Number(loopringFee) / 10 ** decimals
      } catch (error) {
        console.warn(`lp getTransferFeeerror:`)
      }
    } else if (
      util.isEthTokenAddress(fromTokenAddress) ||
      isPolygon ||
      isMetis ||
      ((fromChainID == 14 || fromChainID == 514) &&
        fromTokenAddress.toUpperCase() == `0X${'E'.repeat(40)}`)
    ) {
      if (fromChainID === 12 || fromChainID === 512) {
        //zkspace can only use eth as fee
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
      } else if (fromChainID == 9 || fromChainID == 99) {
        // loopring fee can only use eth。other erc20 fee will be error
        try {
          const lpTokenInfo = await loopring.getLpTokenInfo(
            fromChainID,
            fromTokenAddress
          )
          let loopringFee = await loopring.getTransferFee(
            web3State.coinbase,
            fromChainID,
            lpTokenInfo
          )
          const decimals = lpTokenInfo ? lpTokenInfo.decimals : 18
          return Number(loopringFee) / 10 ** decimals
        } catch (error) {
          console.warn(`lp getTransferFeeerror:`)
        }
      }
      const web3 = localWeb3(fromChainID)
      if (web3) {
        const estimateGas = await web3.eth.estimateGas({
          from: web3State.coinbase,
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
      15: 1,
      16: 1,
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
      514: 0.000028572,
      515: 1,
      516: 1,
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
      15: 150000,
      16: 150000,
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
      514: 10560,
      515: 150000,
      516: 150000,
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
      15: 'BNB',
      16: 'ETH',
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
      14: 'ETH',
      514: 'ETH',
      515: 'BNB',
      516: 'ETH',
    }
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await getZkSyncProvider(fromChainID)
      let selectMakerInfo = realSelectMakerInfo.value
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
      let selectMakerInfo = realSelectMakerInfo.value
      let tokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      const lpTokenInfo = await loopring.getLpTokenInfo(
        fromChainID,
        tokenAddress
      )
      let loopringFee = await loopring.getTransferFee(
        web3State.coinbase,
        fromChainID,
        lpTokenInfo
      )
      // lpGasFee must use eth
      return (Number(loopringFee) / 10 ** 18).toFixed(6)
    }
    if (fromChainID === 12 || fromChainID === 512) {
      let selectMakerInfo = realSelectMakerInfo.value
      let transferFee = 0
      try {
        transferFee = await zkspace.getZKSpaceTransferGasFee(
          fromChainID,
          web3State.coinbase ? web3State.coinbase : selectMakerInfo.makerAddress
        )
      } catch (error) {
        console.warn('getZKSpaceTransferGasFeeError =', error.message)
        return 0
      }
      return transferFee.toFixed(6)
    }
    if (fromChainID == 4 || fromChainID == 44) {
      let realTransferAmount = this.realTransferAmount().toString()
      let selectMakerInfo = realSelectMakerInfo.value
      let makerAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      let fromTokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      let starkFee = await getStarkTransferFee(
        web3State.coinbase,
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
    if (fromChainID === 16 || fromChainID === 516) {
      timeSpent = 30
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
    if (toChainID === 16 || toChainID === 516) {
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
    if (toChainID === 14 || toChainID === 514) {
      timeSpent += 15
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
    if (fromChainID === 16 || fromChainID === 516) {
      return '~7 days'
    }
    if (
      fromChainID === 3 ||
      fromChainID === 33 ||
      fromChainID === 12 ||
      fromChainID === 512 ||
      fromChainID === 14 ||
      fromChainID === 514
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
    if (fromChainID === 13 || fromChainID === 513) {
      return '~7 days'
    }
    if (fromChainID === 15 || fromChainID === 515) {
      return '~15min'
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
        toChainID === 512 ||
        toChainID === 14 ||
        toChainID === 514
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
      if (toChainID === 13 || toChainID === 513) {
        return '~10min'
      }
      if (toChainID === 15 || toChainID === 515) {
        return '~15min'
      }
      if (toChainID === 16 || toChainID === 516) {
        return '~10min'
      }
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
    if (fromChainID === 16 || fromChainID === 516) {
      return ' 7 days'
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
    if (fromChainID === 15 || fromChainID === 515) {
      return ' 35 minute'
    }
  },
  /**
   * @deprecated Move to transferOrginGasUsd
   */
  async transferOrginGas(fromChainID, toChainID, isErc20 = true) {
    let resultGas = 0
    let selectMakerInfo = realSelectMakerInfo.value
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
      const syncHttpProvider = await getZkSyncProvider(fromChainID)
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
    let bscGas = 0
    const selectMakerInfo = realSelectMakerInfo.value

    // withdraw
    if (fromChainID === 2 || fromChainID === 22) {
      try {
        // Ar get
        let fromGasPrice = await this.getGasPrice(fromChainID)
        // AR WithDraw
        let ARWithDrawARGas =
          fromGasPrice *
          (isErc20 ? AR_ERC20_WITHDRAW_ONAR : AR_ETH_WITHDRAW_ONAR)

        let L1ChainID = fromChainID === 2 ? 1 : 5
        let L1GasPrice = await this.getGasPrice(L1ChainID)
        let ARWithDrawL1Gas =
          L1GasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONL1 : AR_ETH_WITHDRAW_ONL1)
        ethGas = ARWithDrawARGas + ARWithDrawL1Gas
      } catch (error) {
        throw new Error(`ar withdraw error`)
      }
    }

    if (fromChainID === 3 || fromChainID === 33) {
      try {
        // zk withdraw
        const syncHttpProvider = await getZkSyncProvider(fromChainID)
        let transferAddress = selectMakerInfo.makerAddress
        if (transferAddress) {
          const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
            'Withdraw',
            transferAddress,
            0
          )
          ethGas += Number(zkWithDrawFee.totalFee)
        }
      } catch (error) {
        throw new Error(`zksync withdraw error`)
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
      try {
        const fromGasPrice = await this.getGasPrice(fromChainID)

        // Polygon WithDraw
        const PGWithDrawARGas = fromGasPrice * PG_ERC20_WITHDRAW_ONPG
        maticGas += PGWithDrawARGas

        const L1ChainID = fromChainID === 6 ? 1 : 5
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const PGWithDrawL1Gas = L1GasPrice * PG_ERC20_WITHDRAW_ONL1
        ethGas += PGWithDrawL1Gas
      } catch (error) {
        throw new Error(`po withdraw error`)
      }
    }
    if (fromChainID === 7 || fromChainID === 77) {
      try {
        // OP get
        let fromGasPrice = await this.getGasPrice(fromChainID)
        // op WithDraw
        let OPWithDrawOPGas =
          fromGasPrice *
          (isErc20 ? OP_ERC20_WITHDRAW_ONOP_L2 : OP_ETH_WITHDRAW_ONOP_L2)

        let L1ChainID = fromChainID === 7 ? 1 : 5

        let L1GasPrice = await this.getGasPrice(L1ChainID)

        let OPWithDrawL1Gas =
          L1GasPrice * (isErc20 ? OP_ERC20_WITHDRAW_ONL1 : OP_ETH_WITHDRAW_ONL1)

        let OPWithDrawOP_L1 = await this.getOPFee(fromChainID)

        ethGas = OPWithDrawOPGas + OPWithDrawL1Gas + Number(OPWithDrawOP_L1)

        //  let gas = gasPrice * GasLimitMap[fromChainID.toString()]
        //  if (fromChainID === 7 || fromChainID === 77) {
        //    let l1GasFee = await this.getOPFee(fromChainID)
        //    gas += l1GasFee
        //  }
        //  gas = gas / 10 ** 18
        //  return gas.toFixed(6).toString()
      } catch (error) {
        throw new Error(`op withdraw error`)
      }
    }
    if (fromChainID === 8 || fromChainID === 88) {
      try {
        const L1ChainID = fromChainID === 8 ? 1 : 5
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const IMXWithDrawL1Gas =
          L1GasPrice *
          (isErc20 ? IMX_ERC20_WITHDRAW_ONL1 : IMX_ETH_WITHDRAW_ONL1)
        ethGas += IMXWithDrawL1Gas
      } catch (error) {
        throw new Error(`imx withdraw error`)
      }
    }
    if (fromChainID === 9 || fromChainID === 99) {
      try {
        let loopringWithDrawFee = await loopring.getWithDrawFee(
          web3State.coinbase,
          fromChainID,
          selectMakerInfo.tName
        )
        ethGas += Number(loopringWithDrawFee)
      } catch (error) {
        throw new Error(`loopring withdraw error`)
      }
    }
    if (fromChainID === 10 || fromChainID === 510) {
      try {
        // MT get
        let fromGasPrice = await this.getGasPrice(fromChainID)
        // MT WithDraw
        const MTWithDrawARGas = fromGasPrice * MT_ERC20_WITHDRAW_ONMT
        metisGas += MTWithDrawARGas
        const L1ChainID = fromChainID === 10 ? 1 : 5
        const L1GasPrice = await this.getGasPrice(L1ChainID)
        const MTWithDrawL1Gas = L1GasPrice * MT_ERC20_WITHDRAW_ONL1
        ethGas += MTWithDrawL1Gas
      } catch (error) {
        throw new Error(`metis withdraw error`)
      }
    }
    if (fromChainID === 12 || fromChainID === 512) {
      try {
        let zkspaceWithDrawFee = await zkspace.getZKSpaceWithDrawGasFee(
          fromChainID,
          web3State.coinbase ? web3State.coinbase : selectMakerInfo.makerAddress
        )
        ethGas += Number(zkspaceWithDrawFee * 10 ** selectMakerInfo.precision)
      } catch (error) {
        throw new Error(`zkspace withdraw error`)
      }
    }
    if (fromChainID === 13 || fromChainID === 513) {
      // BOBA get
      const fromGasPrice = await this.getGasPrice(fromChainID)
      ethGas = fromGasPrice * BOBA_TRANSFER_OUT_LIMIT
    }
    if (fromChainID === 15 || fromChainID === 515) {
      try {
        const fromGasPrice = await this.getGasPrice(fromChainID)
        // BSC WithDraw
        const bscWithDrawARGas = fromGasPrice * 150000
        bscGas += bscWithDrawARGas
      } catch (error) {
        throw new Error(`bsc withdraw error`)
      }
    }
    if (fromChainID === 14 || fromChainID === 514) {
      // zk2 widthdraw
      const fromGasPrice = await this.getGasPrice(fromChainID)
      ethGas =
        fromGasPrice *
        (isErc20 ? ZK2_ERC20_WITHDRAW_ONZK2 : ZK2_ETH_WITHDRAW_ONZK2)
    }
    if (fromChainID === 16 || fromChainID === 516) {
      try {
        // Ar get
        let fromGasPrice = await this.getGasPrice(fromChainID)
        // AR WithDraw
        let ARWithDrawARGas = fromGasPrice * (isErc20 ? 300000 : 65000)
        let L1ChainID = fromChainID === 16 ? 1 : 5
        let L1GasPrice = await this.getGasPrice(L1ChainID)
        let WithDrawL1Gas = L1GasPrice * (isErc20 ? 160000 : 115000)
        ethGas = ARWithDrawARGas + WithDrawL1Gas
      } catch (error) {
        throw new Error(`ar withdraw error`)
      }
    }

    // deposit
    if (toChainID === 2 || toChainID === 22) {
      try {
        // Ar deposit
        const toGasPrice = await this.getGasPrice(toChainID === 2 ? 1 : 5)
        const arDepositGas =
          toGasPrice *
          (isErc20
            ? AR_ERC20_DEPOSIT_DEPOSIT_ONL1
            : AR_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += arDepositGas
      } catch (error) {
        throw new Error(`ar deposit error`)
      }
    }
    if (toChainID === 3 || toChainID === 33) {
      try {
        // zk deposit
        const toGasPrice = await this.getGasPrice(toChainID === 3 ? 1 : 5)
        const zkDepositGas =
          toGasPrice *
          (isErc20
            ? ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1
            : ZK_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += zkDepositGas
      } catch (error) {
        throw new Error(`zksync deposit error`)
      }
    }
    if (toChainID === 4 || toChainID === 44) {
      const L1ChainID = toChainID == 4 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const SNDepositL1Gas = L1GasPrice * STARKNET_ETH_DEPOSIT_ONL1
      ethGas += SNDepositL1Gas
    }
    if (toChainID === 6 || toChainID === 66) {
      try {
        // Polygon deposit
        const toGasPrice = await this.getGasPrice(toChainID === 6 ? 1 : 5)
        const pgDepositGas = toGasPrice * PG_ERC20_DEPOSIT_DEPOSIT_ONL1
        ethGas += pgDepositGas
      } catch (error) {
        throw new Error(`po deposit error`)
      }
    }
    if (toChainID === 7 || toChainID === 77) {
      try {
        // op deposit
        let toGasPrice = await this.getGasPrice(toChainID === 7 ? 1 : 5)
        let opDepositGas =
          toGasPrice *
          (isErc20
            ? OP_ERC20_DEPOSIT_DEPOSIT_ONL1
            : OP_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += opDepositGas
      } catch (error) {
        throw new Error(`op deposit error`)
      }
    }
    if (toChainID === 8 || toChainID === 88) {
      try {
        // imx deposit
        const toGasPrice = await this.getGasPrice(toChainID === 8 ? 1 : 5)
        const imxDepositGas =
          toGasPrice *
          (isErc20
            ? IMX_ERC20_DEPOSIT_DEPOSIT_ONL1
            : IMX_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += imxDepositGas
      } catch (error) {
        throw new Error(`imx deposit error`)
      }
    }
    if (toChainID === 9 || toChainID === 99) {
      try {
        //loopring deposit
        let toGasPrice = await this.getGasPrice(toChainID === 9 ? 1 : 5)
        let lpDepositGas =
          toGasPrice *
          (isErc20
            ? LP_ERC20_DEPOSIT_DEPOSIT_ONL1
            : LP_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += lpDepositGas
      } catch (error) {
        throw new Error(`loopring deposit error`)
      }
    }
    if (toChainID === 10 || toChainID === 510) {
      try {
        // MT deposit
        let toGasPrice = await this.getGasPrice(toChainID === 10 ? 1 : 5)
        // MT deposit
        const mtDepositGas = toGasPrice * MT_ERC20_DEPOSIT_DEPOSIT_ONL1
        ethGas += mtDepositGas
      } catch (error) {
        throw new Error(`metis deposit error`)
      }
    }
    if (toChainID === 11 || toChainID === 511) {
      try {
        // dydx deposit
        const toGasPrice = await this.getGasPrice(toChainID === 11 ? 1 : 5)
        const dydxDepositGas = toGasPrice * DYDX_ETH_DEPOSIT_DEPOSIT_ONL1
        ethGas += dydxDepositGas
      } catch (error) {
        throw new Error(`metis deposit error`)
      }
    }
    if (toChainID === 12 || toChainID === 512) {
      try {
        let toGasPrice = await this.getGasPrice(toChainID === 12 ? 1 : 5)
        let zkspaceDepositGas =
          toGasPrice *
          (isErc20
            ? ZKSPACE_ERC20_DEPOSIT_DEPOSIT_ONL1
            : ZKSPACE_ETH_DEPOSIT_DEPOSIT_ONL1)
        ethGas += zkspaceDepositGas
      } catch (error) {
        throw new Error(`zkspace deposit error`)
      }
    }
    if (toChainID === 13 || toChainID === 513) {
      // BOBA deposit
      let toGasPrice = await this.getGasPrice(toChainID)
      const depositGas = toGasPrice * BOBA_TRANSFER_IN_LIMIT
      ethGas += depositGas
    }

    if (toChainID === 15 || toChainID === 515) {
      try {
        // MT deposit
        let toGasPrice = await this.getGasPrice(toChainID)
        // MT deposit
        const mtDepositGas = toGasPrice * 150000
        bscGas += mtDepositGas
      } catch (error) {
        throw new Error(`bsc deposit error`)
      }
    }
    if (toChainID === 14 || toChainID === 514) {
      // zk2 get
      const toGasPrice = await this.getGasPrice(toChainID === 14 ? 1 : 5)
      ethGas =
        toGasPrice *
        (isErc20
          ? ZK2_ERC20_DEPOSIT_DEPOSIT_ONL1
          : ZK2_ETH_DEPOSIT_DEPOSIT_ONL1)
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
      let starknetAddress = web3State.starkNet.starkNetAddress
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
      const lpTokenInfo = await loopring.getLpTokenInfo(
        localChainID,
        tokenAddress
      )
      const balance = await loopring.getLoopringBalance(
        userAddress,
        localChainID,
        isMaker,
        lpTokenInfo
      )
      return balance
    } else if (localChainID === 11 || localChainID === 511) {
      const dydxHelper = new DydxHelper(
        localChainID,
        new Web3(compatibleGlobalWalletConf.value.walletPayload.provider),
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
        let selectMakerInfo = realSelectMakerInfo.value
        let balanceInfo = await zkspace.getZKspaceBalance(zkReq)
        if (!balanceInfo) {
          return 0
        }
        const zksTokenInfos =
          localChainID === 12
            ? store.state.zksTokenList.mainnet
            : store.state.zksTokenList.rinkeby
        const tokenInfo = zksTokenInfos.find(
          (item) => item.address == tokenAddress
        )
        const theBalanceInfo = balanceInfo.find(
          (item) => item.id == tokenInfo.id
        )
        return theBalanceInfo
          ? theBalanceInfo.amount * 10 ** selectMakerInfo.precision
          : 0
      } catch (error) {
        throw new Error(`getZKSBalanceError,${error.message}`)
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
      if (response.status === 200) {
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
    const to = transferDataState.selectMakerInfo.makerAddress

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

  realTransferOPID() {
    let toChainID = transferDataState.toChainID
    const p_text = 9000 + Number(toChainID) + ''
    return p_text
  },

  realTransferAmount() {
    let fromChainID = transferDataState.fromChainID
    let toChainID = transferDataState.toChainID
    let selectMakerInfo = realSelectMakerInfo.value
    let userValue = new BigNumber(transferDataState.transferValue).plus(
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
      return userValue
    } else {
      return new BigNumber(tValue.tAmount).dividedBy(
        new BigNumber(10 ** selectMakerInfo.precision)
      )
    }
  },
  async getTokenList(fromChainID, count = 10) {
    let tokenList =
      fromChainID === 14
        ? store.state.zk2tokenList.mainnet
        : store.state.zk2tokenList.rinkeby
    if (tokenList.length == 0) {
      await util.sleep(300)
      count--
      if (count >= 0) {
        return await this.getTokenList(fromChainID, count)
      }
    }
    return tokenList
  },
  getMakerInfo: async function (fromChainID, count = 10) {
    let selectMakerInfo = store.getters.realSelectMakerInfo
    if (!selectMakerInfo) {
      await util.sleep(300)
      count--
      if (count >= 0) {
        return await this.getMakerInfo(fromChainID, count)
      }
    }
    return selectMakerInfo
  },
}
