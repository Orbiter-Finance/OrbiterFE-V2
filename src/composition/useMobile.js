import { ref } from './'

export const isMobile = ref(false)
export const isHomePageMobile = ref(false)

export const setMobileOrNot = (_isMobile) => {
  isMobile.value = _isMobile
}
export const setIsHomePageMobile = (_isHomePageMobile) => {
  isHomePageMobile.value = _isHomePageMobile
}
