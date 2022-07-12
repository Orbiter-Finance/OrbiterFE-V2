import { ref } from './'

export const curPageTabState = ref('Sender') // 'Sender' Maker

export const togglePageTab = () => curPageTabState.value = curPageTabState.value == 'Sender' ? 'Maker' : 'Sender'
export const setPageTab = (tab) => curPageTabState.value = tab
export const setPageSenderTab = () => curPageTabState.value = 'Sender'
export const isSenderTab = () => curPageTabState.value === 'Sender'
