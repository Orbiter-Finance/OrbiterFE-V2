import { keyPairFromData } from '@dydxprotocol/starkex-lib'
import BigNumber from 'bignumber.js'
import {
  compileCalldata,
  Contract,
  ec,
  Provider,
  Signer,
  uint256,
} from 'starknet'
import { getSelectorFromName } from 'starknet/dist/utils/stark'
import Web3 from 'web3'
import util from '../../util'
import starknetAccountContract from './account.json'
import erc20Abi from './erc20_abi.json'

const L1_SWAP_L2_CONTRACT_ADDRESS = {
  'mainnet-alpha': '',
  'georli-alpha':
    '0x021c6bbdabdfbf86997471f547d4aa5362787f18b76dad8d3e6b8f3d7471395a',
}

const L1_TO_L2_ADDRESSES = {
  '0x0043d60e87c5dd08c86c3123340705a1556c4719': {
    'mainnet-alpha': '',
    'georli-alpha':
      '0x2b31ce585a1f407cb3b414e2a71ee45c4430b4df36c8528ab42c0bcee97a887',
  },
  '0x694434ec84b7a8ad8efc57327ddd0a428e23f8d5': {
    'mainnet-alpha': '',
    'georli-alpha':
      '0x16be82b640500a9b877cef93f9bee5e4aa962220ea5468fcc3c5889742162af',
  },
}

function stripHexPrefix(input) {
  if (input.indexOf('0x') === 0) {
    return input.substr(2)
  }
  return input
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
 * @param {string} l1Address ethAddress
 * @param {number} networkId
 * @returns { Promise<{ privateKey: string, publicKey: string, publicKeyYCoordinate: string, starknetAddress: string }> }
 */
export async function getStarknetAccount(l1Address, networkId = 1) {
  if (!l1Address) {
    throw new Error('Sorry, miss l1 address!')
  }

  const storageKey = `starknetAccount:${networkId}:${l1Address}`
  const localValue = localStorage.getItem(storageKey)
  if (localValue) {
    try {
      const _sAccount = JSON.parse(localValue)
      if (
        _sAccount.privateKey &&
        _sAccount.publicKey &&
        _sAccount.publicKeyYCoordinate &&
        _sAccount.starknetAddress
      ) {
        return _sAccount
      }
    } catch (err) {
      console.error(err)
    }
  }

  const web3 = new Web3(window.ethereum)

  // Change matemask chainId
  const nowNetworkId = await web3.eth.net.getId()
  if (nowNetworkId != networkId) {
    const switchParams = {
      chainId: web3.utils.toHex(networkId),
    }
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [switchParams],
    })
  }

  const msgParams = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Message: [
        { name: 'action', type: 'string' },
        { name: 'onlySignOn', type: 'string' },
      ],
    },
    primaryType: 'Message',
    domain: {
      name: 'Orbiter',
      version: '1',
      chainId: networkId,
      verifyingContract: '',
    },
    message: {
      action: 'Orbiter STARK Key',
    },
  }
  if (networkId == 1) {
    msgParams.message['onlySignOn'] =
      'https://app.orbiter.finance or https://orbiter.finance'
  }

  const params = [l1Address, JSON.stringify(msgParams)]
  const method = 'eth_signTypedData_v3'

  const getKeyPair = () => {
    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync(
        {
          method,
          params,
          coinbase: l1Address,
          jsonrpc: '2.0',
          id: Date.now(),
        },
        (err, response) => {
          if (err) {
            reject(err)
            return
          }
          if (!response.result) {
            reject(new Error('Sorry, metamask no result!'))
          }

          const keypPair = keyPairFromData(
            Buffer.from(stripHexPrefix(response.result), 'hex')
          )

          resolve(keypPair)
        }
      )
    })
  }

  const keyPair = await getKeyPair()
  keyPair.publicKey = '0x' + keyPair.publicKey
  keyPair.privateKey = '0x' + keyPair.privateKey
  keyPair.publicKeyYCoordinate = '0x' + keyPair.publicKeyYCoordinate

  // Deploy account contract
  const provider = new Provider({
    network: networkId == 1 ? 'mainnet-alpha' : 'georli-alpha',
  })
  const deployTransaction = await provider.deployContract(
    starknetAccountContract,
    compileCalldata({ signer: keyPair.publicKey, guardian: '0' }),
    keyPair.privateKey
  )

  if (
    deployTransaction.code !== 'TRANSACTION_RECEIVED' ||
    !deployTransaction.address
  ) {
    throw new Error('Deploy starknet account failed!')
  }

  const starknetAccount = {
    ...keyPair,
    starknetAddress: deployTransaction.address,
  }
  localStorage.setItem(storageKey, JSON.stringify(starknetAccount))

  // Save L1 <=> L2 on background
  saveMappingL1AndL2(l1Address, networkId)

  return starknetAccount
}

const starknetAccountSingleLock = {}
export async function getStarknetAccountSingle(l1Address, networkId = 1) {
  const lockKey = `${l1Address}:${networkId}`

  if (starknetAccountSingleLock[lockKey] === undefined) {
    try {
      starknetAccountSingleLock[lockKey] = ''
      const account = await getStarknetAccount(l1Address, networkId)
      starknetAccountSingleLock[lockKey] = account

      return account
    } catch (err) {
      delete starknetAccountSingleLock[lockKey]
      throw err
    }
  } else {
    while (starknetAccountSingleLock[lockKey] === '') {
      await util.sleep(1000)
    }
    return starknetAccountSingleLock[lockKey]
  }
}

/**
 *
 * @param {string} l1Address ethAddress
 * @param {number} networkId
 * @returns {Promise<Signer>}
 */
export async function getStarknetSigner(l1Address, networkId = 1) {
  const starknetAccount = await getStarknetAccount(l1Address, networkId)

  const network = networkId == 1 ? 'mainnet-alpha' : 'georli-alpha'
  const provider = new Provider({ network })
  return new Signer(
    provider,
    starknetAccount.starknetAddress,
    ec.getKeyPair(starknetAccount.privateKey)
  )
}

/**
 *
 * @param {string} l1Address ethAddress
 * @param {number} networkId
 */
export async function saveMappingL1AndL2(l1Address, networkId = 1) {
  if (!l1Address) {
    throw new Error('Sorry, miss l1 address!')
  }

  const network = networkId == 1 ? 'mainnet-alpha' : 'georli-alpha'
  const contractAddress = L1_SWAP_L2_CONTRACT_ADDRESS[network]

  const starknetSigner = await getStarknetSigner(l1Address, networkId)

  // Wait account deploy
  const now = new Date().getTime()
  while (new Date().getTime() - now < 1000000) {
    try {
      const provider = new Provider({ network })
      const resp = await provider.callContract({
        contract_address: starknetSigner.address,
        entry_point_selector: getSelectorFromName('get_nonce'),
      })

      if (typeof resp.result?.[0] !== 'undefined') {
        console.log(
          'Starknet account deploy succeed: ' + starknetSigner.address
        )
        break
      }
    } catch (err) {
      console.warn('Starknet account deploy failed or waiting: ' + err.message)
    }

    await util.sleep(1000)
  }

  const resp = await starknetSigner.invokeFunction(
    contractAddress,
    getSelectorFromName('save_address'),
    compileCalldata({ l1: l1Address })
  )

  if (resp.code != 'TRANSACTION_RECEIVED') {
    throw new Error('MappingL1AndL2 failed!')
  }

  return resp.transaction_hash
}

/**
 *
 * @param {string} l1Address ethAddress
 * @param {number} networkId
 * @returns { Promise<string|undefined> }
 */
export async function getL2AddressByL1(l1Address, networkId = 1) {
  if (!l1Address) {
    throw new Error('Sorry, miss l1 address!')
  }
  l1Address = l1Address.toLowerCase()

  const network = networkId == 1 ? 'mainnet-alpha' : 'georli-alpha'

  // When l1 address on L1_TO_L2_ADDRESSES, get it
  if (L1_TO_L2_ADDRESSES[l1Address]?.[network]) {
    return L1_TO_L2_ADDRESSES[l1Address][network]
  }

  // When l1 address on localStorage, get it
  const storageKey = `starknetAccount:${networkId}:${l1Address}`
  const localValue = localStorage.getItem(storageKey)
  if (localValue) {
    try {
      const _sAccount = JSON.parse(localValue)
      if (_sAccount.starknetAddress) {
        return _sAccount.starknetAddress
      }
    } catch (err) {
      console.error(err)
    }
  }

  const provider = new Provider({ network })
  const contractAddress = L1_SWAP_L2_CONTRACT_ADDRESS[network]

  const resp = await provider.callContract({
    contract_address: contractAddress,
    entry_point_selector: getSelectorFromName('get_l2_address'),
    calldata: compileCalldata({ l1: l1Address }),
  })

  return resp?.result?.[0]
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
  const resp = await tokenContract.call('balanceOf', {
    user: starknetAddress,
  })
  if (!resp || !resp.balance || !resp.balance['low']) {
    return 0
  }

  return new BigNumber(resp.balance['low']).toNumber()
}

/**
 *
 * @param {string} l1Address ethAddress
 * @param {string} contractAddress
 * @param {number} networkId
 * @returns { Promise<number> }
 */
export async function getErc20BalanceByL1(
  l1Address,
  contractAddress,
  networkId = 1
) {
  const starknetAddress = await getL2AddressByL1(l1Address, networkId)

  return await getErc20Balance(starknetAddress, contractAddress, networkId)
}

/**
 *
 * @param {string} l1Address ethAddress
 * @param {string} contractAddress
 * @param {string} receiverStarknetAddress
 * @param {number} amount
 * @param {number} networkId
 */
export async function sendTransaction(
  l1Address,
  contractAddress,
  receiverStarknetAddress,
  amount,
  networkId = 1
) {
  if (!contractAddress || !receiverStarknetAddress) {
    throw new Error('Sorry, Miss params!')
  }
  if (amount <= 0) {
    throw new Error('Sorry, amount is less than 0!')
  }

  const starknetSigner = await getStarknetSigner(l1Address, networkId)
  const resp = await starknetSigner.invokeFunction(
    contractAddress,
    getSelectorFromName('transfer'),
    compileCalldata({
      receiver: receiverStarknetAddress,
      amount: getUint256CalldataFromBN(String(amount)),
    })
  )
  if (resp.code != 'TRANSACTION_RECEIVED') {
    throw new Error('Starknet sendTransaction failed!')
  }

  return resp.transaction_hash
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
