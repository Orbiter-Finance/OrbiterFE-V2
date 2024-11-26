import BigNumber from "bignumber.js";
import { isValidAddress } from "@orbiter-finance/vm-core";
import { padStart } from "../utils/tools";
import { ChainConfig, RouterConfig, Token } from "./api-service/api.interface"
import { ApproveParams, RouterType, TransactionParams } from "./orbiter.interface";
import { VMService } from "./vm-service/vm.service";

export class Router {
  constructor(
    public readonly srcChainConfig: ChainConfig,
    public readonly srcToken: Token,
    public readonly dstChainConfig: ChainConfig,
    public readonly dstToken: Token,
    public readonly basePoint: string,
    private readonly _VMService: VMService,
    public readonly routerConfig: RouterConfig,
    public readonly routerTypes: RouterType[],
    private readonly _channelId?: string,
  ) {}

  get routerId() {
    return `${this.srcChainConfig.chainId}-${this.srcToken.symbol}-${this.dstChainConfig.chainId}-${this.dstToken.symbol}`
  }

  get vc() {
    return this.dstChainConfig.internalId.toString();
  }

  get withholdingFee() {
    return this.routerConfig.withholdingFee;
  }

  get tradeFee() {
    return this.routerConfig.tradeFee;
  }

  get makerAddress() {
    const address = this.routerConfig?.endpoint;
    if (!address) {
      throw new Error(`getMakerAddress fail`);
    }
    return address;
  }

  get contractAddress() {
    return this.routerConfig.endpointContract;
  }

  get spentTime() {
    return this.routerConfig.spentTime;
  }

  // private _getAmountWithVc(amount: string) {
  //   const value = new BigNumber(amount).multipliedBy(10 ** this.srcToken.decimals).toFixed(0);
  //   const vc = this.vc;
  //   if (value.length <= vc.length) {
  //     throw new Error(`value length too short`);
  //   }
  //   const header = value.slice(0, value.length - vc.length);
  //   const valueWithVc = header + vc;
  //   return new BigNumber(valueWithVc).div(10 ** this.srcToken.decimals).toFixed();
  // }

  async createTransaction(srcAddress: string, dstAddress: string, amount: string): Promise<TransactionParams> {
    const value = new BigNumber(amount).multipliedBy(10 ** this.srcToken.decimals).toFixed(0);

    if (!await isValidAddress(srcAddress, this.srcChainConfig.vm)) {
      throw new Error(`srcAddress format error: ${srcAddress}`);
    }
    // if (!await isValidAddress(dstAddress, this.dstChainConfig.vm)) {
    //   throw new Error(`dstAddress format error: ${dstAddress}`);
    // }

    const vc = this.vc;
    for(const routerType of this.routerTypes) {
      try {
        const transaction = await this._VMService.createTransaction(srcAddress, this.srcToken, dstAddress, this.dstToken, value, vc, routerType, this.makerAddress, this.srcChainConfig.chainId, this.contractAddress, this._channelId);
        return transaction;
      } catch {
        continue;
      }
    }
    throw new Error(`createTransaction fail, error: no available router type.`);
  }

  async createApprove(ownerAddress: string, amount: string): Promise<ApproveParams> {
    const value = new BigNumber(amount).multipliedBy(10 ** this.srcToken.decimals).toFixed(0);

    const spenderAddress = this.contractAddress;
    if (!spenderAddress) {
      throw new Error(`createApprove fail, unavailable target contract address.`);
    }

    if (!await isValidAddress(ownerAddress, this.srcChainConfig.vm)) {
      throw new Error(`ownerAddress format error: ${ownerAddress}`);
    }
    if (!await isValidAddress(spenderAddress, this.srcChainConfig.vm)) {
      throw new Error(`spenderAddress format error: ${spenderAddress}`);
    }

    return this._VMService.createApprove(ownerAddress, spenderAddress, this.srcToken, this.srcChainConfig.chainId, value);
  }

  async createAllowance(ownerAddress: string) {
    const spenderAddress = this.contractAddress;
    if (!spenderAddress) {
      throw new Error(`createAllowance fail, unavailable target contract address.`);
    }
    if (!await isValidAddress(ownerAddress, this.srcChainConfig.vm)) {
      throw new Error(`ownerAddress format error: ${ownerAddress}`);
    }
    if (!await isValidAddress(spenderAddress, this.srcChainConfig.vm)) {
      throw new Error(`spenderAddress format error: ${spenderAddress}`);
    }

    return this._VMService.createAllowance(ownerAddress, spenderAddress, this.srcToken, this.srcChainConfig.chainId);
  }

  getMinSendAmountMinusWithHoldingFee() {
    const minAmt = new BigNumber(this.routerConfig.minAmt);
    const withholdingFee = new BigNumber(this.routerConfig.withholdingFee);
    return minAmt.minus(withholdingFee).toFixed();
  }

  getMinSendAmount() {
    return this.routerConfig.minAmt;
  }

  getMaxSendAmount() {
    return this.routerConfig.maxAmt;
  }

  simulationAmountPlusWithHoldingFee(amount: string) {
    let amountBigNumber = new BigNumber(this._VMService.getAmountWithVc(amount, this.srcToken, this.vc));//FIXME: need vc or not
    // let amountBigNumber = new BigNumber(amount);
    // if (this.routerType == RouterType.EOA) {
    //   amountBigNumber = new BigNumber(this._getAmountWithVc(amount));
    // }
    
    //minAmt needs minus withHolding fee
    const minAmt = new BigNumber(this.getMinSendAmountMinusWithHoldingFee());
    const maxAmt = new BigNumber(this.getMaxSendAmount());
    if (amountBigNumber.lt(minAmt) || amountBigNumber.gt(maxAmt.multipliedBy(1.1))) { // 10% endurance rate
      throw new Error(`amount ${amount} is not in the allow scale: min: ${this.routerConfig.minAmt} max: ${this.routerConfig.maxAmt}`);
    }

    let tradeFeeRate = new BigNumber(this.tradeFee);
    let withholdingFee = new BigNumber(this.withholdingFee);
    const originWithholdingFee = withholdingFee;
    if (this.routerConfig.tieredFee) {
      const subWithholdingFeeAmount = amountBigNumber.minus(withholdingFee).toNumber();
      const item = this.routerConfig.tieredFee.find(row => subWithholdingFeeAmount > row.range[0] && subWithholdingFeeAmount <= row.range[1]);
      if (item) {
        if (item.tradeFee != undefined) {
          tradeFeeRate = new BigNumber(item.tradeFee);
        }
        if (item.withholdingFee != undefined) {
          withholdingFee = new BigNumber(item.withholdingFee);
        }
      }
    }

    const tFee = new BigNumber(originWithholdingFee)
      .minus(withholdingFee)
      .multipliedBy(tradeFeeRate)
      .dividedBy(100).toString()
    withholdingFee = new BigNumber(this.routerConfig.withholdingFee).minus(tFee);

    // plus withHolding fee
    amountBigNumber = amountBigNumber.plus(withholdingFee);
    const nonce = '0';//to avoid receive value over mini value
    const safeLength = this._getTargetAmountSafeLengthByToken(this.dstToken.symbol, this.dstToken.decimals);
    const targetNonce = padStart(nonce.substring(nonce.length - safeLength), safeLength, '0');
    const result = this._getResponseIntent(amountBigNumber.toString(), '0', tradeFeeRate.toNumber(), 0, withholdingFee.toString(), targetNonce, this.dstToken.decimals - safeLength);

    const sendAmount = amountBigNumber.toFixed();
    const receiveAmount = new BigNumber(result.responseAmount).toFixed();
    return {
      sendAmount,
      receiveAmount
    };
  }

  simulationAmount(amount: string) {
    let amountBigNumber = new BigNumber(this._VMService.getAmountWithVc(amount, this.srcToken, this.vc));//FIXME: need vc or not
    // let amountBigNumber = new BigNumber(amount);
    // if (this.routerType === RouterType.EOA) {
    //   amountBigNumber = new BigNumber(this._getAmountWithVc(amount));
    // }

    if (amountBigNumber.lt(Number(this.routerConfig.minAmt)) || amountBigNumber.gt(Number(this.routerConfig.maxAmt) * 1.1)) { // 10% endurance rate
      throw new Error(`amount ${amount} is not in the allow scale: min: ${this.routerConfig.minAmt} max: ${this.routerConfig.maxAmt}`);
    }

    let tradeFeeRate = new BigNumber(this.tradeFee);
    let withholdingFee = new BigNumber(this.withholdingFee);
    const originWithholdingFee = withholdingFee;
    if (this.routerConfig.tieredFee) {
      const subWithholdingFeeAmount = amountBigNumber.minus(withholdingFee).toNumber();
      const item = this.routerConfig.tieredFee.find(row => subWithholdingFeeAmount > row.range[0] && subWithholdingFeeAmount <= row.range[1]);
      if (item) {
        if (item.tradeFee != undefined) {
          tradeFeeRate = new BigNumber(item.tradeFee);
        }
        if (item.withholdingFee != undefined) {
          withholdingFee = new BigNumber(item.withholdingFee);
        }
      }
    }

    const tFee = new BigNumber(originWithholdingFee)
      .minus(withholdingFee)
      .multipliedBy(tradeFeeRate)
      .dividedBy(100).toString()
    withholdingFee = new BigNumber(this.routerConfig.withholdingFee).minus(tFee);

    const nonce = '1000';
    const safeLength = this._getTargetAmountSafeLengthByToken(this.dstToken.symbol, this.dstToken.decimals);
    const targetNonce = padStart(nonce.substring(nonce.length - safeLength), safeLength, '0');
    const result = this._getResponseIntent(amountBigNumber.toString(), '0', tradeFeeRate.toNumber(), 0, withholdingFee.toString(), targetNonce, this.dstToken.decimals - safeLength);

    const sendAmount = amountBigNumber.toFixed();
    const receiveAmount = new BigNumber(result.responseAmount).toFixed();
    return {
      sendAmount,
      receiveAmount
    };
  }

  private _getResponseIntent(amountE: string, securityCode: string, tradeFeeRate: number, brokerageTradeFeeRate: number, withholdingFeeAmount: string, targetSafeCode: string, preservePrecision: number) {
    const amount = new BigNumber(amountE);
    const tradeAmount = amount.minus(securityCode).minus(withholdingFeeAmount);

    const tradingFeeAmount = tradeAmount.times(tradeFeeRate).div(100);
    const brokerageTradeFeeAmount = tradeAmount.times(brokerageTradeFeeRate || 0).div(100);

    const responseAmount = tradeAmount.minus(tradingFeeAmount).minus(brokerageTradeFeeAmount);
    const responseAmountStr = responseAmount.toFixed(preservePrecision, 1);
    const responseAmountArr = responseAmountStr.split('.');
    const amountAfter = responseAmountArr[1] || '';
    const result = {
      code: 0,
      value: amount.toString(),
      tradeAmount: tradeAmount.toString(),
      tradeFeeAmount: tradingFeeAmount.toString(),
      brokerageTradeFeeAmount: brokerageTradeFeeAmount.toString(),
      withholdingFeeAmount,
      responseAmountOrigin: responseAmountStr,
      responseAmount: new BigNumber(`${responseAmountArr[0]}.${amountAfter.substring(0, preservePrecision)}${targetSafeCode}`).toString()
    };
    return result;
  }


  private _getTargetAmountSafeLengthByToken(symbol: string, decimal: number) {
    if (decimal >= 18) {
      return 5;
    }
    if (symbol === 'BTC') {
      return 2;
    }
    if (symbol === 'USDT' || symbol === 'USDC' || symbol === 'DAI') {
      return 4;
    }
    return 4;
  }

}
