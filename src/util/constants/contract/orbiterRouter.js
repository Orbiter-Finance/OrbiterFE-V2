import Web3 from 'web3';
import { Coin_ABI, OrbiterRouterV3_ABI } from './contract';
import util from '../../util';
import RLP from 'rlp';
import { transferDataState } from '../../../composition/useTransferData';
import { compatibleGlobalWalletConf } from "../../../composition/walletsResponsiveData";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { Notification } from "element-ui";
import { WALLETCONNECT } from "../../walletsDispatchers";
import { walletConnectSendTransaction } from "../../walletsDispatchers/pcBrowser/walletConnectPCBrowserDispatcher";

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
      sourceData = [
        type,
        toChainId,
        toWalletAddress,
        t2Address,
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
    if (compatibleGlobalWalletConf.value.walletType === WALLETCONNECT) {

    }
    return contractInstance.methods
      .transfer(toAddress, data)
      .send({
        from: fromAddress,
        value,
      });
  } else {
    const { walletAddress, provider } = OrbiterConnector.walletInfo;
    const tokenContractInstance = new ethers.Contract(
      tokenAddress,
      Coin_ABI,
      provider
    );

    const allowance = await tokenContractInstance.allowance(walletAddress, contractAddress);
    const amount = new BigNumber(value);

    const checkAllowance = async () => {
      const n = Notification({
        duration: 0,
        title: 'Approving...',
        type: 'warning',
      });
      for (let index = 0; index < 5000; index++) {
        const newAllowance = await tokenContractInstance.allowance(walletAddress, contractAddress);
        if (!allowance.eq(newAllowance)) {
          n.close();
          if (amount.gt(newAllowance)) {
            throw new Error(`Approval amount is insufficient`);
          }
          break;
        }
        await util.sleep(2000);
      }
      n.close();
    };

    if (compatibleGlobalWalletConf.value.walletType === WALLETCONNECT) {
      if (amount.gt(allowance)) {
        const iface = new ethers.utils.Interface(Coin_ABI);
        const approveEncodeData = iface.encodeFunctionData('approve', [contractAddress, amount]);
        const approveHash = await walletConnectSendTransaction(
          chainId,
          fromAddress,
          tokenAddress,
          0,
          approveEncodeData
        );
        console.log('approve hash', approveHash);
        await checkAllowance();
      }
      const iface = new ethers.utils.Interface(OrbiterRouterV3_ABI);
      const encodeData = iface.encodeFunctionData('transferToken', [
        toAddress, tokenAddress, value, data
      ]);
      return walletConnectSendTransaction(chainId, fromAddress, tokenAddress, value, encodeData);
    }

    if (amount.gt(allowance)) {
      const approveHash = await tokenContractInstance.approve(contractAddress, amount);
      console.log('approve hash', approveHash);
      await checkAllowance();
    }

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
