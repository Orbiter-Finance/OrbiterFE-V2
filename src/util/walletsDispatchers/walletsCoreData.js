import { reactive } from "../../composition";

// responsive data of the wallet information that already login
// change wallet will update this data
export const globalSelectWalletConf = reactive({
    walletType: "",
    walletPayload: {},
    loginSuccess: false
})

export const updateGlobalSelectWalletConf = (type = "", conf = {}, loginSuccess = false) => {
    globalSelectWalletConf.walletPayload = conf;
    globalSelectWalletConf.walletType = type;
    globalSelectWalletConf.loginSuccess = loginSuccess;
}