import { MAINNET_CollectInfoDefault, TESTNET_CollectInfoDefault } from './consts'

const TESTNET = 'https://testnet-api.orbiter.finance'
const MAINNET = 'https://api.orbiter.finance'
export interface IHistory {
    status: number
    chain: string
    transferAmount: string
    txHash: string
    time: string
    id: string
}

export interface ICollectInfo {
    sourceChains: SourceChain[]
    targetChains: TargetChain[]
    collectValue: CollectValue
}

export interface SourceChain {
    chainId: string
    makerAddress: string
    tokenAddress: string
    maxPrice: string
    minPrice: string
    decimal: number
    symbol: string
}

export interface TargetChain {
    chainId: string
    withholdingFee: string
    tradeFee: string
    tieredFee: TieredFee[]
    point: number
}

export interface TieredFee {
    range: [number, number]
    tradeFee: number
    withholdingFee: number
}

export interface CollectValue {
    toCollect: string
    userToMaker: string
    makerToUser: string
}

export const fetchCollectInfo = async (isMainnet: boolean, { address }: { address: string }) => {
    const defaultResult = isMainnet ? MAINNET_CollectInfoDefault : TESTNET_CollectInfoDefault
    try {
        const respone = await fetch(
            `${isMainnet ? MAINNET : TESTNET}/bridge-api/small_coin/collect_info?address=${address}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            },
        )

        if (respone.ok) {
            const data = await respone.json()
            return data?.code === 0 ? data : defaultResult
        }
        return defaultResult
    } catch (error) {
        return defaultResult
    }
}

export const fetchHistory = async (
    isMainnet: boolean,
    { address, page, pageSize }: { address: string; page: number; pageSize: number },
) => {
    if (!address) {
        return {
            code: 0,
            result: {
                list: [],
                count: 0,
            },
        }
    }
    const respone = await fetch(
        `${isMainnet ? MAINNET : TESTNET}/bridge-api/small_coin/history?address=${address}&page=${page}&pageSize=${pageSize}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        },
    )

    if (respone.ok) {
        const data = await respone.json()
        return data
    } else {
        return {
            code: 10000,
            message: 'error',
            status: 'error',
            result: {},
        }
    }
}

export const fetchMakerHistory = async (
    isMainnet: boolean,
    { address, page, pageSize }: { address: string; page: number; pageSize: number },
) => {
    if (!address) {
        return {
            code: 0,
            result: {
                list: [],
                count: 0,
            },
        }
    }
    const respone = await fetch(
        `${isMainnet ? MAINNET : TESTNET}/bridge-api/small_coin/maker_transactions?address=${address}&page=${page}&pageSize=${pageSize}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        },
    )

    if (respone.ok) {
        const data = await respone.json()
        return data
    } else {
        return {
            code: 10000,
            message: 'error',
            status: 'error',
            result: {},
        }
    }
}

export const fetchCollect = async (
    isMainnet: boolean,
    { targetChain, token, timestamp }: { targetChain: string; token: string; timestamp: number },
) => {
    const respone = await fetch(`${isMainnet ? MAINNET : TESTNET}/bridge-api/small_coin/collect`, {
        headers: {
            'Content-Type': 'application/json',
            token: token,
        },
        method: 'POST',
        body: JSON.stringify({
            timestamp,
            targetChain,
        }),
    })

    if (respone.ok) {
        const data = await respone.json()
        return data
    } else {
        return {
            code: 10000,
            message: 'error',
            status: 'error',
            result: {},
        }
    }
}
