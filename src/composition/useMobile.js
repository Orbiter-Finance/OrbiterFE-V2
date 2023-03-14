import { ref } from './'

export const isMobile = ref(false)
export const setMobileOrNot = (_isMobile) => {
  isMobile.value = _isMobile
}
