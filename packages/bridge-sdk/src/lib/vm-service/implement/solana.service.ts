import BigNumber from "bignumber.js";
import { hexlify, toUtf8Bytes } from "ethers";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Token } from "../../api-service/api.interface"
import { RouterType } from "../../orbiter.interface";
import { VMService } from "../vm.service";

export class SolanaVMService extends VMService {
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

    const srcAddressPublicKey = new PublicKey(srcAddress);
    const srcTokenPublicKey = new PublicKey(srcToken.address);
    const makerAddressPublicKey = new PublicKey(makerAddress);
    const srcAddressTokenAccount = await getAssociatedTokenAddress(
      srcTokenPublicKey,
      srcAddressPublicKey,
    );
    const makerAddressTokenAccount = await getAssociatedTokenAddress(
      srcTokenPublicKey,
      makerAddressPublicKey,
      true
    );

    const transaction = new Transaction()
      .add(
        createTransferInstruction(
          srcAddressTokenAccount,
          makerAddressTokenAccount,
          srcAddressPublicKey,
          Number(value),
          [],
          TOKEN_PROGRAM_ID
        )
      )
      .add(
        new TransactionInstruction({
          keys: [{ pubkey: srcAddressPublicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(hexlify(toUtf8Bytes(channelId ? `c=${vc}&t=${dstAddress}&app=${channelId}` : `c=${vc}&t=${dstAddress}`)), 'utf-8'),
          programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        })
      )
    
    return {
      routerType,
      srcAddress,
      dstAddress,
      value,
      amount: new BigNumber(value).div(10 ** srcToken.decimals).toString(),
      raw: transaction
    };
  }
}