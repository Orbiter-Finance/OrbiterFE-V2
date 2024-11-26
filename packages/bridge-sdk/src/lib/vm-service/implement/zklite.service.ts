import BigNumber from "bignumber.js";
import { Token } from "../../api-service/api.interface";
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class ZKLITEVMService extends VMService {
  isValidTransferType(routerType: RouterType): boolean {
    if(routerType == RouterType.CONTRACT) {
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
    if (srcAddress !== dstAddress) {
      throw new Error(`ZKSync Lite not support cross address tranfer.`);
    }

    let call = channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`;
    return {
      routerType,
      srcAddress,
      dstAddress,
      value,
      amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
      raw: call
    };
  }
}