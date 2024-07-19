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
export const prizesTimeEnd = ref(false)

export const prizesRewardList = ref([
  {
    symbol: '',
    quantity: '',
  },
])
export const prizesRewardIsFetch = ref(false)

export const prizesV2TaskList = ref([])
export const prizesV2RankList = ref([])
export const prizesV2ProjectTaskDetailsList = ref([])
export const prizesV2UserRank = ref('')
export const prizesV2TotalOrbguy = ref('')
export const prizesV2UserList = ref([])
export const prizesV2ProjectTime = ref('')
export const prizesV2TimeEnd = ref(false)

export const setPrizesTotalAddress = (flag) => (prizesTotalAddress.value = flag)
export const setPrizesTotalRewards = (flag) => (prizesTotalRewards.value = flag)
export const setPrizesRankList = (flag) => (prizesRankList.value = flag)
export const setPrizesTop100tx = (flag) => (prizesTop100tx.value = flag)
export const setPrizesTimeEnd = (flag) => (prizesTimeEnd.value = flag)

export const setPrizesUserRank = (flag) => (prizesUserRank.value = flag)
export const setPrizesUserTx = (flag) => (prizesUserTx.value = flag)
export const setPrizesUserReward = (flag) => (prizesUserReward.value = flag)
export const setPrizesUserTelegramId = (flag) =>
  (prizesUserTelegramId.value = flag)
export const setPrizesUserIsJoinTelegram = (flag) =>
  (prizesUserIsJoinTelegram.value = flag)

export const setPrizesRewardList = (flag) => (prizesRewardList.value = flag)
export const setPrizesRewardIsFetch = (flag) =>
  (prizesRewardIsFetch.value = flag)

export const setPrizesV2TaskList = (flag) => (prizesV2TaskList.value = flag)
export const setPrizesV2RankList = (flag) => (prizesV2RankList.value = flag)
export const setPrizesV2ProjectTaskDetailsList = (flag) =>
  (prizesV2ProjectTaskDetailsList.value = flag)
export const setPrizesV2UserRank = (flag) => (prizesV2UserRank.value = flag)
export const setPrizesV2TotalOrbguy = (flag) =>
  (prizesV2TotalOrbguy.value = flag)
export const setPrizesV2UserList = (flag) => (prizesV2UserList.value = flag)
export const setPrizesV2ProjectTime = (flag) =>
  (prizesV2ProjectTime.value = flag)
export const setPrizesV2TimeEnd = (flag) => (prizesV2TimeEnd.value = flag)
