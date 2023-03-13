import axios from 'axios'
import config from '../../core/utils/config'
import util from '../util'

export async function getTimeStampInfo(chainId, hash, blockNo, count = 30) {
  try {
    switch (chainId) {
      case 3:
      case 33:
        return await zkSyncTimeStampInfo(chainId, hash)
      case 1:
      case 5:
        return await ethOrRinkebyTimeStampInfo(chainId, blockNo)
      case 2:
      case 22:
        return await arbitrumTimeStampInfo(chainId, blockNo)
      case 6:
      case 66:
        return await polygonTimeStampInfo(chainId, blockNo)
      case 10:
      case 510:
        return await metisTimeStampInfo(chainId, hash)
    }
  } catch (error) {
    count--
    if (count >= 0) {
      await util.sleep(1000)
      return await getTimeStampInfo(chainId, hash, blockNo, count)
    } else {
      console.warn(`chainId${chainId}:get TimeStamp error`, error.message)
      return undefined
    }
  }
}

async function ethOrRinkebyTimeStampInfo(chainId, blockNo) {
  const url = `${
    chainId === 5 ? config.etherscan.TestNet : config.etherscan.Mainnet
  }?module=block&action=getblockreward&blockno=${blockNo}&apikey=${
    process.env.VUE_APP_ETH_KEY
  }`

  const response = await axios.get(url)

  if (response.status === 200 && response.data.status == 1) {
    return response.data.result?.timeStamp
  } else {
    throw new Error('zkSynctimeStampInfo get error')
  }
}
async function arbitrumTimeStampInfo(chainId, blockNo) {
  const url = `${
    chainId === 22 ? config.arbitrum.Rinkeby : config.arbitrum.Mainnet
  }?module=block&action=getblockreward&blockno=${blockNo}&apikey=${
    process.env.VUE_APP_AR_KEY
  }`
  const response = await axios.get(url)
  if (response.status === 200) {
    return response.data.result?.timeStamp
  } else {
    throw new Error('arbitrumTimeStampInfo get error')
  }
}
async function polygonTimeStampInfo(chainId, blockNo) {
  const url = `${
    chainId === 66 ? config.polygon.Rinkeby : config.polygon.Mainnet
  }?module=block&action=getblockreward&blockno=${blockNo}&apikey=${
    process.env.VUE_APP_PO_KEY
  }`
  const response = await axios.get(url)
  if (response.status === 200 && response.data.status == 1) {
    return response.data.result?.timeStamp
  } else {
    throw new Error('polygonTimeStampInfo get nothing')
  }
}
async function metisTimeStampInfo(chainId, hash) {
  const url = `${
    chainId === 510 ? config.metis.Rinkeby : config.metis.Mainnet
  }?module=transaction&action=gettxinfo&txhash=${hash}`
  const response = await axios.get(url)
  if (response.status === 200 && response.data.status == 1) {
    return response.data.result?.timeStamp
  } else {
    throw new Error('metisTimeStampInfo get nothing')
  }
}
async function zkSyncTimeStampInfo(chainId, hash) {
  const url = `${
    chainId === 33 ? config.zkSync.TestNet : config.zkSync.Mainnet
  }/transactions/${hash} /data`
  const response = await axios.get(url)
  if (response.status === 200 && response.data.status == 'success') {
    return response.data.result && response.data.result.tx
      ? Date.parse(new Date(response.data.result.tx.createdAt)) / 1000
      : undefined
  } else {
    throw new Error('zkSynctimeStampInfo get error')
  }
}
