import BigNumber from "bignumber.js";
import TonWeb from "tonweb";
import { Token } from "../../api-service/api.interface"
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class TVMService extends VMService {
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

    const data = channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`;
    const srcTonAddress = new TonWeb.Address(srcAddress)
    const makerTonAddress = new TonWeb.Address(makerAddress)

    const forwardPayload = new TonWeb.boc.Cell();
    forwardPayload.bits.writeUint(0, 128);
    forwardPayload.bits.writeString(data);

    if(srcToken.isNative) {
      return {
        routerType,
        srcAddress,
        dstAddress,
        value,
        amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
        raw: forwardPayload,
      };
    } else {
      const queryId = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds();
      const jettonTransferBody = new TonWeb.boc.Cell();
      jettonTransferBody.bits.writeUint(0xf8a7ea5, 32);
      jettonTransferBody.bits.writeUint(queryId, 64);
      jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN(value));
      jettonTransferBody.bits.writeAddress(makerTonAddress);
      jettonTransferBody.bits.writeAddress(srcTonAddress);
      jettonTransferBody.bits.writeBit(false);
      jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0'));
      jettonTransferBody.bits.writeBit(true);
      jettonTransferBody.refs.push(forwardPayload);

      const payloadBase64 = TonWeb.utils.bytesToBase64(
        await jettonTransferBody.toBoc(false)
      )
      return {
        routerType,
        srcAddress,
        dstAddress,
        value,
        amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
        raw: payloadBase64
      };
    }
  }
}