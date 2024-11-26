import React, { useContext } from 'react'
import { orbiterZksync } from "@orbiter-finance/orbiter-zksync"
import { useWalletConfigContext } from '../../providers/WalletConfigProvider'
import { useEthersSigner5 } from '../ethersToViem5/ethers5'

export default function useZksyncLite() {

    const { config } = useWalletConfigContext()
    const isMain = config?.isMainnet ?? true

    const EthersSigner = useEthersSigner5()

    const zksyncLiteTransfer = async ({ value, makerAddress, token }: any) => {
        let syncProvider: orbiterZksync.Provider
        console.log("EthersSigner", EthersSigner)

        if (!isMain) {
            syncProvider = await orbiterZksync.getDefaultProvider("sepolia")
        } else {
            syncProvider = await orbiterZksync.getDefaultProvider("mainnet")
        }
        console.log("syncProvider", syncProvider)

        try {
            let res = ""
            if (!EthersSigner) return ""
            const syncWallet = await orbiterZksync.Wallet.fromEthSigner(
                EthersSigner as any,
                syncProvider
            )
            console.log("syncWallet", syncWallet)

            const amount = orbiterZksync.utils.closestPackableTransactionAmount(
                value
              )

            const transfer = await syncWallet.syncTransfer({
                to: makerAddress,
                token: token.address,
                amount,
            })
            console.log("transfer", transfer)

            const transferReceipt = await transfer.awaitReceipt()
            console.log("transferReceipt", transferReceipt)
            if (transferReceipt.success && !transferReceipt.failReason) {
                res = transfer.txHash
            }
            return res
        } catch (error) {
            throw Error((error as any)?.message ? String((error as any)?.message) : String(error))
        }
    }

    return ({
        zksyncLiteTransfer
    })
}
