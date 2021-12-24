import { getLocalCoinContract } from '../constants/contract/getContract'
import thirdapi from '../../core/actions/thirdapi'
import axios from 'axios'
import env from '../../../env'
import BigNumber from 'bignumber.js'
import { store } from '../../store'
import orbiterCore from '../../orbiterCore'
import * as zksync from 'zksync'

// zk deposit
const ZK_ERC20_DEPOSIT_APPROVEL_ONL1 = 45135
const ZK_ERC20_DEPOSIT_DEPOSIT_ONL1 = 103937
// const ZK_ETH_DEPOSIT_DEPOSIT_ONL1 = 62599

// ar deposit
const AR_ERC20_DEPOSIT_DEPOSIT_ONL1 = 218291
// const AR_ETH_DEPOSIT_DEPOSIT_ONL1 = 92000

// ar withdraw
const AR_ERC20_WITHDRAW_ONAR = 801420
const AR_ERC20_WITHDRAW_ONL1 = 234552

// const AR_ETH_WITHDRAW_ONAR = 666721
// const AR_ETH_WITHDRAW_ONL1 = 161063

// const AR_ETH_DEPOSIT_DEPOSIT_ONL1 = 92000

const LocalNetWorks = env.supportLocalNetWorksIDs
export default {
  // '1': '1', // mainnet
  // '2': '42161', // Arbitrum
  // '3': '1', // zk
  // '4': '3', // reposten
  // '5': '4', // rinkeby
  // '22': '421611', // arbitrum test
  // '33': '4', // zktest
  async getTransferGasLimit(fromChainID) {
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet',
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
        (item) => item.address === tokenAddress,
      )
      let resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        transferAddress,
        resultToken.id,
      )
      return (fee.totalFee / 10 ** resultToken.decimals).toFixed(6)
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
    if (fromChainID === 3 || fromChainID === 33) {
      timeSpent = 5
    }
    if (toChainID === 1 || toChainID === 4 || toChainID === 5) {
      timeSpent += 30
    }
    if (toChainID === 2 || toChainID === 22) {
      timeSpent += 15
    }
    if (toChainID === 3 || toChainID === 33) {
      timeSpent += 5
    }
    let timeSpentStr = timeSpent + 's'
    return timeSpentStr
  },
  async transferSpentGas(fromChainID) {
    const GasPriceMap = {
      '1': 100,
      '2': 1.9,
      '3': 100,
      '4': 1,
      '5': 1,
      '22': 0.02,
      '33': 100,
    }
    const GasLimitMap = {
      '1': 35000,
      '2': 810000,
      '3': 100,
      '4': 35000,
      '5': 35000,
      '22': 810000,
      '33': 100,
    }
    const GasTokenMap = {
      '1': 'ETH',
      '2': 'AETH',
      '3': 'ETH',
      '4': 'ETH',
      '5': 'ETH',
      '22': 'AETH',
      '33': 'ETH',
    }
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet',
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
        (item) => item.address === tokenAddress,
      )
      let resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        transferAddress,
        resultToken.id,
      )
      return (fee.totalFee / 10 ** resultToken.decimals).toFixed(6)
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
        let gas = (gasPrice * GasLimitMap[fromChainID.toString()]) / 10 ** 18
        return gas.toFixed(6).toString()
      }
    } else {
      return null
    }
  },
  transferOrginTime(fromChainID, toChainID) {
    if (fromChainID === 2 || fromChainID === 22) {
      return '~7 days'
    }
    if (fromChainID === 3 || fromChainID === 33) {
      return '~4 hours'
    }
    if (fromChainID === 1 || fromChainID === 4 || fromChainID === 5) {
      if (toChainID === 2 || toChainID === 22) {
        //  eth ->  ar
        return '~10min'
      }
      if (toChainID === 3 || toChainID === 33) {
        // eth -> zk
        return '~10min'
      }
    }
  },
  transferSavingTime(fromChainID, toChainID) {
    if (fromChainID === 2 || fromChainID === 22) {
      return ' 7 days'
    }
    if (fromChainID === 3 || fromChainID === 33) {
      return ' 4 hours'
    }
    if (fromChainID === 1 || fromChainID === 4 || fromChainID === 5) {
      if (toChainID === 2 || toChainID === 22) {
        //  eth ->  ar
        return ' 9.25min'
      }
      if (toChainID === 3 || toChainID === 33) {
        // eth -> zk
        return ' 9.5min'
      }
    }
  },
  async transferOrginGas(fromChainID, toChainID) {
    let resultGas = 0
    let selectMakerInfo = store.getters.realSelectMakerInfo
    if (fromChainID === 2 || fromChainID === 22) {
      // Ar get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // AR WithDraw
      let ARWithDrawARGas = fromGasPrice * AR_ERC20_WITHDRAW_ONAR

      let L1ChainID = fromChainID === 2 ? 1 : 5
      let L1GasPrice = await this.getGasPrice(L1ChainID)
      let ARWithDrawL1Gas = L1GasPrice * AR_ERC20_WITHDRAW_ONL1
      resultGas = ARWithDrawARGas + ARWithDrawL1Gas
    }
    if (fromChainID === 3 || fromChainID === 33) {
      // zk withdraw
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet',
      )
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (transferAddress) {
        const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
          'Withdraw',
          transferAddress,
          0,
        )
        resultGas += Number(zkWithDrawFee.totalFee)
      }
    }
    if (toChainID === 2 || toChainID === 22) {
      // Ar deposit
      let toGasPrice = await this.getGasPrice(toChainID === 2 ? 1 : 5)
      let arDepositGas = toGasPrice * AR_ERC20_DEPOSIT_DEPOSIT_ONL1
      resultGas += arDepositGas
    }
    if (toChainID === 3 || toChainID === 33) {
      // zk deposit
      let toGasPrice = await this.getGasPrice(toChainID === 3 ? 1 : 5)
      let zkDepositGas =
        toGasPrice *
        (ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1)
      resultGas += zkDepositGas
    }
    return resultGas / 10 ** 18
  },
  async getTransferBalance(localChainID, tokenAddress, tokenName, userAddress) {
    if (localChainID === 3 || localChainID === 33) {
      var req = {
        account: userAddress,
        localChainID: localChainID,
        stateType: 'committed',
      }
      try {
        let balanceInfo = await thirdapi.getZKBalance(req)
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
        console.log('error =', error)
        throw 'getZKBalanceError'
      }
    } else {
      var tokenContract = await getLocalCoinContract(
        localChainID,
        tokenAddress,
        0,
      )
      if (!tokenContract) {
        throw 'getBalance_tokenContractError'
      }
      let balance = await tokenContract.methods.balanceOf(userAddress).call()
      return balance
    }
  },
  async getGasPrice(fromChainID) {
    if (fromChainID === 33 || fromChainID === 3) {
      return null
    }
    if (LocalNetWorks.indexOf(fromChainID.toString()) > -1) {
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
  async getTokenPrice(tokenName) {
    try {
      let response = await axios.get(
        `https://api.coinbase.com/v2/exchange-rates?currency=${tokenName}`,
      )
      if (
        response.status === 200 &&
        response.statusText === '' &&
        response.data.data &&
        response.data.data.currency === 'ETH' &&
        response.data.data.rates &&
        response.data.data.rates &&
        response.data.data.rates.USDT
      ) {
        return response.data.data.rates.USDT
      } else {
        throw 'GetETHPriceDataError'
      }
    } catch (error) {
      throw error.message
    }
  },
  realTransferOPID() {
    let toChainID = store.state.transferData.toChainID
    var p_text =
      toChainID.toString().length === 1
        ? '900' + toChainID.toString()
        : '90' + toChainID.toString()
    return p_text
  },
  realTransferAmount() {
    let fromChainID = store.state.transferData.fromChainID
    let toChainID = store.state.transferData.toChainID
    let selectMakerInfo = store.getters.realSelectMakerInfo
    let userValue = new BigNumber(store.state.transferData.transferValue).plus(
      new BigNumber(selectMakerInfo.tradingFee),
    )
    if (!fromChainID || !userValue) {
      return 0
    }
    let rAmount = new BigNumber(userValue).multipliedBy(
      new BigNumber(10 ** selectMakerInfo.precision),
    )
    let rAmountValue = rAmount.toFixed()
    var p_text =
      toChainID.toString().length === 1
        ? '900' + toChainID.toString()
        : '90' + toChainID.toString()
    var tValue = orbiterCore.getTAmountFromRAmount(
      fromChainID,
      rAmountValue,
      p_text,
    )
    if (!tValue.state) {
      console.log('getTralTransferAmountError')
      return userValue
    } else {
      return new BigNumber(tValue.tAmount).dividedBy(
        new BigNumber(10 ** selectMakerInfo.precision),
      )
    }
  },
}
