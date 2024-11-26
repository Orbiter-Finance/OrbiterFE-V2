import BigNumber from "bignumber.js";
import { Token } from "../api-service/api.interface"
import { ConfigService } from "../config.service";
import { ApproveParams, RouterType, TransactionParams } from "../orbiter.interface";

export class VMService {
  private readonly _configService: ConfigService;

  constructor(configService: ConfigService) {
    this._configService = configService;
  }

  isValidTransferType(routerType: RouterType): boolean {
    return true;
  }

  getAmountWithVc(amount: string, token: Token, vc: string) {
    const value = new BigNumber(amount).multipliedBy(10 ** token.decimals).toFixed(0);
    if (value.length <= vc.length) {
      throw new Error(`value length too short`);
    }
    const header = value.slice(0, value.length - vc.length);
    const valueWithVc = header + vc;
    return new BigNumber(valueWithVc).div(10 ** token.decimals).toFixed();
  }

  async createTransaction(srcAddress: string, srcToken: Token, dstAddress: string, dstToken: Token, value: string, vc: string,
    routerType: RouterType, makerAddress: string, chainId: string, contractAddress?: string, channelId?: string
  ): Promise<TransactionParams> {
    throw new Error(`createTransfer need implement, params: 
    srcAddress: ${srcAddress}, srcToken: ${JSON.stringify(srcToken)}, dstAddress: ${dstAddress}, dstToken: ${JSON.stringify(dstToken) }, value: ${value}, vc: ${vc}, 
    routerType: ${routerType}, makerAddress: ${makerAddress}, chainId: ${chainId}, contractAddress: ${contractAddress}, channelId: ${channelId}`);
  };

  async createApprove(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string, value: string): Promise<ApproveParams> {
    throw new Error(`createApprove need implement, params: 
      ownerAddress: ${ownerAddress}, spenderAddress: ${spenderAddress}, approveToken: ${JSON.stringify(approveToken)}, value: ${value}, chainId: ${chainId}`);
  }

  async createAllowance(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string): Promise<unknown> {
    throw new Error(`checkAllowance need implement, params: 
      ownerAddress: ${ownerAddress}, spenderAddress: ${spenderAddress}, approveToken: ${JSON.stringify(approveToken)}, chainId: ${chainId}`);
  }
}