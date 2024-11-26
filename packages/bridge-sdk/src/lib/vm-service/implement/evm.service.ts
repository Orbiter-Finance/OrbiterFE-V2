import BigNumber from "bignumber.js";
import { hexlify, Interface, toUtf8Bytes, TransactionRequest } from "ethers";
import { Token } from "../../api-service/api.interface"
import { RouterType, TransactionParams } from "../../orbiter.interface";
import { VMService } from "../vm.service";
import { ERC20_ABI } from "../../../abi/erc20";
import { Orbiter_V3_ABI_EVM } from "../../../abi/orbiter";

export class EVMService extends VMService {
  async createTransaction(srcAddress: string, srcToken: Token,  dstAddress: string, dstToken: Token, value: string, vc: string,
    routerType: RouterType, makerAddress: string, chainId: string, contractAddress?: string, channelId?: string
  ): Promise<TransactionParams> {
    if(!this.isValidTransferType(routerType)) {
      throw new Error(`not support for router type: ${routerType}`);
    }
    if (routerType == RouterType.CONTRACT && !contractAddress) {
      throw new Error('contractAddress is required');
    }
    
    let transaction: TransactionRequest | undefined;
    if (routerType === RouterType.EOA) {
      if (srcAddress !== dstAddress) {
        throw new Error(`EVM EOA transfer not support cross address transfer, srcAddress:${srcAddress}, dstAddress:${dstAddress}.`);
      }
      if (srcToken.isNative) {
        transaction = {
          to: makerAddress,
          value: value,
          data: '0x'
        }
      } else {
        const _interface = new Interface(ERC20_ABI);
        const recipient = makerAddress;
        const amount = value;
        const callData = _interface.encodeFunctionData("transfer", [recipient, amount]);
        transaction = {
          to: srcToken.address,
          data: callData,
          value: '0'
        }
      }
    } else if (routerType === RouterType.CONTRACT) {
      const _interface = new Interface(Orbiter_V3_ABI_EVM);
      const to = makerAddress;
      const data = hexlify(toUtf8Bytes(channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`));
      if (srcToken.isNative) {
        const callData = _interface.encodeFunctionData("transfer", [to, data]);
        transaction = {
          to: contractAddress,
          data: callData,
          value,
        }
      } else {
        const token = srcToken.address;
        const callData = _interface.encodeFunctionData("transferToken", [token, to, value, data]);
        transaction = {
          to: contractAddress,
          data: callData,
          value: '0'
        }
      }
    }
    return {
      routerType,
      srcAddress,
      dstAddress,
      value,
      amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
      raw: transaction
    };
  }

  async createApprove(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string, value: string) {
    const _interface = new Interface(ERC20_ABI);
    const amount = value;
    const callData = _interface.encodeFunctionData("approve", [spenderAddress, amount]);
    const transaction: TransactionRequest = {
      to: approveToken.address,
      data: callData,
      value: '0'
    }
    return {
      ownerAddress,
      spenderAddress,
      value,
      amount: new BigNumber(value).div(10 ** approveToken.decimals).toString(),
      raw: transaction
    };
  }

  async createAllowance(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string) {
    const _interface = new Interface(ERC20_ABI);
    const callData = _interface.encodeFunctionData("allowance", [ownerAddress, spenderAddress]);
    const transaction: TransactionRequest = {
      to: approveToken.address,
      data: callData,
      value: '0'
    }
    return transaction;
  }
}