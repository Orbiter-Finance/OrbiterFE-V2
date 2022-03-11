if (fromChainID === 3 || fromChainID === 33) {
  const syncHttpProvider = await zksync.getDefaultProvider(
    fromChainID === 33 ? 'rinkeby' : 'mainnet'
  )
  let selectMakerInfo = store.getters.realSelectMakerInfo
  let transferAddress = selectMakerInfo.makerAddress
    ? selectMakerInfo.makerAddress
    : null
  if (!transferAddress) {
    return null
  }
  let zkTokenList =
    fromChainID === 3
      ? store.state.zktokenList.mainnet
      : store.state.zktokenList.rinkeby
  let tokenAddress =
    fromChainID === selectMakerInfo.c1ID
      ? selectMakerInfo.t1Address
      : selectMakerInfo.t2Address
  var tokenList = zkTokenList.filter((item) => item.address === tokenAddress)
  let resultToken = tokenList.length > 0 ? tokenList[0] : null
  if (!resultToken) {
    return null
  }
  const fee = await syncHttpProvider.getTransactionFee(
    'Transfer',
    transferAddress,
    resultToken.id
  )
  let totalFee = fee.totalFee

  // When account's nonce is zero(0), add ChangePubKey fee
  try {
    const addressState = await syncHttpProvider.getState(
      store.state.web3.coinbase
    )
    if (!addressState.committed || addressState.committed?.nonce == 0) {
      const changePubKeyFee = await syncHttpProvider.getTransactionFee(
        { ChangePubKey: { onchainPubkeyAuth: false } },
        store.state.web3.coinbase,
        resultToken.id
      )
      totalFee = totalFee.add(changePubKeyFee.totalFee)
    }
  } catch (err) {
    console.error('Get ChangePubKey fee failed: ', err.message)
  }
  return totalFee / 10 ** resultToken.decimals
} else if (util.isEthTokenAddress(fromTokenAddress)) {
  if (fromChainID == 9 || fromChainID == 99) {
    let loopringFee = await loopring.getTransferFee(
      store.state.web3.coinbase,
      fromChainID
    )
    return loopringFee / 10 ** 18
  }
  const web3 = localWeb3(fromChainID)
  if (web3) {
    const estimateGas = await web3.eth.estimateGas({
      from: store.state.web3.coinbase,
      to: makerAddress,
    })
    const gasPrice = await web3.eth.getGasPrice()
    return new BigNumber(estimateGas)
      .multipliedBy(gasPrice)
      .dividedBy(10 ** 18)
      .toNumber()
  }
}
return 0
