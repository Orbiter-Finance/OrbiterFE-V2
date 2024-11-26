import React, { useContext } from 'react'
import { useWalletConfigContext } from '../../providers/WalletConfigProvider'
import { LoopringAPI } from './LoopringAPI'
import { AccountInfo, generatePrivateKey, get_EddsaSig_Transfer, getEdDSASig, getTransferTypedData, getUpdateAccountEcdsaTypedData, GlobalAPI, sortObjDictionary } from '@loopring-web/loopring-sdk'
import { useSignMessage, useSignTypedData } from 'wagmi'

type ActivateAccountProps = {
    token: { symbol: string, id: number },
    accInfo: AccountInfo
    keySeed: string
    fee: string
}

type UnlockApiRes = {
    apiKey?: string
    resultInfo?: {
        code: number,
        message: string
    }
}

type EddsaKey = {
    keyPair: {
        publicKeyX: string
        publicKeyY: string
        secretKey: string
    },
    formatedPx: string,
    formatedPy: string,
    sk: string
}

export type UnlockedAccount = {
    eddsaKey: EddsaKey
    apiKey: string
}

export default function useLoopring() {
    const { config } = useWalletConfigContext()
    const isMain = config?.isMainnet ?? true

    const networkId = isMain ? 1 : 11155111

    const { signMessageAsync } = useSignMessage()
    const { signTypedDataAsync } = useSignTypedData()

    async function unlockAccount(accInfo: AccountInfo, keySeed: string)
        : Promise<UnlockedAccount> {

        const loopring = new LoopringAPI(networkId)

        let keySeedStr = accInfo?.keySeed || keySeed
        const signMessage = await signMessageAsync({ message: keySeedStr })
        const eddsaKeyData = generatePrivateKey({
            sig: signMessage as string,
            counterFactualInfo: "",
            error: ""
        })
        const { sk } = eddsaKeyData
        const { accountId } = accInfo
        const url = `${loopring.baseApi}/api/v3/apiKey?accountId=${accountId}`

        const dataToSign: Map<string, any> = sortObjDictionary({ accountId })
        const eddsa = getEdDSASig(
            "GET",
            loopring.baseApi,
            "/api/v3/apiKey",
            dataToSign,
            sk
        )
        const res: UnlockApiRes = await (await fetch(url, {
            headers: {
                'X-Api-Sig': eddsa
            }
        })).json()

        if (res.apiKey) {
            return { eddsaKey: eddsaKeyData, apiKey: res.apiKey }
        }
        else {
            throw Error(`Could not unlock account, error:${res.resultInfo?.message || ' unknown'}`)
        }

    }

    async function activateAccount
        ({
            token,
            accInfo,
            keySeed,
            fee
        }: ActivateAccountProps)
        : Promise<{ x: string; y: string }> {
        const loopring = new LoopringAPI(networkId)

        const exchangeApi = loopring.exchangeAPI()

        const { exchangeInfo } = await exchangeApi.getExchangeInfo()

        const signMessage = await signMessageAsync({ message: keySeed })

        const eddsaKeyData = generatePrivateKey({
            sig: signMessage as string,
            counterFactualInfo: "",
            error: ""
        })
        const { formatedPx, formatedPy } = eddsaKeyData
        const publicKey = { x: formatedPx, y: formatedPy }
        if (!fee) {
            throw new Error(`Could not get fee for ${token.symbol.toUpperCase()}`)
        }
        const req = {
            exchange: exchangeInfo.exchangeAddress,
            owner: accInfo.owner,
            accountId: accInfo.accountId,
            publicKey,
            maxFee: {
                tokenId: token.id,
                volume: fee,
            },
            keySeed: keySeed,
            validUntil: Math.round(Date.now() / 1000) + 30 * 86400,
            nonce: accInfo.nonce as number,
        }

        const typedData = getUpdateAccountEcdsaTypedData(req, networkId)
        const ecdsaSignature = (await signTypedDataAsync(typedData as any)).slice(0, 132)

        const activationReq = await (await fetch(`${loopring.baseApi}/api/v3/account`, {
            method: "POST",
            body: JSON.stringify({ ...req, ecdsaSignature: ecdsaSignature }),
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Sig': ecdsaSignature
            }
        })).json()

        if (activationReq?.resultInfo?.message) {
            throw new Error(activationReq.resultInfo.message)
        }

        return publicKey
    }

    const loopringTransfer = async ({ fromAddress, params, value, token, makerAddress }: any) => {

        const loopring = new LoopringAPI(networkId)

        const exchangeApi = loopring.exchangeAPI()

        const userApi = loopring.userAPI()
        const globalApi = loopring.globalAPI()

        const tokens = await <any>exchangeApi.getTokens()

        const tokenAddress = token.address

        let list: any[] = []

        if (tokens?.raw_data?.length) {
            list = tokens?.raw_data || []
        } else {
            throw new Error('getLpTokenList NetWorkError')
        }
        const response = await exchangeApi.getAccount({ owner: fromAddress })

        const toResponse = await exchangeApi.getAccount({ owner: makerAddress })

        const tokenGroup = list.find((item) => item.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase())

        const tokenId = tokenGroup?.tokenId

        if (tokenGroup && (tokenId !== undefined)) {

            let accInfo: AccountInfo | undefined = undefined
            let toAccInfo: AccountInfo | undefined = undefined

            if (response?.accInfo && response?.raw_data) {
                accInfo = response.accInfo
                toAccInfo = toResponse.accInfo
            } else {
                const msg = (response as any)?.code == 101002 ? 'noAccount' : (response as any).message

                throw new Error(msg)

            }

            const { exchangeInfo } = await exchangeApi.getExchangeInfo()
            const ts = Math.round(new Date().getTime() / 1000) + 30 * 86400

            const accountId = accInfo?.accountId
            const toAccountId = toAccInfo?.accountId
            const info = await userApi?.getCounterFactualInfo({ accountId })
            const isCounterFactual = !!info?.counterFactualInfo?.walletOwner
            console.log("accInfo", accInfo, info, isCounterFactual)

            const keySeed = accInfo.keySeed && accInfo.keySeed !== ''
                ? accInfo.keySeed
                : GlobalAPI.KEY_MESSAGE.replace(
                    '${exchangeAddress}',
                    exchangeInfo.exchangeAddress
                ).replace('${nonce}', (accInfo.nonce).toString())

            if (!toAccountId) {
                throw Error("PayeeID Error: " + toAccountId)
            }


            const feeData = await globalApi.getActiveFeeInfo({
                accountId: accInfo.accountId,
            })
            console.log("feeData", feeData)
            const fee = feeData?.raw_data?.fees?.find((f: { token: string }) => f.token.toUpperCase() == tokenGroup.symbol.toUpperCase())?.fee
            console.log("fee", fee)

            if (
                accInfo.nonce === 0 &&
                accInfo.keyNonce === 0 &&
                accInfo.publicKey.x === '' &&
                accInfo.publicKey.y === '' &&
                accInfo.keySeed === ''
            ) {

                console.log("tokenGroup", tokenGroup)
                const res = await activateAccount({
                    accInfo,
                    token: {
                        id: tokenId,
                        symbol: tokenGroup.symbol
                    },
                    keySeed,
                    fee
                })
                console.log("res", res)

                // throw Error('account is not activated')
            }
            if (accInfo.frozen) {
                throw Error('User account is frozen')
            }

            const { apiKey, eddsaKey } = await unlockAccount(accInfo, keySeed)

            if (!apiKey) {
                throw Error('Get Loopring ApiKey Error')
            }
            // step 3 get storageId
            const GetNextStorageIdRequest = {
                accountId,
                sellTokenId: tokenId,
            }
            const storageId = await userApi.getNextStorageId(
                GetNextStorageIdRequest,
                apiKey
            )

            // step 4 transfer
            const OriginTransferRequestV3 = {
                exchange: exchangeInfo.exchangeAddress,
                payerAddr: fromAddress,
                payerId: accountId,
                payeeAddr: makerAddress,
                payeeId: toAccountId,
                storageId: storageId.offchainId,
                token: {
                    tokenId: tokenId,
                    volume: String(value),
                },
                maxFee: {
                    tokenId: tokenId,
                    volume: fee,
                },
                validUntil: ts,
                memo: params,
            }

            const typedData = getTransferTypedData(OriginTransferRequestV3, networkId)
            const ecdsaSignature = (await signTypedDataAsync(typedData as any)).slice(0, 132)
            const eddsaSignature = get_EddsaSig_Transfer(OriginTransferRequestV3, eddsaKey.sk).result

            const res = await (await fetch(`${loopring.baseApi}/api/v3/transfer`, {
                method: "POST",
                body: JSON.stringify({
                    ...OriginTransferRequestV3,
                    eddsaSignature,
                    ecdsaSignature: ecdsaSignature,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Api-Sig': ecdsaSignature,
                    'X-Api-Key': apiKey
                }
            })).json()

            console.log("res", res)

            return res.hash
        }
    }

    return ({
        loopringTransfer
    })

}
