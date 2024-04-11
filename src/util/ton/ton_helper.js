import TonConnectUI from '@tonconnect/ui'

const tonConnect = () => {
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://<YOUR_APP_URL>/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-wallet',
  })

  console.log('tonConnectUI', tonConnectUI)
}

const tonHelper = {
  tonConnect,
}

export default tonHelper
