import axios from 'axios'
import config from '../../core/utils/config'
import { sleep } from "../../util"


export async function getTimeStampInfo(chainId, hash, count = 5) {
    try {
        switch (chainId) {
            case 3:
            case 33:
                return await zkSyncTimeStampInfo(chainId, hash)
            case 1:
            case 5:
                return await ethOrRinkebyTimeStampInfo(chainId, hash)
            case 2:
            case 22:
                return await arbitrumTimeStampInfo(chainId, hash)
            case 6:
            case 66:
                return await polygonTimeStampInfo(chainId, hash)
            case 10:
            case 510:
                return await metisTimeStampInfo(chainId, hash)
        }
    } catch (error) {
        count--;
        if (count > 0) {
            await sleep(100)
            await getTimeStampInfo(chainId, hash, count)
        } else {
            throw new Error(`get timeStamp error --> chainId: ${chainId},hash: ${hash}`)
        }
    }

}


async function ethOrRinkebyTimeStampInfo(chainId, hash) {
    const url = `${chainId === 5 ? config.etherscan.Rinkeby : config.etherscan.Mainnet}
    ?module=account&action=txlistinternal&txhash=${hash}&apikey=${process.env.VUE_APP_ETH_KEY}`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data[0]
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}
async function arbitrumTimeStampInfo(chainId, hash) {
    const url = `${chainId === 22 ? config.arbitrum.Rinkeby : config.arbitrum.Mainnet}
    ?module=account&action=txlistinternal&txhash=${hash}&apikey=${process.env.VUE_APP_AR_KEY}`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data[0]
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}
async function polygonTimeStampInfo(chainId, hash) {
    const url = `${chainId === 66 ? config.polygon.Rinkeby : config.polygon.Mainnet}
    ?module=account&action=txlistinternal&txhash=${hash}&apikey=${process.env.VUE_APP_PO_KEY}`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data[0]
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}
async function metisTimeStampInfo(chainId, hash) {
    const url = `${chainId === 510 ? config.metis.Rinkeby : config.metis.Mainnet}
    ?module=transaction&action=gettxinfo&txhash=${hash}`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}
async function zkSyncTimeStampInfo(chainId, hash) {
    const url = `${chainId === 33 ? config.zkSync.Rinkeby
        : config.zkSync.Mainnet
        } /transactions/${hash} /data`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}