import Web3 from 'web3'
import env from '../../../../env'
import { makerConfigs } from "../../../core/actions/thegraph";
import util from "../../util";

/**
 * @returns {Web3 | null}
 * @param chainId
 */
function localWeb3(chainId) {
  const rpc = this.localRpc(chainId);
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
  return '';
}

/**
 * @param {number} chainID
 * @returns {Web3 | null}
 */
function localWSWeb3(chainID) {
  const rpc = this.localRpc(chainID, 1);
  if (!rpc) {
    return null;
  }

  return new Web3(
      new Web3.providers.WebsocketProvider(rpc)
  );
}

export { localRpc, localWeb3, localWSWeb3 };
