import chainConfig from "../../config/chains.json";
import { store } from "../../store";
import env from "../../../env";
import { transferDataState } from '../../composition/hooks'

// get match chain config by the networkId passed in 
export const getChainInfo = (networkId) => {
    return chainConfig.chainList.find(({ chainId }) => {
        return chainId.toString() === networkId.toString();
    })
}

export const getNetworkIdByChainId = (chainId) => {
    const selectIdByUser = transferDataState.fromChainID; // chainId selected by user
    return env.localChainID_netChainID[chainId || selectIdByUser];
}