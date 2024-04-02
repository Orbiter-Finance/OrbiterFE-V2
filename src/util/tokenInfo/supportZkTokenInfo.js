import thirdapi from '../../core/actions/thirdapi'
import { store } from '../../store'
import { CHAIN_ID } from '../../config'
import { isDev, isProd } from '../env'

let isWaitingMainnetZKTokenApiResponse = false
let isWaitingRinkebyZKTokenApiResponse = false
let zkTokenTimer = null
export default {
  async getSupportZKTokenList() {
    getAllZKTokenList()
    clearInterval(zkTokenTimer)
    zkTokenTimer = setInterval(async () => {
      getAllZKTokenList()
    }, 30 * 1000)
    return zkTokenTimer
  },
}

async function getAllZKTokenList() {
  !!isProd() && !isWaitingMainnetZKTokenApiResponse && getMainnetZKTokenList()
  !!isDev() && !isWaitingRinkebyZKTokenApiResponse && getRinkebyZKTokenList()
}
async function getMainnetZKTokenList() {
  getTokenList(CHAIN_ID.zksync)
}
async function getRinkebyZKTokenList() {
  getTokenList(CHAIN_ID.zksync_test)
}
function setWaitingFlag(isMainnet, isWaiting = false) {
  isMainnet
    ? (isWaitingMainnetZKTokenApiResponse = isWaiting)
    : (isWaitingRinkebyZKTokenApiResponse = isWaiting)
}
async function getTokenList(localChainID) {
  let isContiue = true
  // var startID = 0
  const isMainnet = localChainID === CHAIN_ID.zksync
  const zktokenList = store.state.zktokenList || {}
  const list = (isMainnet ? zktokenList.mainnet : zktokenList.rinkeby) || []
  let startID = (list[list.length - 1] || {}).id || 0
  startID = startID > 0 ? startID + 1 : 0
  let zkTokenAllList = list.concat()
  try {
    let hasMore = true
    while (isContiue) {
      setWaitingFlag(isMainnet, true)
      const result = await thirdapi.getZKTokenList({
        from: startID,
        limit: 100,
        direction: 'newer',
        localChainID,
      })
      if (result.status === 'success') {
        if (result.result.list.length !== 0) {
          const zk_list = result.result.list
          if (zk_list.length !== 100) {
            isContiue = false
          } else {
            startID = result.result.list[99].id + 1
          }
          zkTokenAllList = zkTokenAllList.concat(zk_list)
        } else {
          hasMore = false
          isContiue = false
        }
      } else {
        isContiue = false
      }
      setWaitingFlag(isMainnet)
    }
    hasMore &&
      store.commit('updateZKTokenList', {
        chainID: localChainID,
        tokenList: zkTokenAllList,
      })
  } catch (error) {
    console.warn('zk_TokenListGetError =', error)
    setWaitingFlag(isMainnet)
  }
}
