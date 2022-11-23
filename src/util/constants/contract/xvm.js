import Web3 from 'web3';
import { XVM_ABI } from "./contract";
import { xvmList } from "../../../core/actions/thegraph";
import { exchangeToCoin } from "../../coinbase";

export async function XVMSwap(provider, account, gasLimit, fromChainId, makerAddress, t1Address, value, toChainId,
                              toCurrency, toWalletAddress) {
    const xvm = xvmList.find(item => item.chainId === fromChainId);
    const target = xvm.target;
    const targetData = target.find(item => item.tokenAddress === t1Address);
    const toChains = targetData.toChains;
    const toChain = toChains.find(item => item.chainId === toChainId && item.symbol === toCurrency);
    const fromCurrency = targetData.symbol;
    const t2Address = toChain.tokenAddress;
    const expectValue = (await exchangeToCoin(value, fromCurrency, toCurrency)).toNumber();
    const web3 = new Web3(provider || window.web3.currentProvider);
    const data = [toChainId, t2Address, toWalletAddress, expectValue].map(item => {
        return web3.utils.toHex(item);
    });
    return (new web3.eth.Contract(XVM_ABI, xvm.contractAddress)).methods.swap(makerAddress, t1Address, value, data).send({
        from: account, gas: gasLimit, value
    });
}