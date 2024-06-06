import { toggleBodyCls } from '../../util'
import {
  updatelpApiKey,
  updatelpAccountInfo,
  web3State,
  setClaimCardModalShow,
  setClaimCardModalDataInfo,
  setClaimCardModalAmountInfo,
} from '../../composition/hooks'
import { CHAIN_ID } from '../../config'

import completionStarknetAddress from '../../util/completionStarknetAddress'
import {
  requestClaimLuckyBagReward,
  drawClaimLuckyBagReward,
} from '../../common/openApiAx'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import { ethers } from 'ethers'
import util from '../../util/util'

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
    web3State.starkNet.starkNetAddress =
      completionStarknetAddress(starkNetAddress)
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

  updateSolanaAddress(state, solanaAddress) {
    if (!solanaAddress || solanaAddress.length === 0) {
      solanaAddress = ''
      web3State.solana.starkIsConnected = false
      web3State.solana.solanaWalletName = ''
      web3State.solana.solanaWalletIcon = ''
    } else {
      web3State.solana.starkIsConnected = true
    }
    web3State.solana.solanaAddress = solanaAddress
  },
  updateTonAddress(state, tonAddress) {
    if (!tonAddress || tonAddress.length === 0) {
      tonAddress = ''
    }
    web3State.ton.tonAddress = tonAddress
  },
  updateSolanaWalletName(state, solanaWalletName) {
    if (!solanaWalletName || solanaWalletName.length === 0) {
      solanaWalletName = ''
    }
    web3State.solana.solanaWalletName = solanaWalletName
  },
  updateSolanaWalletIcon(state, solanaWalletIcon) {
    if (!solanaWalletIcon || solanaWalletIcon.length === 0) {
      solanaWalletIcon = ''
    }
    web3State.solana.solanaWalletIcon = solanaWalletIcon
  },
  updateSolanaIsConnect(state, solanaIsConnect) {
    if (!solanaIsConnect) {
      web3State.solana.solanaWalletName = ''
      web3State.solana.starkWalletIcon = ''
      web3State.solana.starkChain = ''
      web3State.solana.solanaAddress = ''
    }
    web3State.solana.solanaIsConnect = solanaIsConnect
  },
  updateSolanaChain(state, starkChain) {
    web3State.solana.solanaChain = starkChain
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
  async getClaimORBGUYRewardData(state, {type,token}) {
    try {
      if (type === 'LUCKY_BAG') {
        const address =
          compatibleGlobalWalletConf.value.walletPayload.walletAddress
        if (!address && address !== '0x') return
        // util.showMessage('Opening...', 'warning')
        // 

        let res = await requestClaimLuckyBagReward(address?.toLocaleLowerCase(), token)
        if (!res?.result?.sign) {
          res = await drawClaimLuckyBagReward(address?.toLocaleLowerCase(), token)
        }
        const { result, code, message = '' } = res || {}
        const {
          max = 0,
          totalQuantity = 0,
          card = {},
          businessIdentity = '',
          sign = '',
        } = result || {}
        if (Number(code) === 0) {
          setClaimCardModalDataInfo({
            data: [
              {
                expiredTimestamp: card?.expiredTimestamp,
                id: card?.id,
                value: card?.value,
                flag: businessIdentity,
              },
            ],
            sign: [sign],
          })
          setClaimCardModalAmountInfo({
            max,
            totalQuantity,
            ratio: Number(totalQuantity)
              ? ethers.utils
                  .parseEther(String(totalQuantity))
                  .mul('100')
                  .div(ethers.utils.parseEther(String(max)))
                  .toString()
              : '0',
          })
          setClaimCardModalShow(true, type)
        } else {
          util.showMessage(String(message), 'warning')
        }
      } else {
        setClaimCardModalShow(false, type)
        setClaimCardModalDataInfo(null)
      }
    } catch (error) {
      console.log('error', error)
      util.showMessage(String(error), 'warning')
    }
  },
}
