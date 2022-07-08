import { ref } from './'

export const curPageTabState = ref('Sender') // 'Sender' Maker

export const togglePageTab = () => curPageTabState.value = curPageTabState.value == 'Sender' ? 'Maker' : 'Sender'
