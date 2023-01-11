import Web3 from 'web3';
import { XVM_ABI } from "./contract";
import util from "../../util";
import { xvmList } from "../../../core/actions/thegraph";
import RLP from "rlp";

export async function XVMSwap(provider, account, makerAddress, value, expectValue, toWalletAddress) {
    const { target, toChain } = util.getXVMContractToChainInfo();
    const fromChainId = target.chainId;
    const t1Address = target.tokenAddress;
    const fromCurrency = target.symbol;
    const toChainId = toChain.chainId;
    const toCurrency = toChain.symbol;
    const t2Address = toChain.tokenAddress;
    const slippage = toChain.slippage;
    console.log('expectValue --> ', expectValue, 'eth value-->', value, 'token-->', t1Address);
    const web3 = new Web3(provider || window.web3.currentProvider);
    const sourceData = fromCurrency === toCurrency ? [toChainId, t2Address, toWalletAddress] : [toChainId, t2Address, toWalletAddress, expectValue, slippage];
    const bufferList = sourceData.map(item => {
        return web3.utils.toHex(item);
    });
    const data = RLP.encode(bufferList);
    const contractInstance = new web3.eth.Contract(XVM_ABI, xvmList.find(item => item.chainId === fromChainId).contractAddress);
    if (util.isEthTokenAddress(t1Address)) {
        return contractInstance.methods.swap(makerAddress, t1Address, value, data).send({
            from: account, value
        });
    } else {
        const gasLimit = await contractInstance.methods.swap(makerAddress, t1Address, value, data).estimateGas({
            from: account,
            gas: 5000000
        });
        console.log('gasLimit', gasLimit);
        return contractInstance.methods.swap(makerAddress, t1Address, value, data).send({
            from: account, gas: gasLimit
        });
    }
}

export async function f() {

}