export default {
  getTxInfoWithEtherScan: function(etherScanInfo) {
    var txInfo = {
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
  getTxInfoWithZksync: function(zkSyncInfo, zkTokenInfo) {
    var txInfo = {
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
