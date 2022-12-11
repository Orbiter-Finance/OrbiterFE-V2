import Web3 from 'web3';
import { XVM_ABI } from "./contract";
import util from "../../util";
import { xvmList } from "../../../core/actions/thegraph";

export async function XVMSwap(provider, account, gasLimit, fromChainId, makerAddress, t1Address, value, toChainId,
                              toCurrency, toWalletAddress) {
    const chainInfo = util.getXVMContractToChainInfo();
    const toChain = chainInfo.toChain;
    const t2Address = toChain.tokenAddress;
    const expectValue = await util.getXVMExpectValue(1);
    console.log('expectValue', expectValue);
    const web3 = new Web3(provider || window.web3.currentProvider);
    const data = [toChainId, t2Address, toWalletAddress, expectValue, toChain.rate].map(item => {
        return web3.utils.toHex(item);
    });
    return (new web3.eth.Contract(XVM_ABI, xvmList.find(item => item.chainId === fromChainId).contractAddress)).methods.swap(makerAddress, t1Address, value, data).send({
        from: account, gas: gasLimit, value: util.isEthTokenAddress(t1Address) ? value : 0
    });
}