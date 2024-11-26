import BigNumber from "bignumber.js";
import { Token } from "../../api-service/api.interface"
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class IMXVMService extends VMService {
  isValidTransferType(routerType: RouterType): boolean {
    if(routerType == RouterType.CONTRACT) {
      return false;
    }
    return true;
  }

  getAmountWithVc(amount: string, token: Token, vc: string): string {
    let decimals = token.decimals;
    if(token.isNative) {
      decimals = 9;
    }
    const value = new BigNumber(amount).multipliedBy(10 ** decimals).toFixed(0);
    if (value.length <= vc.length) {
      throw new Error(`value length too short`);
    }
    const header = value.slice(0, value.length - vc.length);
    const valueWithVc = header + vc;
    return new BigNumber(valueWithVc).div(10 ** decimals).toFixed();
  }

  async createTransaction(srcAddress: string, srcToken: Token,  dstAddress: string, dstToken: Token, value: string, vc: string,
    routerType: RouterType, makerAddress: string, chainId: string, contractAddress?: string, channelId?: string
  ) {
    if(!this.isValidTransferType(routerType)) {
      throw new Error(`not support for router type: ${routerType}`);
    }
    if (srcAddress !== dstAddress) {
      throw new Error(`IMX not support cross address tranfer.`)
    }

    const call = (channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`);
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