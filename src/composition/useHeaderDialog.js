import { ref } from './'

export const isStarkNetDialog = ref(false)
export const selectWalletDialogVisible = ref(false)
export const actDialogVisible = ref(false)
export const actDialogHover = ref(false)

export const setStarkNetDialog = (flag) => (isStarkNetDialog.value = flag)
export const setSelectWalletDialogVisible = (flag) =>
  (selectWalletDialogVisible.value = flag)
export const setActDialogVisible = (flag) =>
  (actDialogVisible.value = flag)
export const setActDialogHover = (flag) =>
  (actDialogHover.value = flag)
