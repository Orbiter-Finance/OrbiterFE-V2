import { ref } from './'

export const selectWalletDialogVisible = ref(false)
export const actDialogVisible = ref(false)
export const actConnectWalletInfo = ref(null)
export const actDialogHover = ref(false)
export const actAddPointVisible = ref(false)
export const actAddPoint = ref('0')
export const actTotalPoint = ref('0')
export const actBasePoint = ref('0')
export const actTotalActivityPoint = ref('0')
export const actEcosystemPoints = ref('0')
export const actPointFetchStatus = ref(false)
export const actPointRank = ref('0')
export const connectWalletGroupKey = ref('EVM')

export const actNftList = ref([])

export const lotteryCardTotal = ref('0')
export const lotteryCardModalShow = ref(false)
export const claimCardModalShow = ref(false)

export const luckyModalShow = ref(false)

export const setLuckyModalShow = (flag) => (luckyModalShow.value = flag)

// LUCKY_BAG CARD REWARD
export const claimCardModalType = ref('REWARD')

export const claimCardModalDataInfo = ref(null)
export const claimCardModalAmountInfo = ref(null)
export const claimCardModalOtherDataInfo = ref(null)

export const userInfoDetailsCardModalShow = ref(false)
export const OPointsCardModalShow = ref(false)
export const lotteryPointsNum = ref('0')
export const lotteryCardCurrentProgress = ref('0')
export const lotteryCardProgressMax = ref('0')

export const setSelectWalletDialogVisible = (flag) =>
  (selectWalletDialogVisible.value = flag)
export const setConnectWalletGroupKey = (value) =>
  (connectWalletGroupKey.value = value)
export const setActDialogVisible = (flag) => (actDialogVisible.value = flag)
export const setActConnectWalletInfo = (flag) =>
  (actConnectWalletInfo.value = flag)

export const setActDialogHover = (flag) => (actDialogHover.value = flag)
export const setActAddPointVisible = (flag) => (actAddPointVisible.value = flag)
export const setActAddPoint = (flag) => (actAddPoint.value = flag)
export const setActTotalPoint = (flag) => (actTotalPoint.value = flag)
export const setActPointFetchStatus = (flag) =>
  (actPointFetchStatus.value = false)
export const setActPoint = (pointData) => {
  actTotalPoint.value = pointData.total
  actBasePoint.value = pointData.basePoints
  actTotalActivityPoint.value = pointData.totalActivityPoints
  actEcosystemPoints.value =
    Number(pointData?.ecosystemPoints) + Number(pointData?.dappPoints) || '0'
  actPointFetchStatus.value = true
}
export const setActPointRank = (flag) => (actPointRank.value = flag)

export const setActNftList = (nftList) => {
  actNftList.value = nftList
}

export const setLotteryCardTotal = (flag) => (lotteryCardTotal.value = flag)
export const setLotteryCardModalShow = (flag) =>
  (lotteryCardModalShow.value = flag)

/**
 *
 * @param {*} flag true | false
 * @param {*} type LUCKY_BAG | CARD | REWARD
 */
export const setClaimCardModalShow = (flag, type = '') => {
  claimCardModalShow.value = flag
  claimCardModalType.value = type
}

export const setClaimCardModalDataInfo = (data) =>
  (claimCardModalDataInfo.value = data)

export const setClaimCardModalAmountInfo = (data) =>
  (claimCardModalAmountInfo.value = data)

export const setClaimCardModalOtherDataInfo = (data) =>
  (claimCardModalOtherDataInfo.value = data)

export const setUserInfoDetailsCardModalShow = (flag) =>
  (userInfoDetailsCardModalShow.value = flag)
export const setOPointsCardModalShow = (flag) =>
  (OPointsCardModalShow.value = flag)

export const setLotteryPointsNum = (flag) => (lotteryPointsNum.value = flag)
export const setLotteryCardDataGroup = (dataGroup) => {
  lotteryCardTotal.value = dataGroup.lotteryCardTotal
  lotteryCardModalShow.value = dataGroup.lotteryCardModalShow
  lotteryPointsNum.value = dataGroup.lotteryPointsNum
}

export const setLotteryCardProgress = (dataGroup) => {
  lotteryCardCurrentProgress.value = dataGroup.lotteryCardCurrentProgress
  lotteryCardProgressMax.value = dataGroup.lotteryCardProgressMax
}

export const luckyBaTaskgOrbguyInfo = ref(null)
export const luckyBaTaskgUserOrbguyInfo = ref([])
export const setLuckyBaTaskgOrbguyInfo = (data) => {
  luckyBaTaskgOrbguyInfo.value = data
}
export const setLuckyBaTaskgUserOrbguyInfo = (data) => {
  luckyBaTaskgUserOrbguyInfo.value = data
}
