import { ref } from './'

export const isStarkNetDialog = ref(false)
export const selectWalletDialogVisible = ref(false)

export const setStarkNetDialog = (flag) => (isStarkNetDialog.value = flag)
export const setSelectWalletDialogVisible = (flag) =>
  (selectWalletDialogVisible.value = flag)
