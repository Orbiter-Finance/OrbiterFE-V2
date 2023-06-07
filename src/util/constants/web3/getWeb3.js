import Web3 from 'web3'
import { store } from '../../../store'
import pollWeb3 from './pollWeb3'
import { findMatchWeb3ProviderByWalletType } from '../../walletsDispatchers/utils'
import { METAMASK } from '../../walletsDispatchers'
import { compatibleGlobalWalletConf } from '../../../composition/walletsResponsiveData'
import { updateCoinbase, updateIsInstallMeta } from '../../../composition/hooks'
import util from '../../util'
import { Notification } from 'element-ui'

const showMessage = util.showMessage

async function installWeb3() {
  const web3Provider = findMatchWeb3ProviderByWalletType(METAMASK)
  if (web3Provider) {
    try {
      await web3Provider.enable()
    } catch (error) {
      updateIsInstallMeta(true)
      updateCoinbase('')
      showMessage('User denied account access', 'error')
      return
    }
  } else {
    updateIsInstallMeta(false)
    updateCoinbase('')
    if (
      window.ethereum &&
      window.ethereum.isBlockWallet == true &&
      window.ethereum.isMetaMask === false
    ) {
      return Notification({
        title: 'Error: MetaMask has not been installed.',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'installWalletTips',
        duration: 3000,
        message:
          '<div style="font-family:Inter Regular;text-align: left;">If you already have MetaMask installed, check your browser extension settings to make sure you have it enabled and that you have disabled any other browser extension wallets.</div>',
      })
    }
    return showMessage('not install metamask', 'error')
  }
  return new Web3(web3Provider)
}

async function getWeb3() {
  const web3 = await installWeb3()
  if (!web3) {
    return
  }
  updateIsInstallMeta(true)
  await web3.eth.net.getId((error, netWorkId) => {
    if (error || !netWorkId) {
      showMessage('get netWorkID failed, refresh and try again', 'error')
      updateCoinbase('')
    } else {
      store.commit('updateNetWorkId', netWorkId.toString())
    }
  })
  await web3.eth.getCoinbase((error, coinbase) => {
    if (error || !coinbase) {
      showMessage(
        'get coinbase failed，please unlock metamask or generate a new address',
        'error'
      )
      compatibleGlobalWalletConf.value.walletPayload.provider
        .send('eth_requestAccounts')
        .then((coin) => {
          updateCoinbase(coin.result[0])
        })
        .catch((err) => {
          showMessage(err.message, 'error')
          updateCoinbase('')
        })
    } else {
      updateCoinbase(coinbase)
    }
  })
  pollWeb3()
}

const userDeniedMessage = () =>
  showMessage('User denied account access', 'error')

export { installWeb3, getWeb3, showMessage, userDeniedMessage }
