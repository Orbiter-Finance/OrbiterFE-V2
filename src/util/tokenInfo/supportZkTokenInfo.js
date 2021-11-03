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
  let req = {
    localChainID: localChainID,
    from: 0,
    limit: 100,
    direction: 'newer',
  }
  try {
    let zk_tokenList = await thirdapi.getZKTokenList(req)
    if (
      zk_tokenList.status === 'success' &&
      zk_tokenList.result.list.length !== 0
    ) {
      let zk_list = zk_tokenList.result.list
      let zkTokenResult = {
        chainID: localChainID,
        tokenList: zk_list,
      }
      store.commit('updateZKTokenList', zkTokenResult)
    }
  } catch (error) {
    console.log('zk_TokenListGetError =', error)
  }
}
