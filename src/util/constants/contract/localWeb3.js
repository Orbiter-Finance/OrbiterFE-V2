import Web3 from 'web3'
import util from "../../util";

/**
 * @returns {Web3 | null}
 * @param chainId
 */
function localWeb3(chainId) {
  const rpc = localRpc(chainId);
  if (rpc) {
    return new Web3(rpc);
  }
  return null;
}

function localRpc(chainId, isWs) {
  const localHttpRpc = process.env[`VUE_APP_HP_${ chainId }`];
  if (localHttpRpc && !isWs) {
    return localHttpRpc;
  }
  const localWsRpc = process.env[`VUE_APP_WP_${ chainId }`];
  if (localWsRpc) {
    return localWsRpc;
  }
  const chainInfo = util.getChainInfoByChainId(chainId);
  if (chainInfo?.rpc && chainInfo.rpc.length) {
    return chainInfo?.rpc[0];
  }
  return '';
}

export { localRpc, localWeb3 };
