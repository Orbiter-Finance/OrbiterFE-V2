import React, { useCallback, useContext, useMemo } from 'react';
import { WalletType } from '../types';
import { useTonConnectUI, useTonWallet, Wallet, WalletInfoWithOpenMethod } from '@tonconnect/ui-react';
import { Address } from '@ton/core';
import { VM } from '../constant';
import TonWeb from "tonweb";
import { useWalletConfigContext } from '../providers/WalletConfigProvider';


const bytesToBase64 = (bytes: Uint8Array) => {
  const a = Buffer.from(bytes).toString('base64');
  const b = TonWeb.utils.bytesToBase64(bytes);
  if (a !== b) throw new Error('bytesToBase64');
  return a;
};

const readIntFromBitString = (bs: { get: (arg0: any) => string | number | bigint | boolean; }, cursor: number, bits: number) => {
  let n = BigInt(0);
  for (let i = 0; i < bits; i++) {
    n *= BigInt(2);
    n += BigInt(bs.get(cursor + i));
  }
  return n;
};

const parseAddress = (cell: { bits: any; }) => {
  let n = readIntFromBitString(cell.bits, 3, 8);
  if (n > BigInt(127)) {
    n = n - BigInt(256);
  }
  const hashPart = readIntFromBitString(cell.bits, 3 + 8, 256);
  if (n.toString(10) + ':' + hashPart.toString(16) === '0:0') return null;
  const s = n.toString(10) + ':' + hashPart.toString(16).padStart(64, '0');
  return new TonWeb.Address(s);
};



export function useTon(): WalletType {

  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const { config } = useWalletConfigContext();

  const connect = async () => {
    const res = await tonConnectUI.openModal();
  };

  const { account, appName, name, imageUrl } = (wallet || {}) as (Wallet & WalletInfoWithOpenMethod);

  const tonProvider = useCallback(
    () => {
      return new TonWeb(
        new TonWeb.HttpProvider(config.ton.rpc, {
          apiKey: config.ton.key
        })
      );
    },
    [config],
  );

  const disConnectAsync = async () => {
    try {
      await tonConnectUI.disconnect();
    }
    catch (e) {
      console.log(e);
    }
  };

  const switchChain = async () => {
  };

  const checkChain = (chainId: string) => {
    return true
  };

  const checkAddress = (address: string) => {
    const validNetworks = ['0:', '1:'];
    const validAddressLength = 66;
    const addressLen = 48;
    const OX_ADDRESS = new RegExp('^0x[0-9A-Fa-f]+$');
    if (address.length === addressLen && !OX_ADDRESS.test(address)) {
      return true;
    }

    if (address.length !== validAddressLength) {
      return false;
    }

    const networkIdentifier = address.substring(0, 2);
    if (!validNetworks.includes(networkIdentifier)) {
      return false;
    }

    return true;
  };

  const getBalance = async ({ chainId, token, user, isMainnet }: { chainId: string, token: string, user: string; isMainnet?: boolean; }) => {
    const tonweb = tonProvider();
    const userTonAddress = new TonWeb.Address(user);
    if (
      isMainnet
    ) {
      const res = await tonweb.getBalance(userTonAddress);

      return res;

    } else {
      const cell = new TonWeb.boc.Cell();

      cell.bits.writeAddress(userTonAddress);

      const getWalletAddressResponse = await tonweb.provider.call2(
        token,
        'get_wallet_address',
        [['tvm.Slice', bytesToBase64(await cell.toBoc(false))]]
      );

      const jettonWalletAddress = parseAddress(
        getWalletAddressResponse
      );
      try {
        const jettonWalletData = await tonweb.provider.call2(
          jettonWalletAddress!.toString(true, true, true),
          'get_wallet_data'
        );
        const balance = jettonWalletData[0];
        return balance.toString();
      } catch (e) {
        return "0";
      }
    }
  };

  const getJettonWalletAddress = async ({ tonweb, userAdress, tokenAddress }: any) => {
    const cell = new TonWeb.boc.Cell();

    cell.bits.writeAddress(userAdress);

    const getWalletAddressResponse = await tonweb.provider.call2(
      tokenAddress,
      'get_wallet_address',
      [['tvm.Slice', bytesToBase64(await cell.toBoc(false))]]
    );
    const jettonWalletAddress = parseAddress(getWalletAddressResponse);
    return jettonWalletAddress;
  };


  const transfer = async ({
    params,
    token
  }: any) => {
    const tokenAddress = token.address
    const fromAddress = new TonWeb.Address(account?.address);

    const tonweb = tonProvider();
    const fromJettonWalletAddress = await getJettonWalletAddress({
      tonweb,
      userAdress: fromAddress,
      tokenAddress,
    });

    const { boc } = await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60, // 1 minute
      messages: [
        {
          address: fromJettonWalletAddress!.toString(true, true, true),
          amount: TonWeb.utils.toNano('0.05').toString(),
          payload: params,
        },
      ],
    });

    const hash = await TonWeb.boc.Cell.oneFromBoc(
      TonWeb.utils.base64ToBytes(boc)
    ).hash();
    const hexHash = TonWeb.utils.bytesToHex(hash);
    return hexHash;
  };


  const emitGas = async () => {
    return "";
  };

  return ({
    address: account ? Address.parse(account?.address).toString({ bounceable: false, testOnly: false }) : "",
    chainId: account?.chain || "",
    chainName: "",
    vm: [VM.TVM],
    switchChain,
    getBalance,
    connect,
    checkAddress,
    transfer,
    walletId: appName || '',
    walletName: name || '',
    walletIcon: imageUrl || '',
    disConnectAsync,
    isMainnet: false,
    emitGas,
    type: "Ton",
    checkChain,
    defaultChain: "TON"
  });
}
