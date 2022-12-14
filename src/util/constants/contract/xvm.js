import Web3 from 'web3';
import { XVM_ABI } from "./contract";
import util from "../../util";
import { xvmList } from "../../../core/actions/thegraph";
import BigNumber from "bignumber.js";

export async function XVMSwap(provider, account, makerAddress, value, toWalletAddress) {
    const { target, toChain } = util.getXVMContractToChainInfo();
    const fromChainId = target.chainId;
    const t1Address = target.tokenAddress;
    const fromCurrency = target.symbol;
    const toChainId = toChain.chainId;
    const toCurrency = toChain.symbol;
    const t2Address = toChain.tokenAddress;
    const expectValue = (new BigNumber(await util.getXVMExpectValue(value))).toFixed(0);
    console.log('expectValue --> ',expectValue)
    const web3 = new Web3(provider || window.web3.currentProvider);
    const sourceData = fromCurrency === toCurrency ? [toChainId, t2Address, toWalletAddress] : [toChainId, t2Address, toWalletAddress, expectValue, toChain.rate];
    const data = sourceData.map(item => {
        return web3.utils.toHex(item);
    });
    return (new web3.eth.Contract(XVM_ABI, xvmList.find(item => item.chainId === fromChainId).contractAddress)).methods.swap(makerAddress, t1Address, value, data).send({
        from: account, value: util.isEthTokenAddress(t1Address) ? value : 0
    });
}

export async function f() {

}