import mainnet from '../../config/mainnet.json'
import testnet from '../../config/testnet.json'
import { transferDataState } from '../../composition/hooks'
import util from "../util";

// get match chain config by the networkId passed in
export const getChainInfo = (networkId) => {
  let chainConfig;
  if (process.env.NODE_ENV === 'production') {
    chainConfig = mainnet;
  } else {
    chainConfig = testnet;
  }
  return chainConfig.find(({ chainId }) => {
    return chainId.toString() === networkId.toString();
  });
};

export const getNetworkIdByChainId = (chainId) => {
  const selectIdByUser = transferDataState.fromChainID; // chainId selected by user
  return util.chainNetWorkId(chainId || selectIdByUser);
};
