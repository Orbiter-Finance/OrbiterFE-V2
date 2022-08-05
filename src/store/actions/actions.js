import { getWeb3 } from '../../util/constants/web3/getWeb3'
import makerInfo from '../../core/routes/makerInfo'
export default {
  async registerWeb3() {
    await getWeb3()
  },
  async getMakerInfoList(context) {
    const getMakerInfoFromGraphReq = {
      maker: '0',
    }
    const response = await makerInfo.getMakerInfoFromGraph(
      getMakerInfoFromGraphReq,
      true
    )
    if (response.code === 0) {
      context.commit('updatePoolNetworkOrTokenConfig', {
        type: 'makerInfoList',
        value: response.data,
      })
      return true
    } else {
      return false
    }
  },
}
