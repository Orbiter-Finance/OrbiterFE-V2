import { TonConnectUI } from '@tonconnect/ui'

let tonConnect

const tonConnectCall = async () => {
  if (tonConnect) {
    return tonConnect
  }
  console.log('TonConnectUI', TonConnectUI)
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-wallet',
  })

  tonConnect = tonConnectUI

  return tonConnect
}

const connect = async () => {
  await (await tonConnectCall()).openModal()
}

const tonHelper = {
  tonConnectCall,
  connect,
}

export default tonHelper
