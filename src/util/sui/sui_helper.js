import { getWallets } from '@mysten/wallet-standard';
import { web3State } from "../../composition/useCoinbase";
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import util from "../util";
import BigNumber from 'bignumber.js'

const SUI_WALLET_NAME = 'SUI_WALLET_NAME';

const updateWalletName = (str) => {
  sessionStorage.setItem(SUI_WALLET_NAME, str?.toLocaleLowerCase() || '');
};

const readWalletName = () => {
  return sessionStorage.getItem(SUI_WALLET_NAME);
};

const suiAddress = () => {
  return web3State.sui.suiAddress;
};

function getWallet(walletName) {
  walletName = walletName || readWalletName();
  if (String(walletName).toLowerCase().indexOf('sui') !== -1) {
    const walletList = getWallets().get();
    const walletProvider = walletList.find(item => item?.name && item.name?.toLowerCase().indexOf('sui') !== -1);
    if (!walletProvider) return null;
    return {
      connect: walletProvider.features['standard:connect'].connect,
      disconnect: walletProvider.features['standard:disconnect'].disconnect,
      signAndExecuteTransaction: walletProvider.features['sui:signAndExecuteTransaction'].signAndExecuteTransaction
    };
  } else {
    const walletName = readWalletName();
    const walletGroup = window?.[walletName?.toLocaleLowerCase() || ''];
    return walletGroup?.sui || walletGroup;
  }
}

const connect = async (walletName) => {
  updateWalletName(walletName);
  const wallet = getWallet(walletName);
  if (!wallet) {
    util.showMessage(
      'Install ' + (readWalletName() || 'Sui Wallet'),
      'error'
    );
    updateWalletName('');
    return;
  }
  const res = await wallet.connect();
  const address = res?.accounts?.[0]?.address;
  if (address) {
    web3State.sui.suiAddress = address;
    web3State.sui.suiIsConnect = !!address;
    web3State.sui.suiWalletIcon = walletName;
  }
  return address;
};

const disconnect = async () => {
  await getWallet()?.disconnect();
  updateWalletName('');
};

const isConnected = () => {
  return web3State.sui.suiIsConnect;
};

const getBalance = async (userAddress, tokenAddress, chainId) => {
  const chainInfo = util.getV3ChainInfoByChainId(chainId);
  if (!chainInfo) return null;
  const client = new SuiClient({
    url: chainInfo.api.url,
  });
  let balanceResult;
  if (chainInfo.nativeCurrency.address === tokenAddress) {
    balanceResult = await client.getBalance({
      owner: userAddress
    });
  } else {
    balanceResult = await client.getBalance({
      owner: userAddress,
      coinType: tokenAddress,
    });
  }
  return balanceResult?.totalBalance;
};


const transfer = async (
  sender,
  receiverAddress,
  targetAddress,
  tokenAddress,
  value,
  safeCode,
  chainId
) => {
  if (receiverAddress.indexOf('0x') === -1 || receiverAddress.length !== 66) {
    console.log('receiverAddress error', receiverAddress);
    return;
  }
  const wallet = getWallet();
  const chainInfo = util.getV3ChainInfoByChainId(chainId);
  const contractObj = chainInfo?.contract || {};
  let contractAddress;
  for (const address in contractObj) {
    if (contractObj[address] === 'SuiMemoV3') {
      contractAddress = address;
    }
  }
  const tx = new Transaction();
  if (chainInfo.nativeCurrency.address === tokenAddress) {
    const [coin] = tx.splitCoins(tx.gas, [value]);
    tx.transferObjects([coin], receiverAddress);
  } else {
    const client = new SuiClient({
      url: chainInfo.api.url,
    });
    const { data: coins } = await client.getCoins({
      owner: sender,
      coinType: tokenAddress,
    });
    await fetchCoins(tx, coins, receiverAddress, tokenAddress, value);
  }

  tx.moveCall({
    target: `${ contractAddress }::v3::memo`,
    arguments: [tx.pure.string(
      `c=${ safeCode }&t=${ targetAddress }`
    )],
  });
  const res = await wallet.signAndExecuteTransaction({
    transaction: tx,
  });
  console.log('tx', res?.digest);
  return res?.digest
};

async function fetchCoins(tx, networkCoins, to, token, amount) {
  const coinTokenMap = {};
  for (const coin of networkCoins) {
    const coinObjectId = coin.coinObjectId;
    if (!coinTokenMap[coinObjectId]) {
      coinTokenMap[coinObjectId] = new BigNumber(coin.balance);
    }
  }
  let payAmount = new BigNumber(amount);
  let actAmount = new BigNumber(0);
  const transferMsgArr = [];
  for (const coinObjectId in coinTokenMap) {
    if (!+coinTokenMap[coinObjectId]) {
      delete coinTokenMap[coinObjectId];
      continue;
    }
    if (coinTokenMap[coinObjectId].lt(payAmount)) {
      payAmount = payAmount.minus(coinTokenMap[coinObjectId]);
      actAmount = actAmount.plus(coinTokenMap[coinObjectId].toString());
      const [coin] = tx.splitCoins(coinObjectId, [coinTokenMap[coinObjectId].toString()]);
      tx.transferObjects([coin], to);
      transferMsgArr.push(`${coinObjectId} ${coinTokenMap[coinObjectId]}`);
      delete coinTokenMap[coinObjectId];
    } else if (coinTokenMap[coinObjectId].eq(payAmount)) {
      actAmount = actAmount.plus(coinTokenMap[coinObjectId].toString());
      const [coin] = tx.splitCoins(coinObjectId, [coinTokenMap[coinObjectId].toString()]);
      tx.transferObjects([coin], to);
      transferMsgArr.push(`${coinObjectId} ${coinTokenMap[coinObjectId]}`);
      delete coinTokenMap[coinObjectId];
      break;
    } else {
      actAmount = actAmount.plus(payAmount.toString());
      const [coin] = tx.splitCoins(coinObjectId, [payAmount.toString()]);
      tx.transferObjects([coin], to);
      coinTokenMap[coinObjectId] = coinTokenMap[coinObjectId].minus(payAmount);
      transferMsgArr.push(`${coinObjectId} ${payAmount}`);
      break;
    }
  }
  console.log(`sui transfer ${actAmount.toString()} coins: ${transferMsgArr.join(',')}`);
}

const suiHelper = {
  connect,
  isConnected,
  getBalance,
  transfer,
  disconnect,
  suiAddress,
};

export default suiHelper;
