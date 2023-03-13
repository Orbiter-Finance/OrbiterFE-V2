import { sha3 } from 'web3-utils'
/* eslint-disable */
export const IERC20_ABI_JSON = []
export const ZKSYNC2_ABI_JSON = []
export const Forward_ABI = []
import { XVM_ABI } from './contract'
/* eslint-enable */
const ABIMap = new Map()
ABIMap.set('IERC20', {
  json: IERC20_ABI_JSON,
  map: ABIToMapping(IERC20_ABI_JSON),
})
ABIMap.set('Forward', {
  json: Forward_ABI,
  map: ABIToMapping(Forward_ABI),
})
ABIMap.set('XVM', {
  json: XVM_ABI,
  map: ABIToMapping(XVM_ABI),
})

export function ABIToMapping(abi) {
  try {
    const abiMap = new Map()
    for (const abiItem of abi) {
      if (abiItem.name) {
        const signHex = sha3(
          `${abiItem.name}(${abiItem.inputs.map(ABIInputToString).join(',')})`
        )
        if (signHex) {
          abiMap.set(
            abiItem.type === 'event' ? signHex.slice(2) : signHex.slice(2, 10),
            abiItem
          )
        }
      }
    }
    return abiMap
  } catch (error) {
    throw new Error(`Disassembly ABI failed ${error.message}`)
  }
}
export function ABIInputToString(input) {
  if (input.type.includes('tuple')) {
    return `(${input.components.map(ABIInputToString).join(',')})`
  }
  return input.type
}
