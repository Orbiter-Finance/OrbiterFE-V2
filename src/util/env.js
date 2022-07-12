export const isLocal = () => !process.env.NODE_ENV
export const isDev = () => process.env.NODE_ENV === 'development'
export const isProd = () => process.env.NODE_ENV === 'production'

export const MOBILE_APP = "mobileApp"; // mobile env
export const PC_BROWSER = "pcBrowser"; // pc browser env

export const getEnv = (key) => {
  if (key) return process.env[key]
  return process.env
}

// if u r in a mobile webview environment, return true, otherwise return false
export const isMobileEnv = () => {
  const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return regex.test(navigator.userAgent);
}