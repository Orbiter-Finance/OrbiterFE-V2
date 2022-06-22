import BigNumber from 'bignumber.js'
import { ec, Account, Contract, Provider, uint256, stark } from 'starknet'
import util from '../../util'
import erc20Abi from './erc20_abi.json'
import starkNetCrossAbi from './ob_source_abi.json'
import { Notification } from 'element-ui'

import {
  getStarknet,
  connect as getStarknetWallet,
  disconnect as disStarknetWallet,
} from 'get-starknet-wallet'

import { store } from '../../../store'
import { UINT_256_MAX } from 'starknet/dist/utils/uint256'

const STARKNET_CROSS_CONTRACT_ADDRESS = {
  'mainnet-alpha': '',
  'georli-alpha':
    '0x0457bf9a97e854007039c43a6cc1a81464bd2a4b907594dabc9132c162563eb3',
}

const L1_TO_L2_ADDRESSES = {
  '0x0043d60e87c5dd08c86c3123340705a1556c4719': {
    'mainnet-alpha': '',
    'georli-alpha':
      '0x33b88fc03a2ccb1433d6c70b73250d0513c6ee17a7ab61c5af0fbe16bd17a6e',
  },
  '0x694434ec84b7a8ad8efc57327ddd0a428e23f8d5': {
    'mainnet-alpha': '',
    'georli-alpha':
      '0x33b88fc03a2ccb1433d6c70b73250d0513c6ee17a7ab61c5af0fbe16bd17a6e',
  },
  '0x8a3214f28946a797088944396c476f014f88dd37': {
    'mainnet-alpha': '',
    'georli-alpha':
      '0x33b88fc03a2ccb1433d6c70b73250d0513c6ee17a7ab61c5af0fbe16bd17a6e',
  },
  '0x80c67432656d59144ceff962e8faf8926599bcf8': {
    'mainnet-alpha':
      '0x07c57808B9CEA7130C44aaB2F8CA6147B04408943b48c6d8C3C83eB8Cfdd8C0b',
    'georli-alpha':
      '0x33b88fc03a2ccb1433d6c70b73250d0513c6ee17a7ab61c5af0fbe16bd17a6e',
  },
}

const GAS_ADDRESS = {
  'mainnet-alpha': {
    address: '',
    privateKey: '',
  },
  'georli-alpha': {
    address:
      '0x00e99e130053ae185ab9a3f1fd059e1c3eb58eb1037a7a9b91c945456bcfbc0d',
    privateKey:
      '0x9de8163ea816b568c2dcd50511e8a21cb3c3f7b57464d1b8ee84ea7e7bdab8',
  },
}

export async function getStarkMakerAddress(makerAddress, chainID) {
  makerAddress = makerAddress.toLowerCase()
  let networkID = getNetworkIdByChainId(chainID)
  const network = networkID == 1 ? 'mainnet-alpha' : 'georli-alpha'
  const receiverAddress = L1_TO_L2_ADDRESSES[makerAddress][network]
  return receiverAddress
}

export async function connectStarkNetWallet() {
  if (!getStarknet().isConnected) {
    const wallet = await getStarknetWallet()
    if (!wallet) {
      return
    }
    const enabled = await wallet
      .enable({ showModal: false })
      .then((address) => !!address?.length)

    if (enabled) {
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
          console.warn('disconnect starkNetWallet')
        }
      })
    }
  }
}

export function getStarkNetCurrentChainId() {
  const { baseUrl } = getStarknet().provider
  if (baseUrl.includes('alpha-mainnet.starknet.io')) {
    return '4'
  } else if (baseUrl.includes('alpha4.starknet.io')) {
    return '44'
  } else if (baseUrl.match(/^https?:\/\/localhost.*/)) {
    return 'localhost'
  } else {
    return 'unlogin'
  }
}

export async function disConnectStarkNetWallet() {
  const dis = await disStarknetWallet()
  if (dis) {
    store.commit('updateStarkNetAddress', getStarknet().selectedAddress)
    store.commit('updateStarkNetIsConnect', getStarknet().isConnected)
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
  l1Address = l1Address.toLowerCase()
  tokenAddress = tokenAddress.toLowerCase()
  makerAddress = makerAddress.toLowerCase()

  let networkID = getNetworkIdByChainId(chainID)

  const network = networkID == 1 ? 'mainnet-alpha' : 'georli-alpha'

  const contractAddress = STARKNET_CROSS_CONTRACT_ADDRESS[network]

  const tokenContract = new Contract(
    erc20Abi,
    tokenAddress,
    getStarknet().provider
  )

  const allowance = await getAllowance(tokenContract, contractAddress)

  if (amount.gt(allowance)) {
    try {
      await approveERC20(tokenContract, contractAddress, amount)
    } catch (error) {
      util.showMessage(error.message, 'error')
      return 0
    }
  }
  const crossContract = new Contract(
    starkNetCrossAbi,
    contractAddress,
    getStarknet().provider
  )

  const receiverAddress = L1_TO_L2_ADDRESSES[makerAddress][network]
  try {
    const calldata = stark.compileCalldata({
      token: tokenAddress,
      to: receiverAddress,
      amount: getUint256CalldataFromBN(String(amount)),
      ext: l1Address,
    })
    const transaction = {
      contractAddress: crossContract.address,
      entrypoint: 'transferERC20',
      calldata,
    }
    const txhash = await getStarknet().account.execute(transaction)
    if (txhash?.code == 'TRANSACTION_RECEIVED') {
      return txhash.transaction_hash
    }
    return 0
  } catch (ex) {
    util.showMessage(ex.message, 'error')
    return 0
  }
}

/**
 * @param {Contract} contractErc20
 */
export async function getAllowance(contractErc20, contractAddress) {
  const ownerAddress = getStarknet().selectedAddress
  const allowance = await contractErc20.allowance(ownerAddress, contractAddress)
  return allowance['remaining']['low']
}

export async function getStarkNonce() {
  try {
    const nonce = await getStarknet().account.getNonce()
    return nonce
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
  l1Address = l1Address.toLowerCase()
  tokenAddress = tokenAddress.toLowerCase()
  makerAddress = makerAddress.toLowerCase()

  let networkID = getNetworkIdByChainId(chainID)
  const network = networkID == 1 ? 'mainnet-alpha' : 'georli-alpha'
  const contractAddress = STARKNET_CROSS_CONTRACT_ADDRESS[network]

  const provider = new Provider({ network: network })
  const userSender = new Account(
    provider,
    GAS_ADDRESS[network].address,
    ec.getKeyPair(GAS_ADDRESS[network].privateKey)
  )

  const receiverAddress = L1_TO_L2_ADDRESSES[makerAddress][network]
  const ethContract = new Contract(erc20Abi, tokenAddress, userSender)
  const crossContract = new Contract(
    starkNetCrossAbi,
    contractAddress,
    userSender
  )
  let fee = 0
  try {
    const est1 = await ethContract.estimate('approve', [
      contractAddress,
      getUint256CalldataFromBN(String(UINT_256_MAX)),
    ])
    fee += Number(est1.amount)
  } catch (error) {
    console.warn('est1Error:', error)
    return fee
  }

  try {
    let est2 = await crossContract.estimate('transferERC20', [
      tokenAddress,
      receiverAddress,
      getUint256CalldataFromBN(String(0)),
      l1Address,
    ])
    fee += Number(est2.amount)
  } catch (error) {
    console.warn('est2Error: ', error)
    return fee
  }
  return fee
}

/**
 *
 * @param {string} tokenAddress 0x...
 * @param {ethers.BigNumber} amount
 */
export async function approveERC20(tokenContract, contractAddress, amount) {
  let n
  try {
    const calldata = stark.compileCalldata({
      spender: contractAddress,
      amount: getUint256CalldataFromBN(String(UINT_256_MAX)),
    })

    const approveTransaction = {
      contractAddress: tokenContract.address,
      entrypoint: 'approve',
      calldata,
    }

    n = Notification({
      duration: 0,
      title: 'Approving...',
      type: 'warning',
    })

    await getStarknet().account.execute(approveTransaction)

    // Waitting approve succeed
    for (let index = 0; index < 5000; index++) {
      const allowance = await getAllowance(tokenContract, contractAddress)
      if (amount.lte(allowance)) {
        break
      }
      await util.sleep(2000)
    }
    n.close()
  } catch (error) {
    n.close()
    throw error
  }
}

function getUint256CalldataFromBN(bn) {
  return { type: 'struct', ...uint256.bnToUint256(bn) }
}

/**
 *
 * @param {number} chainId
 * @returns
 */
export function getNetworkIdByChainId(chainId) {
  return chainId == 4 ? 1 : 5
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
  const network = networkId == 1 ? 'mainnet-alpha' : 'georli-alpha'
  const provider = new Provider({ network })
  const tokenContract = new Contract(erc20Abi, contractAddress, provider)
  const resp = await tokenContract.balanceOf(starknetAddress)
  if (!resp || !resp.balance || !resp.balance['low']) {
    return 0
  }

  return new BigNumber(resp.balance['low']).toNumber()
}

/**
 *
 * @param {number} chainId
 */
export function getProviderByChainId(chainId) {
  const networkId = getNetworkIdByChainId(chainId)
  const network = networkId == 1 ? 'mainnet-alpha' : 'georli-alpha'
  return new Provider({ network })
}
