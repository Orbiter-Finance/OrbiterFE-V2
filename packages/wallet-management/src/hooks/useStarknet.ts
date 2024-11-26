import React from 'react';
import { WalletType } from '../types';
import { useAccount, useDisconnect, useNetwork } from '@starknet-react/core';
import { VM } from '../constant';
import { ABI } from '../abi';
import BigNumber from 'bignumber.js';
import { Contract, RpcProvider, validateAndParseAddress } from 'starknet';
import { useWalletConnectContext } from '../providers/WalletConnectProvider.js'

export function useStarknet(): WalletType {

  const { account, address, connector } = useAccount();
  const { disconnectAsync } = useDisconnect()

  const { setWalletType } = useWalletConnectContext();

  const { chain } = useNetwork();

  const checkChain = (chainId: string) => {
    return true
  };

  const switchChain = async () => {
    console.log("Switch Starknet NetWrok");
  };

  const getBalance = async ({ chainId, token, user }: { chainId: string, token: string, user: string; }) => {
    if(!user) return "0"
    const provider = new RpcProvider({ nodeUrl: chain?.rpcUrls?.public?.http[0] })
    const tokenContract = new Contract(ABI.StarknetErc20ABi, token, provider)
    const resp = await tokenContract.balanceOf(user)
    
    return new BigNumber(resp.balance.low).toString()
  };

  const type = "Starknet"

  const vm = [
    VM.CAIROVM
  ]


  const checkAddress = (address: string) => {
    if (address?.length <= 50) {
      return false
    }
    try {
      return !!validateAndParseAddress(address)
    } catch (error) {
      return false
    }
  };

  const transfer = async ({ params, approve}: any) => {
    if(!account) return ""
    const {transaction_hash} = await account.execute([
      approve.raw,
      params,
    ])
    return transaction_hash;
  };

  const connect = async () => {
    setWalletType(type)      
  };

  const emitGas = async () => {
    return "";
  };

  return ({
    address: (address || "")?.toLocaleLowerCase(),
    chainId: String(chain?.network || ""),
    chainName: chain?.name || "",
    vm,
    switchChain,
    getBalance,
    connect,
    checkAddress,
    transfer,
    walletId: connector?.id || '',
    walletName: connector?.name || '',
    walletIcon: connector?.icon?.light ||  '',
    disConnectAsync: disconnectAsync,
    isMainnet: !chain?.testnet,
    emitGas,
    type,
    checkChain,
    defaultChain: "SN_MAIN"
  });
}
