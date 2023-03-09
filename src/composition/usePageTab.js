import { ref, reactive } from './'
import { transferDataState, updateTransferDataState } from './useTransferData'

export const curPageTabState = ref('Sender') // 'Sender' Maker
export const curPageStatus = ref('1') // 1 transfer 2.confirm 3.proceed

export const togglePageTab = () =>
  (curPageTabState.value =
    curPageTabState.value == 'Sender' ? 'Maker' : 'Sender')
export const setPageTab = (tab) => {
  // in mobile ui
  if (tab === 'Maker') {
    saveSenderPageWorkingState()
    changeCurPageStatus('1')
  } else {
    recoverSenderPageWorkingState()
  }
  curPageTabState.value = tab
}
export const setPageSenderTab = () => (curPageTabState.value = 'Sender')
export const isSenderTab = () => curPageTabState.value === 'Sender'
export const changeCurPageStatus = (newStatus) =>
  (curPageStatus.value = newStatus)
export const senderPageWorkingState = reactive({})

let tmpCurPageStatus = null
let tmpTransferDataState = {}
export const saveSenderPageWorkingState = () => {
  tmpCurPageStatus = curPageStatus.value
  tmpTransferDataState = {
    ...transferDataState,
  }
}
export const recoverSenderPageWorkingState = () => {
  tmpCurPageStatus && (curPageStatus.value = tmpCurPageStatus)
  updateTransferDataState(tmpTransferDataState)
}
