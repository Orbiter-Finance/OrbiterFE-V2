import * as zksync from 'zksync'
import { CHAIN_ID } from "../../config";

export async function getZkSyncProvider(chainId) {
  if (chainId === CHAIN_ID.zksync_test) {
    return await zksync.Provider.newHttpProvider(
      'https://goerli-api.zksync.io/jsrpc'
    )
  } else if (chainId === CHAIN_ID.zksync) {
    return await zksync.getDefaultProvider('mainnet')
  } else {
    throw new Error(`chainId ${this.chainId} not supported yet!`)
  }
}
