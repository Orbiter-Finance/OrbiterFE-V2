

import type { Wallet, DefaultWalletOptions } from '@rainbow-me/rainbowkit/dist/wallets/Wallet'
import { TomoWalletTgSdkV2 } from 'tomo-tg-wallet-sdk'
import type { EIP1193Provider } from 'viem'

import { createConnector } from "wagmi"
import { injected } from 'wagmi/connectors'

export const TomoWalletConnector = ({
  walletConnectParameters,
  projectId,
}: DefaultWalletOptions): Wallet => {
  let provider: unknown | EIP1193Provider
  return {
    id: 'tomo-wallet',
    name: 'Tomo Wallet',
    iconUrl: "https://tomo.inc/images/footer-logo.svg",
    iconBackground: '#000',
    installed: true,
    createConnector: (walletDetails) => {
      const connector = createConnector((config) => ({
        ...injected({
          // shimDisconnect: false

        })(config),
        ...walletDetails,
        getProvider: async () => {
          if (provider) return provider
          const sdk = new TomoWalletTgSdkV2({ 
            injected: true,
            projectId,
            metaData: {
              icon: walletConnectParameters?.metadata?.icons?.[0],
              name: walletConnectParameters?.metadata?.name,
              description: walletConnectParameters?.metadata?.description,
              url: walletConnectParameters?.metadata?.url,
            }
          })

          provider = sdk.ethereum
          return provider
        },
      }))
      return connector
    },

  }
}