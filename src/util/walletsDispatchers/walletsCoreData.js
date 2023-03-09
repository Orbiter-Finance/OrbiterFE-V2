import { reactive } from '../../composition'

// responsive data of the wallet information that already login
// change wallet will update this data
export const globalSelectWalletConf = reactive({
  walletType: '',
  walletPayload: {
    walletAddress: '',
    networkId: '',
    provider: null, // ethereum node match this wallet type
  },
  loginSuccess: false,
})

export const updateGlobalSelectWalletConf = (
  type = '',
  conf = {},
  loginSuccess = false
) => {
  globalSelectWalletConf.walletPayload = conf
  globalSelectWalletConf.walletType = type
  globalSelectWalletConf.loginSuccess = loginSuccess
}

export const updateSelectWalletConfPayload = (payload) => {
  globalSelectWalletConf.walletPayload = {
    ...globalSelectWalletConf.walletPayload,
    ...payload,
  }
}

export const updateSelectWalletAddress = (newAddress) => {
  globalSelectWalletConf.walletPayload.walletAddress = newAddress
}
