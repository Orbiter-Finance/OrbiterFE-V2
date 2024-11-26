import BigNumber from "bignumber.js";
import * as bitcoin from "bitcoinjs-lib";
import { Token } from "../../api-service/api.interface"
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class BTCVMService extends VMService {
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

    //only support native currency
    if(!srcToken.isNative) {
      throw new Error('only support native currency');
    };
    const psbt = new bitcoin.Psbt();
    psbt.addOutput({
      address: makerAddress,
      value: Number(value)
    });
    const callDataBuffer = bitcoin.payments.embed({
      data: [Buffer.from((channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`), 'utf-8')],
    }).output;
    if (!callDataBuffer) {
      throw new Error('create callDataBuffer failed');
    }
    psbt.addOutput({
      script: callDataBuffer,
      value: 0,
    });
    return {
      routerType,
      srcAddress,
      dstAddress,
      value,
      amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
      raw: psbt
    };
  }
}