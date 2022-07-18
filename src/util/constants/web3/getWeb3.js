import Web3 from 'web3'
import { store } from '../../../store'
import pollWeb3 from './pollWeb3'
import { findMatchWeb3ProviderByWalletType } from '../../walletsDispatchers/utils';
import { METAMASK } from "../../walletsDispatchers"
import { compatibleGlobalWalletConf } from "../../../composition/walletsResponsiveData"
import { updateCoinbase, updateIsInstallMeta } from '../../../composition/hooks'
import util from '../../util'

const showMessage = util.showMessage

async function installWeb3() {
  var web3Provider = findMatchWeb3ProviderByWalletType(METAMASK);
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
    showMessage('not install metamask', 'error')
    return
  }
  return new Web3(web3Provider)
}

async function getWeb3() {
  var web3 = await installWeb3()
  if (!web3) {
    return
  }
  updateIsInstallMeta(true)
  await web3.eth.net.getId((error, netWorkId) => {
    if (error || !netWorkId) {
      showMessage('get netWorkID failed, refresh and try again', 'error')
      updateCoinbase('')
      return
    } else {
      store.commit('updateNetWorkId', netWorkId.toString())
    }
  })
  await web3.eth.getCoinbase((error, coinbase) => {
    console.log('coinbase=', coinbase, error)
    if (error || !coinbase) {
      showMessage(
        'get coinbase failed，please unlock metamask or generate a new address',
        'error'
      )
      compatibleGlobalWalletConf.value.walletPayload.provider
        .send('eth_requestAccounts')
        .then((coin) => {
          // console.log('result =', coin.result)
          updateCoinbase(coin.result[0])
        })
        .catch((err) => {
          console.log('err =', err)
          showMessage(err.message, 'error')
          updateCoinbase('')
        })
    } else {
      // showMessage(`get address ${coinbase}`, 'success')
      updateCoinbase(coinbase)
      // console.log('account =', web3.eth.accounts)
    }
  })
  pollWeb3()
}

const userDeniedMessage = () => showMessage('User denied account access', 'error');

export { installWeb3, getWeb3, showMessage, userDeniedMessage }
