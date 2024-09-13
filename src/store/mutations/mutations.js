import { isDev, toggleBodyCls } from '../../util'
import {
  updatelpApiKey,
  updatelpAccountInfo,
  web3State,
  setClaimCardModalShow,
  setClaimCardModalDataInfo,
  claimCardModalDataInfo,
  claimCardModalAmountInfo,
  setClaimCardModalAmountInfo,
  setClaimCardModalOtherDataInfo,
  setPrizesRankList,
  setPrizesRankRefreshTime,
  setPrizesProjectTaskDetailsList,
  setPrizesUserList,
  setPrizesProjectTime,
  setQuestsInfoList,
  setQuestsUserInfoList,
  setPrizesTotaltx,
  setPrizesUserRank,
  updateCoinbase,
} from '../../composition/hooks'
import { CHAIN_ID } from '../../config'

import completionStarknetAddress from '../../util/completionStarknetAddress'
import {
  drawClaimLuckyBagReward,
  requestClaimLuckyBagReward,
  requestClaimLuckyBagRewardData,
} from '../../common/openApiAx'
import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import util from '../../util/util'
import { ethers } from 'ethers'

const activityProjectId = '123104d2-4a00-4242-bce6-461faf1267ef'

let timer
let timer1
let timer2
let timer3
let timer4
let timer5
let timer6
let timer7
let timer8

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
    updateCoinbase('')
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
  async requestLuckyBagDataInfo(state, { address }) {
    if (!address) return
    try {
      setClaimCardModalDataInfo(null)
      setClaimCardModalAmountInfo(null)
      try {
        const res1 = await requestClaimLuckyBagRewardData(
          address.toLocaleLowerCase()
        )

        const list = res1?.map((item) => {
          return {
            expiredTimestamp: item?.deadline,
            id: item?.serial_number,
            value: item?.quantity,
            flag: item?.business_identity,
            claimContract: item?.claim_contract,
            decimals: item?.decimals,
            symbol: item?.symbol,
            token: item?.token,
            chainId: item?.chain_id,
          }
        })
        const signList = res1?.map((item) => {
          return item.sign
        })

        setClaimCardModalDataInfo({
          data: list,
          sign: signList,
          isClaimedData:
            res1?.length && !res1.some((item) => item.status === '0'),
        })
      } catch (error) {}

      const res = await requestClaimLuckyBagReward(address.toLocaleLowerCase())
      const { result } = res || {}
      const {
        stock = 0,
        maxGrant = 0,
        activityTime = 0,
        chainId,
        max = 0,
        clainContract = '',
        token = '',
        symbol = '',
        decimals = '',
      } = result || {}
      const totalQuantity = maxGrant - stock || 0

      setClaimCardModalAmountInfo({
        maxTotal: max,
        max: maxGrant,
        totalQuantity,
        activityTime,
        chainId,
        claimContract: clainContract,
        token,
        symbol,
        decimals,
        ratio: Number(totalQuantity)
          ? ethers.utils
              .parseEther(String(totalQuantity))
              .mul('100')
              .div(ethers.utils.parseEther(String(maxGrant)))
              .toString()
          : '0',
      })
    } catch (error) {}
  },
  async getClaimORBGUYRewardData(state, { type, token, distributeResult }) {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      const { data = [] } = claimCardModalDataInfo.value || {}
      const info = data[0] || claimCardModalAmountInfo.value || {}
      try {
        if (type) {
          const address =
            compatibleGlobalWalletConf.value.walletPayload.walletAddress
          if (!address && address !== '0x') return
          // util.showMessage('Opening...', 'warning')
          //
          let res = {}
          if (type === 'LUCKY_BAG') {
            res = await drawClaimLuckyBagReward(
              address?.toLocaleLowerCase(),
              token
            )
            const { result, code, message = '' } = res || {}
            const {
              card = {},
              businessIdentity = '',
              sign = '',
              status = '',
            } = result || {}
            if (Number(code) === 0) {
              setClaimCardModalDataInfo({
                data: [
                  {
                    expiredTimestamp: card?.expiredTimestamp,
                    id: card?.id,
                    value: card?.value,
                    flag: businessIdentity,

                    claimContract: info?.claimContract,
                    decimals: info?.decimals,
                    symbol: info?.symbol,
                    token: info?.token,
                    chainId: info?.chainId,
                  },
                ],
                sign: [sign],
                isClaimedData: status === '1',
              })
              setClaimCardModalShow(true, type)
            } else {
              util.showMessage(String(message), 'warning')
            }
          } else if (type === 'LUCKY_BAG_TASK') {
            setClaimCardModalOtherDataInfo({ distributeResult })
            setClaimCardModalShow(true, type)
          } else {
            setClaimCardModalShow(true, type)
          }
        } else {
          setClaimCardModalShow(false, type)
        }
      } catch (error) {
        console.log('error', error)
        util.showMessage(String(error), 'warning')
      }
    }, 500)
  },

  async getPrizesProjectDetail(state) {
    clearTimeout(timer2)
    timer2 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}${
          isDev() ? '/activity' : '/active-platform'
        }/projectStatus/detail?projectId=${activityProjectId}`
      )
      const res = await response.json()
      setPrizesTotaltx(res?.result?.projectDetail?.totalTxsCount)
      setPrizesProjectTaskDetailsList(
        res?.result?.projectDetail.taskDetails || []
      )
    }, 500)
  },

  async getPrizesProjectInfo(state) {
    clearTimeout(timer3)
    timer3 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}${
          isDev() ? '/activity' : '/active-platform'
        }/project/info?projectId=${activityProjectId}`
      )
      const res = await response.json()
      setPrizesProjectTime(res?.result?.end_time || '')
    }, 500)
  },
  async getPrizesProjectRank(state) {
    clearTimeout(timer4)
    timer4 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}${
          isDev() ? '/activity' : '/active-platform'
        }/competition/rankReward?projectId=${activityProjectId}`
      )
      const res = await response.json()
      setPrizesRankList(res?.result?.rankRewards || [])
      setPrizesRankRefreshTime(res?.result?.updateInfo?.lastRefreshTime || '')
    }, 500)
  },

  async getPrizesUserInfo(state, address) {
    if (!address || address === '0x') return
    clearTimeout(timer5)
    timer5 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/${
          isDev() ? 'activity' : 'active-platform'
        }/projectStatus/addressForSingle?projectId=${activityProjectId}&address=${address.toLocaleLowerCase()}`
      )
      const res = await response.json()
      const records = res?.result?.records || []
      setPrizesUserList(records)
    }, 500)
  },

  async getPrizesUserRank(state, address) {
    if (!address || address === '0x') return
    clearTimeout(timer6)
    timer6 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/${
          isDev() ? 'activity' : 'active-platform'
        }/projectStatus/addressRank?projectId=${activityProjectId}&address=${address.toLocaleLowerCase()}`
      )
      const res = await response.json()
      setPrizesUserRank(res?.result?.rank || 0)
    }, 500)
  },

  async getTaskInfoList(state) {
    clearTimeout(timer7)
    timer7 = setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_OPEN_URL}/${
            isDev() ? 'activity' : 'active-platform'
          }/project/showProjectList`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const res = await response.json()
        setQuestsInfoList(res?.result || [])
      } catch (error) {}
    }, 500)
  },
  async getUserTaskInfoList(state, { projectList, address }) {
    clearTimeout(timer8)
    const list = projectList.filter((item) => !!item)
    if (!list?.length || !address || address === '0x') return
    timer8 = setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_OPEN_URL}/${
            isDev() ? 'activity' : 'active-platform'
          }/projectStatus/addressForMutiple?projectIds=${JSON.stringify(
            list
          )}&address=${address}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const res = await response.json()
        setQuestsUserInfoList(res?.result || [])
      } catch (error) {}
    }, 500)
  },
}
