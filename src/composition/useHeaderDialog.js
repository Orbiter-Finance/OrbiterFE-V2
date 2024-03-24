import { ref } from './'

export const isStarkNetDialog = ref(false)
export const isSolanaDialog = ref(false)
export const selectWalletDialogVisible = ref(false)
export const actDialogVisible = ref(false)
export const actDialogHover = ref(false)
export const actAddPointVisible = ref(false)
export const actAddPoint = ref('0')
export const actTotalPoint = ref('0')
export const actBasePoint = ref('0')
export const actTotalActivityPoint = ref('0')
export const actEcosystemPoints = ref('0')
export const connectWalletGroupKey = ref('EVM')

export const actNftList = ref([])

export const lotteryCardTotal = ref('0')
export const lotteryCardModalShow = ref(false)
export const lotteryPointsNum = ref('0')
export const lotteryCardCurrentProgress = ref('0')
export const lotteryCardProgressMax = ref('0')

export const setStarkNetDialog = (flag) => (isStarkNetDialog.value = flag)
export const setSolanaDialog = (flag) => (isSolanaDialog.value = flag)
export const setSelectWalletDialogVisible = (flag) =>
  (selectWalletDialogVisible.value = flag)
export const setConnectWalletGroupKey = (value) =>
  (connectWalletGroupKey.value = value)
export const setActDialogVisible = (flag) => (actDialogVisible.value = flag)
export const setActDialogHover = (flag) => (actDialogHover.value = flag)
export const setActAddPointVisible = (flag) => (actAddPointVisible.value = flag)
export const setActAddPoint = (flag) => (actAddPoint.value = flag)
export const setActTotalPoint = (flag) => (actTotalPoint.value = flag)
export const setActPoint = (pointData) => {
  actTotalPoint.value = pointData.total
  actBasePoint.value = pointData.basePoints
  actTotalActivityPoint.value = pointData.totalActivityPoints
  actEcosystemPoints.value = pointData.ecosystemPoints || '0'
}
export const setActNftList = (nftList) => {
  actNftList.value = nftList
}

export const setLotteryCardTotal = (flag) => (lotteryCardTotal.value = flag)
export const setLotteryCardModalShow = (flag) =>
  (lotteryCardModalShow.value = flag)
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
