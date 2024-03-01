import { toggleBodyCls } from '../../util'
import {
  updatelpApiKey,
  updatelpAccountInfo,
  web3State,
} from '../../composition/hooks'
import { CHAIN_ID } from '../../config'
import getQueryString from '../../util/getQueryString'

export default {
  updateZKTokenList(state, obj) {
    if (obj.chainID === CHAIN_ID.zksync) {
      state.zktokenList.mainnet = obj.tokenList
    }
    if (obj.chainID === CHAIN_ID.zksync_test) {
      state.zktokenList.rinkeby = obj.tokenList
    }
  },
  updateZksTokenList(state, obj) {
    if (obj.chainID === CHAIN_ID.zkspace) {
      state.zksTokenList.mainnet = obj.tokenList
    }
    if (obj.chainID === CHAIN_ID.zkspace_test) {
      state.zksTokenList.rinkeby = obj.tokenList
    }
  },
  updateLpTokenList(state, obj) {
    if (obj.chainID === CHAIN_ID.loopring) {
      state.lpTokenList.mainnet = obj.tokenList
    }
    if (obj.chainID === CHAIN_ID.loopring_test) {
      state.lpTokenList.rinkeby = obj.tokenList
    }
  },

  updateProceedTxID(state, txid) {
    state.proceedTXID = txid
    state.proceedState = 1
    state.proceeding.userTransfer.localChainID = null
    state.proceeding.userTransfer.from = null
    state.proceeding.userTransfer.to = null
    state.proceeding.userTransfer.amount = null
    state.proceeding.userTransfer.txid = null
    state.proceeding.userTransfer.isConfirmed = null
    state.proceeding.userTransfer.nonce = null
    state.proceeding.userTransfer.timeStamp = null
    state.proceeding.makerTransfer.localChainID = null
    state.proceeding.makerTransfer.from = null
    state.proceeding.makerTransfer.to = null
    state.proceeding.makerTransfer.amount = null
    state.proceeding.makerTransfer.txid = null
    state.proceeding.makerTransfer.isConfirmed = null
    state.proceeding.makerTransfer.nonce = null
    state.proceeding.makerTransfer.timeStamp = null
  },
  updateProceedingUserTransferLocalChainID(state, obj) {
    state.proceeding.userTransfer.localChainID = obj
  },
  updateProceedingUserTransferFrom(state, obj) {
    state.proceeding.userTransfer.from = obj
  },
  updateProceedingUserTransferTo(state, obj) {
    state.proceeding.userTransfer.to = obj
  },
  updateProceedingUserTransferAmount(state, obj) {
    state.proceeding.userTransfer.amount = obj
  },
  updateProceedingUserTransferTxid(state, obj) {
    state.proceeding.userTransfer.txid = obj
  },
  updateProceedingUserTransferTimeStamp(state, obj) {
    state.proceeding.userTransfer.timeStamp = obj
  },
  updateProceedingMakerTransferTxid(state, obj) {
    state.proceeding.makerTransfer.txid = obj
  },
  updateProceedState(state, proceedState) {
    state.proceedState = proceedState
  },
  updateConfirmRouteDescInfo(state, routeDescInfo) {
    state.confirmData.routeDescInfo = routeDescInfo
  },
  updateStarkNetAddress(state, starkNetAddress) {
    if (!starkNetAddress || starkNetAddress.length === 0) {
      starkNetAddress = ''
      web3State.starkNet.starkIsConnected = false
      web3State.starkNet.starkNetWalletName = ''
      web3State.starkNet.starkWalletIcon = ''
      web3State.starkNet.starkChain = ''
    } else {
      web3State.starkNet.starkIsConnected = true
    }
    // web3State.starkNet.starkNetAddress = starkNetAddress
    web3State.starkNet.starkNetAddress = getQueryString('strk')
  },

  updateStarkNetIsConnect(state, starkNetIsConnect) {
    if (!starkNetIsConnect) {
      web3State.starkNet.starkNetWalletName = ''
      web3State.starkNet.starkWalletIcon = ''
      web3State.starkNet.starkChain = ''
      web3State.starkNet.starkNetAddress = ''
    }
    web3State.starkNet.starkNetIsConnect = starkNetIsConnect
  },
  updateStarkNetWalletName(state, starkNetWalletName) {
    if (!starkNetWalletName || starkNetWalletName.length === 0) {
      starkNetWalletName = ''
    }
    web3State.starkNet.starkNetWalletName = starkNetWalletName
  },
  updateStarkNetWalletIcon(state, starkNetWalletIcon) {
    if (!starkNetWalletIcon || starkNetWalletIcon.length === 0) {
      starkNetWalletIcon = ''
    }
    web3State.starkNet.starkNetWalletIcon = starkNetWalletIcon
  },
  updateStarkNetChain(state, starkChain) {
    if (!starkChain || starkChain.length === 0) {
      starkChain = ''
    }
    web3State.starkNet.starkChain = starkChain
  },
  updateNetWorkId(state, netWorkId) {
    web3State.networkId = netWorkId
    updatelpAccountInfo(null)
    updatelpApiKey(null)
  },
  updateLocalLogin(state, localLogin) {
    web3State.localLogin = localLogin
    updatelpAccountInfo(null)
    updatelpApiKey(null)
  },
  setInnerWH(state, { innerWidth, innerHeight }) {
    state.innerWH.innerWidth = innerWidth
    state.innerWH.innerHeight = innerHeight
  },
  toggleThemeMode(state, mode) {
    if (typeof mode === 'string' && mode) {
      state.themeMode = mode
    } else {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    }
    localStorage.setItem('themeMode', state.themeMode)
    toggleBodyCls()
  },
}
