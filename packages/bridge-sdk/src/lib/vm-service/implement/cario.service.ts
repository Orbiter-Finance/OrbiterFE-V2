import BigNumber from "bignumber.js";
import { Contract, shortString, uint256 } from "starknet";
import { Orbiter_V3_ABI_STARKNET } from "../../../abi/orbiter";
import { STARKNET_ERC20_ABI } from "../../../abi/erc20";
import { Token } from "../../api-service/api.interface"
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class CAIROVMService extends VMService {
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
      const amount = uint256.bnToUint256(value);

      // const tokenContract = new Contract(STARKNET_ERC20_ABI, srcToken.address);
      // const approveCall = tokenContract.populate('approve', [
      //     contractAddress,
      //     amount
      // ]);

    const contract = new Contract(Orbiter_V3_ABI_STARKNET, contractAddress);
    const data = (channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`);
    const ext = shortString.splitLongString(data).map((item) => shortString.encodeShortString(item));
    const call = contract.populate('transferERC20', [srcToken.address, makerAddress, amount, ext]);
    return {
      routerType,
      srcAddress,
      dstAddress,
      value,
      amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
      raw: call
    };
  }

  async createApprove(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string, value: string) {
    const contract = new Contract(STARKNET_ERC20_ABI, approveToken.address);
    const amount = uint256.bnToUint256(value);
    const call = contract.populate('approve', [spenderAddress, amount]);
    return {
      ownerAddress,
      spenderAddress,
      value,
      amount: new BigNumber(value).div(10 ** approveToken.decimals).toString(),
      raw: call
    };
  }

  async createAllowance(ownerAddress: string, spenderAddress: string, approveToken: Token, chainId: string) {
    const contract = new Contract(STARKNET_ERC20_ABI, approveToken.address);
    const call = contract.populate('allowance', [ownerAddress, spenderAddress]);
    return call;
  }
}
