import { reactive, ref } from './'

export const lpAccountInfo = ref(null)
export const lpApiKey = ref(null)
export const web3State = reactive({
  isInstallMeta: false,
  isInjected: false,
  web3Instance: null,
  networkId: null,
  coinbase: null,
  error: null,
  localLogin: true,
  starkNet: {
    starkNetAddress: '',
    starkNetWalletName: '',
    starkWalletIcon: '',
    starkIsConnected: false,
    starkChain: '',
  },
})

export function updateCoinbase(coinbase) {
  if (!coinbase || coinbase.length === 0) {
    web3State.isInjected = false
    coinbase = '0x'
  } else {
    web3State.isInjected = true
    web3State.localLogin = true
    localStorage.setItem('localLogin', true)
  }
  updatelpAccountInfo(null)
  updatelpApiKey(null)
  if (coinbase instanceof Array) {
    web3State.coinbase = coinbase[0];
  } else {
    web3State.coinbase = coinbase;
  }
}
export function updatelpApiKey(accountInfo) {
  lpApiKey.value = accountInfo
}
export function updatelpAccountInfo(accountInfo) {
  lpAccountInfo.value = accountInfo
}

export function updateIsInstallMeta(isInstallMeta) {
  web3State.isInstallMeta = isInstallMeta
}
