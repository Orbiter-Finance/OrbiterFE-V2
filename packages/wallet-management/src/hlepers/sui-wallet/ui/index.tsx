import React from 'react'
import { useWalletConnectContext } from '../../../providers/WalletConnectProvider'
import { ConnectModal } from "@suiet/wallet-kit"
import "@suiet/wallet-kit/style.css"

export const SUI_WALLET_TYPE = "Sui"


export default function SuiWallet() {

    const { walletType, setWalletType } = useWalletConnectContext()

    return (
        <ConnectModal
            open={SUI_WALLET_TYPE === walletType}
            onOpenChange={(open: boolean) => {
                if (!open) {
                    setWalletType('')
                }
            }}
            onConnectError={(error)=>{
                console.log("1111111111 error", error)
                setWalletType('')
            }}
            onConnectSuccess={()=>{
                setWalletType('')
            }}
        ></ConnectModal>
    )
}
