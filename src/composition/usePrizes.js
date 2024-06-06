import { ref } from './'
export const prizesTotalAddress = ref('0')
export const prizesTotalRewards = ref('0')
export const prizesRankList = ref([])
export const prizesTop100tx = ref('0')

export const prizesUserRank = ref('0')
export const prizesUserTx = ref('0')
export const prizesUserReward = ref('0')
export const prizesUserTelegramId = ref('')
export const prizesUserIsJoinTelegram = ref(false)

export const setPrizesTotalAddress = (flag) => (prizesTotalAddress.value = flag)
export const setPrizesTotalRewards = (flag) => (prizesTotalRewards.value = flag)
export const setPrizesRankList = (flag) => (prizesRankList.value = flag)
export const setPrizesTop100tx = (flag) => (prizesTop100tx.value = flag)

export const setPrizesUserRank = (flag) => (prizesUserRank.value = flag)
export const setPrizesUserTx = (flag) => (prizesUserTx.value = flag)
export const setPrizesUserReward = (flag) => (prizesUserReward.value = flag)
export const setPrizesUserTelegramId = (flag) =>
  (prizesUserTelegramId.value = flag)
export const setPrizesUserIsJoinTelegram = (flag) =>
  (prizesUserIsJoinTelegram.value = flag)
