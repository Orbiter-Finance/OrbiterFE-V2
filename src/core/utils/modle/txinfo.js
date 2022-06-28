export default {
  getTxInfoWithEtherScan: function (etherScanInfo) {
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
  getTxInfoWithBoba: function (etherScanInfo) {
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
      dataFrom: 'boba',
    }
    return txInfo
  },
  getTxInfoWithPolygon: function (scanInfo) {
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
  getTxInfoWithMetis: function (scanInfo) {
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
      dataFrom: 'metis',
    }
    return txInfo
  },
  getTxInfoWithZksync: function (zkSyncInfo, zkTokenInfo) {
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

  getTxInfoWithStarknet: function (starknetInfo) {
    const txInfo = {
      from: starknetInfo.from.toLowerCase(),
      to: starknetInfo.to.toLowerCase(),
      tokenAddress: starknetInfo.contractAddress,
      timeStamp: starknetInfo.timeStamp,
      tokenName: 'ETH', // Now only eth
      value: starknetInfo.value,
      tokenDecimal: 18,
      hash: starknetInfo.hash,
      nonce: starknetInfo.nonce,
      dataFrom: 'starknet',
    }
    return txInfo
  },

  getTxInfoWithLoopring: function (loopringInfo) {
    const txInfo = {
      from: loopringInfo.senderAddress.toLowerCase(),
      to: loopringInfo.receiverAddress.toLowerCase(),
      tokenAddress: loopringInfo.storageInfo.tokenId,
      timeStamp: Math.round(loopringInfo.timestamp / 1000),
      tokenName: loopringInfo.symbol,
      value: loopringInfo.amount,
      tokenDecimal: 18,
      hash: loopringInfo.hash,
      nonce: (loopringInfo.storageInfo.storageId - 1) / 2,
      memo: loopringInfo.memo,
      blockNum: loopringInfo.blockId,
      blockIndex: loopringInfo.indexInBlock,
      dataFrom: 'loopring',
    }
    return txInfo
  },

  getTxInfoWithImmutableX: function (immutableX) {
    const txInfo = {
      from: immutableX.from.toLowerCase(),
      to: immutableX.to.toLowerCase(),
      tokenAddress: immutableX.contractAddress,
      timeStamp: immutableX.timeStamp,
      tokenName: 'ETH', // Now only eth
      value: immutableX.value,
      tokenDecimal: 18,
      hash: immutableX.hash,
      nonce: immutableX.nonce,
      dataFrom: 'ImmutableX',
    }
    return txInfo
  },

  getTxInfoWithZkSpace: function (zkspaceInfo) {
    const txInfo = {
      from: zkspaceInfo.from.toLowerCase(),
      to: zkspaceInfo.to.toLowerCase(),
      tokenAddress: zkspaceInfo.token.id,
      timeStamp: zkspaceInfo.created_at,
      tokenName: zkspaceInfo.token.symbol,
      value: new BigNumber(zkspaceInfo.amount)
        .multipliedBy(new BigNumber(10 ** 18))
        .toString(),
      tokenDecimal: 18,
      hash: zkspaceInfo.tx_hash,
      nonce: zkspaceInfo.nonce,
      dataFrom: 'zkspace',
    }
    return txInfo
  },
}
