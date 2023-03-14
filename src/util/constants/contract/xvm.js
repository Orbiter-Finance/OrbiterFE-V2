import Web3 from 'web3'
import { XVM_ABI } from './contract'
import util from '../../util'
import RLP from 'rlp'
import { transferDataState } from '../../../composition/useTransferData'

export async function XVMSwap(
  provider,
  contractAddress,
  account,
  makerAddress,
  value,
  toWalletAddress
) {
  const { selectMakerConfig, fromChainID } = transferDataState
  const { fromChain, toChain } = selectMakerConfig
  const t1Address = fromChain.tokenAddress
  const fromCurrency = fromChain.symbol
  const toChainId = toChain.id
  const toCurrency = toChain.symbol
  const t2Address = toChain.tokenAddress
  const slippage = selectMakerConfig.slippage
  const expectValue = await util.getExpectValue()
  util.log(selectMakerConfig)
  util.log(
    'expectValue --> ',
    expectValue,
    'makerAddress-->',
    makerAddress,
    'eth value-->',
    value,
    'token-->',
    t1Address,
    'params-->',
    toChainId,
    t2Address,
    toWalletAddress
  )
  const web3 = new Web3(provider || window.web3.currentProvider)
  const sourceData =
    fromCurrency === toCurrency
      ? [toChainId, t2Address, toWalletAddress]
      : [
          toChainId,
          t2Address,
          toWalletAddress,
          web3.utils.toHex(expectValue),
          slippage,
        ]
  const data = RLP.encode(sourceData)
  const contractInstance = new web3.eth.Contract(XVM_ABI, contractAddress)
  if (util.isEthTokenAddress(fromChainID, t1Address)) {
    return contractInstance.methods
      .swap(makerAddress, t1Address, value, data)
      .send({
        from: account,
        value,
      })
  } else {
    const gasLimit = await contractInstance.methods
      .swap(makerAddress, t1Address, value, data)
      .estimateGas({
        from: account,
        gas: 5000000,
      })
    util.log('gasLimit', gasLimit)
    return contractInstance.methods
      .swap(makerAddress, t1Address, value, data)
      .send({
        from: account,
        gas: gasLimit,
      })
  }
}
