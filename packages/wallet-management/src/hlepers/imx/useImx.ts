import { ImmutableXMainnetConfig, ImmutableXTestnetConfig } from './config'
import { BigNumberT, ERC20TokenType, ETHTokenType, Link } from '@imtbl/imx-sdk'
import { ImmutableXClient } from '@imtbl/imx-sdk'
import { useContext, useRef } from 'react'
import { useEthersSigner } from '../ethersToViem6/ethers6'
import { useWalletConfigContext } from '../../providers/WalletConfigProvider'

export default function useImx() {
    const imxClient = useRef<any>()
    const signer = useEthersSigner()
    const { config } = useWalletConfigContext()
    const isMain = config?.isMainnet ?? true

    const imxTransfer = async (params: any) => {
        const { fromAddress, isMainnet, value, ...rest } = params
        // const fromAddress = '0x0bb902fc9e168343a19d622e79ce033452e64dd8'
        // const isMainnet = true
        // const value = 6000052600000000
        // const rest = {
        //     chainId: 'immutableX_test',
        //     makerAddress: '0x4eaf936c172b5e5511959167e8ab4f7031113ca3',
        //     token: {
        //         address: '0x0000000000000000000000000000000000000000',
        //         symbol: 'ETH',
        //         decimals: 18,
        //     },
        // }

        const config = isMain ? ImmutableXMainnetConfig : ImmutableXTestnetConfig
        const contractAddress = rest.token.address
        if (!imxClient.current) {
            imxClient.current = await ImmutableXClient.build({
                publicApiUrl: config.apiUri,
                // @ts-ignore
                signer,
                starkContractAddress: config.starkContractAddress,
                registrationContractAddress: config.registrationContractAddress,
            })
        }

        let tokenInfo: any = {
            type: ETHTokenType.ETH,
            data: {
                decimals: rest.token.decimals,
            },
        }
        if (!isMainnet) {
            tokenInfo = {
                type: ERC20TokenType.ERC20,
                data: {
                    symbol: rest.token.symbol,
                    decimals: rest.token.decimals,
                    token: contractAddress,
                },
            }
        }

        const resp = await imxClient.current.transfer({
            sender: fromAddress,
            token: tokenInfo,
            quantity: value,
            receiver: rest.makerAddress,
        })
        return resp?.transfer_id?.toString()
    }
    return {
        imxTransfer,
    }
}
