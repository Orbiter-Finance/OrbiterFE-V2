import { isDev, toggleBodyCls } from '../../util'
import {
  updatelpApiKey,
  updatelpAccountInfo,
  web3State,
  setClaimCardModalShow,
  setClaimCardModalDataInfo,
  setPrizesUserRank,
  setPrizesUserTx,
  setPrizesUserReward,
  setPrizesUserTelegramId,
  setPrizesUserIsJoinTelegram,
  setPrizesTotalAddress,
  setPrizesTotalRewards,
  setPrizesRankList,
  setPrizesTop100tx,
  claimCardModalDataInfo,
  claimCardModalAmountInfo,
  setClaimCardModalAmountInfo,
  setLuckyBaTaskgOrbguyInfo,
  setLuckyBaTaskgUserOrbguyInfo,
  setClaimCardModalOtherDataInfo,
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

const activityProjectId = '5f622f2c-10d5-45b9-ab4d-c76f8d4a0086'

let timer
let timer1
let timer2

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

  async getPrizesuserInfo(state, address) {
    if (!address || address === '0x') return
    const response = await fetch(
      `${
        process.env.VUE_APP_OPEN_URL
      }/points_platform/competition/address?address=${address.toLocaleLowerCase()}`
    )
    const { result } = await response.json()
    const { count, rank, reward, isJoinTelegram, telegramId } = result || {}

    setPrizesUserRank(rank || '0')
    setPrizesUserTx(count || '0')
    setPrizesUserReward(reward || '0')
    setPrizesUserTelegramId(telegramId || '')
    setPrizesUserIsJoinTelegram(!!isJoinTelegram)
  },

  async getPrizesData() {
    const response = await fetch(
      `${process.env.VUE_APP_OPEN_URL}/points_platform/competition/info`
    )
    const { result } = await response.json()
    const { addressCount, totalRewards, txCount, list } = result || {}

    setPrizesTotalAddress(addressCount ? String(addressCount) : '0')
    setPrizesTotalRewards(totalRewards ? String(totalRewards) : '0')
    // this.txCount = txCount ? String(txCount) : '0'
    setPrizesRankList(list)
    setPrizesTop100tx(list[list?.length - 1 || 0]?.count || 0)
  },

  async getLuckyBagTaskInfo() {
    const response = await fetch(
      `${process.env.VUE_APP_OPEN_URL}/${
        isDev() ? 'activity' : 'active-platform'
      }/project/condition?projectId=${activityProjectId}&name=orbguy`
    )
    const res = await response.json()

    const data = res?.result || {}

    const current = Number(data?.count) || 0
    const total = Number(data?.target) || 0

    let ratio = total > 0 ? current / total : 0

    setLuckyBaTaskgOrbguyInfo({
      total,
      current,
      progressRatio: ratio,
    })
  },

  async getLuckyBagUserTaskInfo(state, address) {
    if (!address || address === '0x') return
    clearTimeout(timer1)
    timer1 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/${
          isDev() ? 'activity' : 'active-platform'
        }/project/tasksStatus?projectId=${activityProjectId}&address=${address.toLocaleLowerCase()}`
      )
      const res = await response.json()
      setLuckyBaTaskgUserOrbguyInfo(
        res?.result?.records?.map((item) => {
          const list = JSON.parse(item.distribute_result || JSON.stringify([]))
          const data = list.filter(
            (option) => option.name.toLocaleLowerCase() === 'orbguy'
          )[0]
          return {
            taskResult: Number(item?.task_result) || 0,
            distributeResult: Number(data?.amount) || 0,
            distributed: !!item?.distributed,
          }
        }) || []
      )
    }, 500)
  },

  async getLuckyBagTaskUserOPointsInfo(state, address) {
    if (!address || address === '0x') return

    clearTimeout(timer2)
    timer2 = setTimeout(async () => {
      const response = await fetch(
        `${process.env.VUE_APP_OPEN_URL}/${
          isDev() ? 'activity' : 'active-platform'
        }/account/getAccountReward?address=${activityProjectId}&rewardType=1&rewardName=opoint`
      )
      const res = await response.json()
      console.log('res', res)
    }, 500)
  },
}
