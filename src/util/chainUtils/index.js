import { transferDataState } from '../../composition/hooks'
import util from '../util'

export const getNetworkIdByChainId = (chainId) => {
  const selectIdByUser = transferDataState.fromChainID // chainId selected by user
  return util.getMetaMaskNetworkId(chainId || selectIdByUser)
}
