import { ref } from './'

export const isStarkNetDialog = ref(false)
export const selectWalletDialogVisible = ref(false)
export const actDialogVisible = ref(false)
export const actDialogHover = ref(false)
export const actAddPointVisible = ref(false)
export const actAddPoint = ref('0')
export const actTotalPoint = ref('0')
export const actBasePoint = ref('0');
export const actTotalActivityPoint = ref('0');

export const setStarkNetDialog = (flag) => (isStarkNetDialog.value = flag)
export const setSelectWalletDialogVisible = (flag) =>
  (selectWalletDialogVisible.value = flag)
export const setActDialogVisible = (flag) =>
  (actDialogVisible.value = flag)
export const setActDialogHover = (flag) =>
  (actDialogHover.value = flag)
export const setActAddPointVisible = (flag) =>
  (actAddPointVisible.value = flag)
export const setActAddPoint = (flag) =>
  (actAddPoint.value = flag)
export const setActTotalPoint = (flag) =>
  (actTotalPoint.value = flag)
export const setActBasePoint = (flag) =>
  (actBasePoint.value = flag)
export const setActTotalActivityPoint = (flag) =>
  (actTotalActivityPoint.value = flag)
