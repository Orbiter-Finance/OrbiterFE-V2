import util from '../util'
import axios from 'axios'
import config from '../../core/utils/config'
import { store } from '../../store'
export default {
    async getSupportZk2TokenList() {
        await getAllZk2TokenList(14)
        await getAllZk2TokenList(514)
        await util.sleep(30 * 1000)
        this.getSupportZk2TokenList()
    },
}

async function getAllZk2TokenList(localChainID) {
    if (localChainID !== 14 && localChainID !== 514) {
        return
    }
    let isContiue = true
    let startID = 0
    let zk2TokenAllList = []
    try {
        while (isContiue) {
            var zksTokenListReq = {
                from: startID,
                limit: 100,
                direction: 'newer',
                localChainID: localChainID,
            }
            let zk2List = await getZK2TokenList(zksTokenListReq)
            if (zk2List.length !== 100) {
                isContiue = false
            } else {
                startID = zk2List[99].id + 1
            }
            zk2TokenAllList = zk2TokenAllList.concat(zk2List)
        }
        let zk2TokenResult = {
            chainID: localChainID,
            tokenList: zk2TokenAllList,
        }
        store.commit('updateZk2TokenList', zk2TokenResult)
    } catch (error) {
        console.log('zk2_TokenListGetError =', error.message)
    }
}
async function getZK2TokenList(req) {
    const url = `${req.localChainID === 514 ? config.zkSync2.Rinkeby : config.zkSync2.Mainnet
        }/tokens?from=${req.from}&limit=${req.limit}&direction=${req.direction}`
    try {
        const response = await axios.get(url)
        if (response.status === 200) {
            var respData = response.data
            if (respData.status == 'success') {
                return respData.result.list
            } else {
                throw new Error(`getZK2 resp.result.status no success`)
            }
        } else {
            throw new Error(`getZK2TokenList no 200`)
        }
    } catch (error) {
        console.error('getZK2TokenList error =', error.message)
        throw new Error(`getZK2TokenList error = ${error.message}`)
    }
}