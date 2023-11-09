import Web3 from 'web3';
import { OrbiterRouterV3_ABI } from './contract';
import util from '../../util';
import RLP from 'rlp';
import { transferDataState } from '../../../composition/useTransferData';
import { compatibleGlobalWalletConf } from "../../../composition/walletsResponsiveData";

// 0x01: cross address 0x02: cross address and cross currency
export const OrbiterRouterType = {
  CrossAddress: '0x01',
  CrossAddressCurrency: '0x02'
};

export async function orbiterRouterTransfer(type, fromAddress, makerAddress, value, toWalletAddress) {
  const { selectMakerConfig, fromChainID } = transferDataState;
  const { fromChain, toChain } = selectMakerConfig;

  const t1Address = fromChain.tokenAddress;
  const fromCurrency = fromChain.symbol;
  const toChainId = toChain.id;
  const toCurrency = toChain.symbol;
  const t2Address = toChain.tokenAddress;
  const slippage = selectMakerConfig.slippage;
  const expectValue = await util.getExpectValue();
  const web3 = new Web3();
  let sourceData;

  switch (type) {
    case OrbiterRouterType.CrossAddress: {
      sourceData = [type, toChainId, toWalletAddress];
      break;
    }
    case OrbiterRouterType.CrossAddressCurrency: {
      sourceData = fromCurrency === toCurrency
        ? [type, toChainId, t2Address, toWalletAddress]
        : [
          type,
          toChainId,
          t2Address,
          toWalletAddress,
          web3.utils.toHex(expectValue),
          slippage,
        ];
      break;
    }
  }

  const data = RLP.encode(sourceData);
  return await orbiterRouterSend(fromChainID, fromAddress, makerAddress, t1Address, data, value);
}

async function orbiterRouterSend(chainId, fromAddress, toAddress, tokenAddress, data, value) {
  const web3 = new Web3(compatibleGlobalWalletConf.value.walletPayload.provider || window.web3.currentProvider);
  const contractAddress = util.getOrbiterRouterV3Address(chainId);
  if (!contractAddress) {
    throw new Error(`Network ${ chainId } does not support contract sending`);
  }
  const contractInstance = new web3.eth.Contract(OrbiterRouterV3_ABI, contractAddress);
  if (util.isEthTokenAddress(chainId, tokenAddress)) {
    return contractInstance.methods
      .transfer(toAddress, value, data)
      .send({
        from: account,
        value,
      });
  } else {
    const gasLimit = await contractInstance.methods
      .transferToken(tokenAddress, toAddress, value, data)
      .estimateGas({
        from: fromAddress,
        gas: 5000000,
      });
    util.log('gasLimit', gasLimit);
    return contractInstance.methods
      .transferToken(toAddress, tokenAddress, value, data)
      .send({
        from: fromAddress,
        gas: gasLimit,
      });
  }
}
