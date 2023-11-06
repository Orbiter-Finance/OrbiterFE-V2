import { isMobile } from "../composition/useMobile";
import { getStarknet } from "get-starknet";
import { globalSelectWalletConf } from "./walletsDispatchers";

// TODO Test
export const isLocal = () => process.env.VUE_APP_ENV === 'local'
export const isDev = () => process.env.VUE_APP_ENV === 'production'
export const isProd = () => process.env.VUE_APP_ENV === 'development'
export const isL2DataDev = () => process.env.VUE_APP_L2Data_ENV === 'development'

// TODO: should check by code
export const isWebSimulation = false

export const MOBILE_APP = 'mobileApp' // mobile env
export const PC_BROWSER = 'pcBrowser' // pc browser env

export const getEnv = (key) => {
  if (key) return process.env[key]
  return process.env
}

// if u r in a mobile webview environment, return true, otherwise return false
export const isMobileEnv = () => {
  if (typeof window.okxwallet !== 'undefined') {
    return false;
  }

  if (isWebSimulation) return false
  return isMobileDevice()
}

export const isMobileDevice = () => {
  const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  return regex.test(navigator.userAgent)
}

export const isArgentApp = () => {
  return isMobile.value && !window.ethereum && getStarknet && getStarknet()?.isConnected;
};

export const isBrowserApp = () => {
  return isMobile.value && !window.ethereum && (!globalSelectWalletConf.walletPayload.walletAddress || globalSelectWalletConf.walletPayload.walletAddress === '0x');
};
