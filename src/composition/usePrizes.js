import { ref } from './'

export const prizesTotaltx = ref('')
export const prizesTotalAddress = ref('')
export const prizesRankList = ref([])

export const prizesUserRank = ref('')
export const prizesUserList = ref([])
export const prizesProjectTime = ref('')
export const prizesRankRefreshTime = ref('')
export const prizesTimeEnd = ref(false)

export const setPrizesTotaltx = (flag) => (prizesTotaltx.value = flag)
export const setPrizesTotalAddress = (flag) => (prizesTotalAddress.value = flag)
export const setPrizesRankList = (flag) => (prizesRankList.value = flag)

export const setPrizesUserRank = (flag) => (prizesUserRank.value = flag)
export const setPrizesUserList = (flag) => (prizesUserList.value = flag)
export const setPrizesProjectTime = (flag) => (prizesProjectTime.value = flag)
export const setPrizesRankRefreshTime = (flag) =>
  (prizesRankRefreshTime.value = flag)
export const setPrizesTimeEnd = (flag) => (prizesTimeEnd.value = flag)
