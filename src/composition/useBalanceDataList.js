import { ref } from './'

export const balanceList = ref(null)
export function updateBalanceList(data) {
  balanceList.value = data
}
