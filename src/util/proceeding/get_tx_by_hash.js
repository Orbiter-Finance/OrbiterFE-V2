import axios from 'axios'
import config from '../../core/utils/config'
import util from "../util"


export async function getTimeStampInfo(chainId, hash,blockNo, count = 30) {
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
                return await polygonTimeStampInfo(chainId, blockNo)
            case 10:
            case 510:
                return await metisTimeStampInfo(chainId, hash)
        }
    } catch (error) {
        console.warn(`chainId${chainId}:get TimeStamp error`, error.message)
        count--;
        console.warn(`count`, count)
        if (count >= 0) {
            await util.sleep(1000)
            return await getTimeStampInfo(chainId, hash,blockNo, count)
        } else {
            throw new Error(`get timeStamp error --> chainId: ${chainId},hash: ${hash}`)
        }
    }

}


async function ethOrRinkebyTimeStampInfo(chainId, hash) {
    const url = `${chainId === 5 ? config.etherscan.Rinkeby : config.etherscan.Mainnet
        }?module=account&action=txlistinternal&txhash=${hash}&apikey=${process.env.VUE_APP_ETH_KEY}`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data[0]
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}
async function arbitrumTimeStampInfo(chainId, hash) {
    const url = `${chainId === 22 ? config.arbitrum.Rinkeby : config.arbitrum.Mainnet
        }?module=account&action=txlistinternal&txhash=${hash}&apikey=${process.env.VUE_APP_AR_KEY}`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data[0]
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}
async function polygonTimeStampInfo(chainId, blockNo) {

    const url = `${chainId === 66 ? config.polygon.Rinkeby : config.polygon.Mainnet
        }?module=block&action=getblockreward&blockno=${blockNo}&apikey=${process.env.VUE_APP_PO_KEY}`
    console.warn(chainId, url, '----chainId---url--------')
    const response = await axios.get(url)
    console.warn(chainId, response, '-----chainId---response-----')
    if (response.status === 200 && response.data.status == 1) {
        return response.data.result?.timeStamp
    } else {
        throw new Error("polygonTimeStampInfo get nothing")
    }

}
async function metisTimeStampInfo(chainId, hash) {
    const url = `${chainId === 510 ? config.metis.Rinkeby : config.metis.Mainnet
        }?module=transaction&action=gettxinfo&txhash=${hash}`
    const response = await axios.get(url)
    if (response.status === 200 && response.data.status == 1) {
        return response.data.result?.timeStamp
    } else {
        throw new Error("metisTimeStampInfo get nothing")
    }
}
async function zkSyncTimeStampInfo(chainId, hash) {
    const url = `${chainId === 33 ? config.zkSync.Rinkeby
        : config.zkSync.Mainnet
        }/transactions/${hash} /data`
    const response = await axios.get(url)
    if (response.status === 200) {
        return response.data
    } else {
        throw new Error("zkSynctimeStampInfo get error")
    }
}