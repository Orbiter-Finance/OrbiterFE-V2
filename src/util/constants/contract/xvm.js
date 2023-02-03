import Web3 from 'web3';
import { XVM_ABI } from "./contract";
import util from "../../util";
import RLP from "rlp";
import { transferDataState } from "../../../composition/useTransferData";

export async function XVMSwap(provider, contractAddress, account, makerAddress, value, expectValue, toWalletAddress) {
    const { selectMakerConfig, fromChainID } = transferDataState;
    const { fromChain, toChain } = selectMakerConfig;
    const t1Address = fromChain.tokenAddress;
    const fromCurrency = fromChain.symbol;
    const toChainId = toChain.id;
    const toCurrency = toChain.symbol;
    const t2Address = toChain.tokenAddress;
    const slippage = selectMakerConfig.slippage;
    console.log('expectValue --> ', expectValue, 'eth value-->', value, 'token-->', t1Address,
        'params-->',toChainId, t2Address, toWalletAddress);
    const web3 = new Web3(provider || window.web3.currentProvider);
    const sourceData = fromCurrency === toCurrency ? [toChainId, t2Address, toWalletAddress] : [toChainId, t2Address, toWalletAddress, expectValue, slippage];
    const bufferList = sourceData.map(item => {
        return web3.utils.toHex(item);
    });
    const data = RLP.encode(bufferList);
    const contractInstance = new web3.eth.Contract(XVM_ABI, contractAddress);
    if (util.isEthTokenAddress(fromChainID, t1Address)) {
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