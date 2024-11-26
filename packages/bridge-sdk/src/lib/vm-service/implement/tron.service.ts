import { TronWeb, Types as TronTypes, BigNumber } from "tronweb";
import { Token } from "../../api-service/api.interface";
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class TRONVMService extends VMService {
  isValidTransferType(routerType: RouterType): boolean {
    if(routerType == RouterType.EOA) {
      return false;
    }
    return true;
  }

  async createTransaction(srcAddress: string, srcToken: Token,  dstAddress: string, dstToken: Token, value: string, vc: string,
    routerType: RouterType, makerAddress: string, chainId: string, contractAddress?: string, channelId?: string
  ) {
    if(!this.isValidTransferType(routerType)) {
      throw new Error(`not support for router type: ${routerType}`);
    }
    if (!contractAddress) {
      throw new Error('contractAddress is required');
    }

    const url = this.getUrl(chainId);
    if (!url) {
      throw new Error(`Unsupported Tron chainId: ${chainId}`);
    }
    const tronWeb = new TronWeb({
      fullHost: url
    });

    const callData = channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`;
    const bytesData = tronWeb.toHex(callData);

    const functionSelector = 'transferToken(address,address,uint256,bytes)';
    const params: TronTypes.ContractFunctionParameter[] = [
      {type: 'address', value: srcToken.address},
      {type: 'address', value: makerAddress},
      {type: 'uint256', value: value},
      {type: 'bytes', value: bytesData}
    ];

    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress,
      functionSelector,
      {
        txLocal: true
      },
      params,
      srcAddress
    );

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
    const url = this.getUrl(chainId);
    if (!url) {
      throw new Error(`Unsupported Tron chainId: ${chainId}`);
    }
    const tronWeb = new TronWeb({
      fullHost: url
    });

    const functionSelector = 'approve(address,uint256)';
    const params: TronTypes.ContractFunctionParameter[] = [
      {type: 'address', value: spenderAddress},
      {type: 'uint256', value: value}
    ];

    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
      approveToken.address,
      functionSelector,
      {
        txLocal: true
      },
      params,
      ownerAddress
    );

    return {
      ownerAddress,
      spenderAddress,
      value,
      amount: new BigNumber(value).div(10 ** approveToken.decimals).toString(),
      raw: transaction
    };
  }

  async createAllowance(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string) {
    const url = this.getUrl(chainId);
    if (!url) {
      throw new Error(`Unsupported Tron chainId: ${chainId}`);
    }
    const tronWeb = new TronWeb({
      fullHost: url
    });

    const functionSelector = 'allowance(address,address)';
    const params: TronTypes.ContractFunctionParameter[] = [
      {type: 'address', value: ownerAddress},
      {type: 'address', value: spenderAddress}
    ];

    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
      approveToken.address,
      functionSelector,
      {
        txLocal: true
      },
      params,
      ownerAddress
    );

    return transaction;
  }

  getUrl(chainId: string) {
    let url: string | undefined;
    if (chainId === '3448148188') {
      url = 'https://nile.trongrid.io';
    } else if(chainId === '728126428') {
      url = 'https://api.trongrid.io';
    } else if (chainId === '2494104990') {
      url = 'https://api.shasta.trongrid.io';
    }
    return url;
  }
}