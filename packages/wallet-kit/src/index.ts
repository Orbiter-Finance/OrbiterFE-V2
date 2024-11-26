export const name = 'Wallet';
import { OrbiterWagmiProvider } from './providers/wagmiProvider'
// import { OrbiterStarknetProvider } from './providers/starknetProvider'
import { useWallet } from './hook/useWallet'
import { WaleltConnectButton } from './components/connectButton'
export {
    OrbiterWagmiProvider,
    // OrbiterStarknetProvider,
    WaleltConnectButton,
    useWallet
}