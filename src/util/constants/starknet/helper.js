import BigNumber from 'bignumber.js'
import { ec, Account, Contract, Provider, uint256, stark } from 'starknet';
import util from '../../util'
import erc20Abi from './erc20_abi.json'
import starkNetCrossAbi from './ob_source_abi.json'
import { Notification } from 'element-ui'

import {
  getStarknet,
  connect as getStarknetWallet,
  disconnect as disStarknetWallet,
} from 'get-starknet'

import { store } from '../../../store'
import { UINT_256_MAX } from 'starknet/dist/utils/uint256'
import { CHAIN_ID } from "../../../config";
import { isArgentApp } from "../../env";

const STARKNET_CROSS_CONTRACT_ADDRESS = {
  'mainnet-alpha':
    '0x0173f81c529191726c6e7287e24626fe24760ac44dae2a1f7e02080230f8458b',
  'goerli-alpha':
    '0x0457bf9a97e854007039c43a6cc1a81464bd2a4b907594dabc9132c162563eb3',
}

const L1_TO_L2_ADDRESSES = {
  '0x095d2918b03b2e86d68551dcf11302121fb626c9': {
    'mainnet-alpha':
      '0x0411c2a2a4dc7b4d3a33424af3ede7e2e3b66691e22632803e37e2e0de450940',
    'goerli-alpha':
      '0x050e5ba067562e87b47d87542159e16a627e85b00de331a53b471cee1a4e5a4f',
  },
  '0x0043d60e87c5dd08c86c3123340705a1556c4719': {
    'mainnet-alpha': '',
    'goerli-alpha':
      '0x050e5ba067562e87b47d87542159e16a627e85b00de331a53b471cee1a4e5a4f',
  },
  '0x80c67432656d59144ceff962e8faf8926599bcf8': {
    'mainnet-alpha':
      '0x07b393627bd514d2aa4c83e9f0c468939df15ea3c29980cd8e7be3ec847795f0',
    'goerli-alpha':
      '0x050e5ba067562e87b47d87542159e16a627e85b00de331a53b471cee1a4e5a4f',
  },
}

const GAS_ADDRESS = {
  'mainnet-alpha': {
    address:
      '0x07a4ef69a3d7c647d8d99da0aa0f296c84a22148fa8665e9a52179418b8de54e',
    privateKey:
      '0x53ea9a5da3c9c1232dddf771b4660d07ebea36bfba1ce3619f3e867cb1c49b0',
  },
  'georli-alpha': {
    address:
      '0x07a4ef69a3d7c647d8d99da0aa0f296c84a22148fa8665e9a52179418b8de54e',
    privateKey:
      '0x53ea9a5da3c9c1232dddf771b4660d07ebea36bfba1ce3619f3e867cb1c49b0',
  },
}

function refererUpper() {
  // Don't use [$route.query.referer], because it will delay
  const { href } = window.location
  const match = href.match(/referer=(\w*)/i)
  if (match?.[1]) {
    return match[1].toUpperCase()
  }
  return ''
}

export async function connectStarkNetWallet() {
  if (!getStarknet().isConnected) {
    const refer = refererUpper()

    const isArgentX = refer === 'argent'.toUpperCase()
    const isBraavos = refer === 'braavos'.toUpperCase()

    const obj = {
      order: isArgentX
        ? ['argentX']
        : isBraavos
          ? ['braavos']
          : ['argentX', 'braavos'],
    }
    const wallet = await getStarknetWallet(obj)
    if (!wallet) {
      return
    }
    const enabled = await wallet
      .enable({ showModal: false })
      .then((address) => !!address?.length)

    if (enabled) {
      console.log("starknet address", getStarknet().selectedAddress);
      store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
      store.commit('updateStarkNetWalletName', wallet.name)
      store.commit('updateStarkNetWalletIcon', wallet.icon)
      store.commit('updateStarkNetChain', getStarkNetCurrentChainId())
      store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
      getStarknet().on('accountsChanged', (e) => {
        store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
        store.commit('updateStarkNetChain', getStarkNetCurrentChainId())
        store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
        if (e.length == 0) {
          util.showMessage('disconnect starkNetWallet', 'error')
        }
      })
    }
  }
}

export function getStarkNetCurrentChainId() {
  const baseUrl = getStarknet().provider?.baseUrl ? getStarknet().provider?.baseUrl : getStarknet().provider?.provider?.baseUrl;
  if (baseUrl.includes('alpha-mainnet.starknet.io')) {
    return CHAIN_ID.starknet
  } else if (baseUrl.includes('alpha4.starknet.io')) {
    return CHAIN_ID.starknet_test
  } else if (baseUrl.match(/^https?:\/\/localhost.*/)) {
    return 'localhost'
  } else {
    return 'unlogin'
  }
}

export async function disConnectStarkNetWallet() {
  const dis = await disStarknetWallet({
    clearLastWallet: true,
    clearDefaultWallet: true,
  })
  if (dis) {
    store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
    store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
  } else {
    store.commit('updateStarkNetAddress', '')
    store.commit('updateStarkNetIsConnect', false)
  }
}

/**
 *
 * @param {string} l1Address ethAddress
 * @param {string} tokenAddress
 * @param {string} receiverAddress
 * @param {number} amount
 */
export async function sendTransfer(
  l1Address,
  tokenAddress,
  makerAddress,
  amount,
  chainID
) {
  console.log('step 1')
  l1Address = l1Address.toLowerCase()
  tokenAddress = tokenAddress.toLowerCase()
  makerAddress = makerAddress.toLowerCase()
  const networkID = getNetworkIdByChainId(chainID)
  const network = networkID === 1 ? 'mainnet-alpha' : 'goerli-alpha'

  const contractAddress = STARKNET_CROSS_CONTRACT_ADDRESS[network]
  console.log('step 2', 'l1Address', l1Address, 'tokenAddress', tokenAddress, 'makerAddress', makerAddress, 'contractAddress', contractAddress,'network',network);
  const provider = new Provider({ network })
  const tokenContract = new Contract(
    erc20Abi,
    tokenAddress,
    provider
  )
  console.log('step 3');
  const allowance = await getAllowance(tokenContract, contractAddress);
  console.log("allowance ====", allowance.toString());
  const crossContract = new Contract(
    starkNetCrossAbi,
    contractAddress,
    getStarknet().provider
  );
  const receiverAddress = makerAddress;

  try {
    let tx;
    if (amount.gt(allowance)) {
      const approveTxCall = getApproveTxCall(contractAddress, tokenContract.address);
      const transferERC20TxCall = getTransferERC20TxCall(tokenAddress, receiverAddress, l1Address, amount, crossContract.address);
      console.log("approve and transferERC20 Call ====", [approveTxCall, transferERC20TxCall]);
      tx = await getStarknet().account.execute([approveTxCall, transferERC20TxCall]);
    } else {
      const transferERC20TxCall = getTransferERC20TxCall(tokenAddress, receiverAddress, l1Address, amount, crossContract.address);
      console.log("getTransferERC20TxCall ====", transferERC20TxCall);
      tx = await getStarknet().account.execute(transferERC20TxCall);
    }
    return tx?.transaction_hash;
  } catch (e) {
    util.showMessage(e.message, 'error');
  }
  return null;
}

function getApproveTxCall(spender, contractAddress) {
  const calldata = stark.compileCalldata({
    spender,
    amount: getUint256CalldataFromBN(String(UINT_256_MAX)),
  });

  return {
    contractAddress,
    entrypoint: 'approve',
    calldata,
  };
}

function getTransferERC20TxCall(tokenAddress, receiverAddress, l1Address, amount, contractAddress) {
  const calldata = stark.compileCalldata({
    token: tokenAddress,
    to: receiverAddress,
    amount: getUint256CalldataFromBN(String(amount)),
    ext: l1Address,
  });
  return {
    contractAddress,
    entrypoint: 'transferERC20',
    calldata,
  };
}

/**
 * @param {Contract} contractErc20
 */
export async function getAllowance(contractErc20, contractAddress) {
  console.log('step 4')
  const ownerAddress = getStarknet().selectedAddress
  console.log('step 5', ownerAddress);
  const allowance = await contractErc20.allowance(ownerAddress, contractAddress)
  console.log('step 6', allowance);
  return allowance.remaining.low
}

export async function getStarkNonce() {
  try {
    return await getStarknet().account.getNonce()
  } catch (error) {
    return 0
  }
}

export async function getStarkTransferFee(
  l1Address,
  tokenAddress,
  makerAddress,
  amount,
  chainID
) {
  if (!l1Address) return 0;
  l1Address = l1Address.toLowerCase()
  tokenAddress = tokenAddress.toLowerCase()
  makerAddress = makerAddress.toLowerCase()

  const networkID = getNetworkIdByChainId(chainID)
  const network = networkID == 1 ? 'mainnet-alpha' : 'goerli-alpha'
  const contractAddress = STARKNET_CROSS_CONTRACT_ADDRESS[network]

  const provider = new Provider({ network })
  const userSender = new Account(
    provider,
    GAS_ADDRESS[network].address,
    ec.getKeyPair(GAS_ADDRESS[network].privateKey)
  )

  const receiverAddress = makerAddress
  const ethContract = new Contract(erc20Abi, tokenAddress, userSender)
  const crossContract = new Contract(
    starkNetCrossAbi,
    contractAddress,
    userSender
  )

  try {
    const approveTxCall = getApproveTxCall(contractAddress, ethContract.address);
    const transferERC20TxCall = getTransferERC20TxCall(tokenAddress, receiverAddress, l1Address, 0, crossContract.address);
    const { overall_fee } = await userSender.estimateFee([approveTxCall, transferERC20TxCall]);
    return Number(overall_fee);
  } catch (e) {
    console.warn('estError: ', e)
  }
  return 0
}

function getUint256CalldataFromBN(bn) {
  return { type: 'struct', ...uint256.bnToUint256(bn) }
}

/**
 *
 * @param {string} chainId
 * @returns
 */
export function getNetworkIdByChainId(chainId) {
  return chainId === CHAIN_ID.starknet ? 1 : 5
}

/**
 *
 * @param {string} starknetAddress
 * @param {string} contractAddress
 * @param {number} networkId
 * @returns {Promise<number>}
 */
export async function getErc20Balance(
  starknetAddress,
  contractAddress,
  networkId = 1
) {
  if (!starknetAddress || !contractAddress) {
    return 0
  }
  const network = networkId === 1 ? 'mainnet-alpha' : 'georli-alpha'
  const provider = new Provider({ network })
  const tokenContract = new Contract(erc20Abi, contractAddress, provider)
  const resp = await tokenContract.balanceOf(starknetAddress)
  if (!resp || !resp.balance || !resp.balance.low) {
    return 0
  }

  return new BigNumber(resp.balance.low).toNumber()
}
