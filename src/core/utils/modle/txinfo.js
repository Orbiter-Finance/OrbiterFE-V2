export default {
  getTxInfoWithEtherScan: function(etherScanInfo) {
    const txInfo = {
      from: etherScanInfo.from.toLowerCase(),
      to: etherScanInfo.to.toLowerCase(),
      tokenAddress: etherScanInfo.contractAddress.toLowerCase(),
      timeStamp: etherScanInfo.timeStamp,
      tokenName: etherScanInfo.tokenSymbol,
      value: etherScanInfo.value,
      tokenDecimal: etherScanInfo.tokenDecimal,
      hash: etherScanInfo.hash,
      nonce: etherScanInfo.nonce,
      dataFrom: 'etherscan',
    }
    return txInfo
  },
  getTxInfoWithPolygon: function(scanInfo) {
    // tokenName WETH to ETH
    let tokenName = scanInfo.tokenSymbol
    if (tokenName?.toUpperCase() == 'WETH') {
      tokenName = 'ETH'
    }

    const txInfo = {
      from: scanInfo.from.toLowerCase(),
      to: scanInfo.to.toLowerCase(),
      tokenAddress: scanInfo.contractAddress.toLowerCase(),
      timeStamp: scanInfo.timeStamp,
      tokenName,
      value: scanInfo.value,
      tokenDecimal: scanInfo.tokenDecimal,
      hash: scanInfo.hash,
      nonce: scanInfo.nonce,
      dataFrom: 'polygon',
    }
    return txInfo
  },
  getTxInfoWithZksync: function(zkSyncInfo, zkTokenInfo) {
    const txInfo = {
      from: zkSyncInfo.op.from.toLowerCase(),
      to: zkSyncInfo.op.to.toLowerCase(),
      tokenAddress: zkTokenInfo.address.toLowerCase(),
      timeStamp: zkSyncInfo.timestamp,
      tokenName: zkTokenInfo.symbol,
      value: zkSyncInfo.op.amount,
      tokenDecimal: zkTokenInfo.decimals,
      hash: zkSyncInfo.txHash,
      nonce: zkSyncInfo.op.nonce,
      dataFrom: 'zksync',
    }
    return txInfo
  },
}
