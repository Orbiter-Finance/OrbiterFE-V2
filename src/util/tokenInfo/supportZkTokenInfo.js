import thirdapi from '../../core/actions/thirdapi'
import { store } from '../../store'

export default {
  async getSupportZKTokenList() {
    getTokenList(3)
    getTokenList(33)
    setInterval(async () => {
      getTokenList(3)
      getTokenList(33)
    }, 30 * 1000)
  },
}

async function getTokenList(localChainID) {
  if (localChainID !== 3 && localChainID !== 33) {
    return
  }
  var isContiue = true
  var startID = 0
  var zkTokenAllList = []
  try {
    while (isContiue) {
      var zkTokenListReq = {
        from: startID,
        limit: 100,
        direction: 'newer',
        localChainID: localChainID,
      }
      let result = await thirdapi.getZKTokenList(zkTokenListReq)
      if (result.status === 'success' && result.result.list.length !== 0) {
        let zk_list = result.result.list
        if (zk_list.length !== 100) {
          isContiue = false
        } else {
          startID = result.result.list[99].id + 1
        }
        zkTokenAllList = zkTokenAllList.concat(zk_list)
      }
    }
    let zkTokenResult = {
      chainID: localChainID,
      tokenList: zkTokenAllList,
    }
    store.commit('updateZKTokenList', zkTokenResult)
  } catch (error) {
    console.warn('zk_TokenListGetError =', error)
  }
}
