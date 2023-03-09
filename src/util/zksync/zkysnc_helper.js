import * as zksync from 'zksync'

export async function getZkSyncProvider(chainId) {
  if (chainId === 33) {
    return await zksync.Provider.newHttpProvider(
      'https://goerli-api.zksync.io/jsrpc'
    )
  } else if (chainId === 3) {
    return await zksync.getDefaultProvider('mainnet')
  } else {
    throw new Error(`chainId ${this.chainId} not supported yet!`)
  }
}
