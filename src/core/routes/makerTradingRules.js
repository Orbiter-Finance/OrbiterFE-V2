var etherscan = require('../actions/etherscan')
var arbitrum = require('../actions/arbitrum')
var thirdapi = require('../actions/thirdapi')

var process = require('../utils/process')

var TxInfo = require('../utils/modle/txinfo')

export default {
  getMakerPoolRealDepositAmount: async function (req, next) {
    /*
      Req:
      maker: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
      pool: {
          c1ID,c2ID,
          c1Name,c2Name,
          t1Address,t2Address,tName,
          minPrice,maxPrice,
          batchLimit,fee,
          avalibleDeposit
      },
      zkParam: {
        zkFrom,zkLimit,zkDirection,zkAddress
      },
      daysAgo:5000
    */
    var L1FromTxList = new Array()
    var L1ToTxList = new Array()
    var ZKFromTxList = new Array()
    var ZKToTxList = new Array()
    var ARFromTxList = new Array()
    var ARToTxList = new Array()
    var L1Ready = false
    var ZKReady = false
    var ArReady = false
    // 1.(0:mainNet   1:zk   2:Ar)
    // 1.1 Get N day ago timestramp
    var nowTimeStamp = Date.parse(new Date()) / 1000
    var needTimeStamp = nowTimeStamp - 86400 * (req.daysAgo ? req.daysAgo : 7)

    if (req.pool.c1ID === 1 || req.pool.c2ID === 1) {
      L1Ready = true
      var etherTokenAddress =
        req.pool.c1ID === 1 ? req.pool.t1Address : req.pool.t2Address
      var ethScanReq = {
        timestamp: needTimeStamp,
        closest: 'before',
      }
      var ethScanStartBlock = 0

      try {
        var resp = await etherscan.getBlockNumberWithTimeStamp(ethScanReq, next)
        if (resp.status === '1' && resp.message === 'OK') {
          ethScanStartBlock = resp.result
        } else {
          ethScanStartBlock = 0
        }
      } catch (error) {
        console.warn('ethScanStartBlockError =', error)
      }

      var ethscanReq = {
        maker: req.maker,
        tokenAddress: etherTokenAddress,
        startblock: ethScanStartBlock,
        endblock: 999999999,
      }
      try {
        var res = await etherscan.getTransationList(ethscanReq, next)
        var avalibleTimes = req.pool.avalibleTimes
        for (const i in res.result) {
          if (Object.hasOwnProperty.call(res.result, i)) {
            const etherscanInfo = res.result[i]
            var txinfo = TxInfo.getTxInfoWithEtherScan(etherscanInfo)
            if (txinfo.from === req.maker) {
              L1FromTxList.push(txinfo)
            } else if (txinfo.to === req.maker) {
              var isMatch = false
              for (const j in avalibleTimes) {
                if (Object.hasOwnProperty.call(avalibleTimes, j)) {
                  const time = avalibleTimes[j]
                  if (
                    time.startTime <= txinfo.timeStamp &&
                    time.endTime >= txinfo.timeStamp
                  ) {
                    isMatch = true
                  }
                }
              }
              if (isMatch) {
                L1ToTxList.push(txinfo)
              }
            } else {
              // doNothiing
            }
          }
        }
      } catch (error) {
        console.warn('ethError =', error)
      }
    }

    if (req.pool.c1ID === 3 || req.pool.c2ID === 3) {
      ZKReady = true
      var zkTokenInfoReq = {
        token: req.zkParam.zkTokenAddress, // id or address
      }
      var zkTokenInfo
      try {
        zkTokenInfo = await thirdapi.getZKTokenInfo(zkTokenInfoReq, next)
      } catch (error) {
        console.warn('zkError =', error)
      }

      var lastHash = 0
      var isContiue = true
      while (isContiue) {
        try {
          var zkScanReq1 = {
            from: lastHash ? lastHash : req.zkParam.zkFrom,
            limit: req.zkParam.zkLimit,
            direction: req.zkParam.zkDirection,
            zkAddress: req.zkParam.maker,
          }
          var zkInfo = await thirdapi.getZKInfo(zkScanReq1, next)
          var zkList = zkInfo.result.list
          var zkAvalibleTimes = req.pool.avalibleTimes
          if (zkList === 0) {
            break
          } else {
            for (const i in zkList) {
              if (Object.hasOwnProperty.call(zkList, i)) {
                const tx = zkList[i]
                if (lastHash === tx.txHash) {
                  if (zkList.length === 1) {
                    isContiue = false
                    break
                  } else {
                    continue
                  }
                }
                lastHash = tx.txHash
                if (tx.op.token !== zkTokenInfo.result.id) {
                  continue
                }
                var strtime = tx.createdAt
                var date = new Date(
                  strtime
                    .replace(/-/g, '/')
                    .replace(/T/g, '/')
                    .replace(/Z/g, '/')
                )
                var timestamp = Date.parse(date) / 1000
                if (timestamp >= needTimeStamp) {
                  tx.timestamp = timestamp
                  var zk_txinfo = TxInfo.getTxInfoWithZksync(
                    tx,
                    zkTokenInfo.result
                  )
                  if (zk_txinfo.from === req.zkParam.maker) {
                    ZKFromTxList.push(zk_txinfo)
                  } else if (zk_txinfo.to === req.zkParam.maker) {
                    var zk_isMatch = false
                    for (const j in zkAvalibleTimes) {
                      if (Object.hasOwnProperty.call(zkAvalibleTimes, j)) {
                        const time = zkAvalibleTimes[j]
                        if (
                          time.startTime <= zk_txinfo.timeStamp &&
                          time.endTime >= zk_txinfo.timeStamp
                        ) {
                          zk_isMatch = true
                        }
                      }
                    }
                    if (zk_isMatch) {
                      ZKToTxList.push(zk_txinfo)
                    }
                  } else {
                    // doNothiing
                  }
                } else {
                  isContiue = false
                  break
                }
              }
            }
          }
        } catch (error) {
          console.warn('zkError =', error)
        }
      }
    }
    // 4
    if (req.pool.c1ID === 2 || req.pool.c2ID === 2) {
      var arTokenAddress =
        req.pool.c1ID === 2 ? req.pool.t1Address : req.pool.t2Address
      L1Ready = true
      var arScanReq = {
        timestamp: needTimeStamp,
        closest: 'before',
      }
      var ArScanStartBlock = 0

      try {
        var arResp = await arbitrum.getBlockNumberWithTimeStamp(arScanReq, next)
        if (arResp.status === '1' && arResp.message === 'OK') {
          ArScanStartBlock = arResp.result
        } else {
          ArScanStartBlock = 0
        }
      } catch (error) {
        console.warn('ArScanStartBlockError =', error)
      }

      var ArReq = {
        maker: req.maker,
        tokenAddress: arTokenAddress,
        startblock: ArScanStartBlock,
        endblock: 999999999,
      }
      try {
        var ArRes = await arbitrum.getTransationList(ArReq, next)
        var ArAvalibleTimes = req.pool.avalibleTimes
        for (const i in ArRes.result) {
          if (Object.hasOwnProperty.call(res.result, i)) {
            const ArScanInfo = res.result[i]
            var ArTxinfo = TxInfo.getTxInfoWithEtherScan(ArScanInfo)
            if (ArTxinfo.from === req.maker) {
              ARFromTxList.push(ArTxinfo)
            } else if (ArTxinfo.to === req.maker) {
              var ArIsMatch = false
              for (const j in ArAvalibleTimes) {
                if (Object.hasOwnProperty.call(ArAvalibleTimes, j)) {
                  const time = ArAvalibleTimes[j]
                  if (
                    time.startTime <= ArTxinfo.timeStamp &&
                    time.endTime >= ArTxinfo.timeStamp
                  ) {
                    ArIsMatch = true
                  }
                }
              }
              if (ArIsMatch) {
                ARToTxList.push(ArTxinfo)
              }
            } else {
              // doNothiing
            }
          }
        }
      } catch (error) {
        console.warn('ethError =', error)
      }
    }

    var match1, firstToList, match2, secondToList
    if (!L1Ready) {
      match1 = matchTx(ARToTxList, ZKFromTxList, req.pool)
      firstToList = match1.to
      match2 = matchTx(ZKToTxList, ARFromTxList, req.pool)
      secondToList = match2.to
    }
    if (!ZKReady) {
      match1 = matchTx(L1ToTxList, ARFromTxList, req.pool)
      firstToList = match1.to
      match2 = matchTx(ARToTxList, L1FromTxList, req.pool)
      secondToList = match2.to
    }
    if (!ArReady) {
      match1 = matchTx(L1ToTxList, ZKFromTxList, req.pool)
      firstToList = match1.to
      match2 = matchTx(ZKToTxList, L1FromTxList, req.pool)
      secondToList = match2.to
    }
    var toBeReturnedAmount = 0
    for (const i in firstToList) {
      if (Object.hasOwnProperty.call(firstToList, i)) {
        const tx = firstToList[i]
        toBeReturnedAmount += parseInt(
          process.realAmount(tx.value, tx.tokenDecimal, 5)
        )
      }
    }
    for (const j in secondToList) {
      if (Object.hasOwnProperty.call(secondToList, j)) {
        const tx = secondToList[j]
        toBeReturnedAmount += parseInt(
          process.realAmount(tx.value, tx.tokenDecimal, 5)
        )
      }
    }
    return toBeReturnedAmount
  },
}

function matchTx(toList, fromList, pool) {
  var newToList = toList.slice(0)
  var newFromList = fromList.slice(0)
  if (toList.length === 0 || fromList.length === 0) {
    return {
      to: newToList,
      from: newFromList,
    }
  } else {
    for (const i in toList) {
      if (Object.hasOwnProperty.call(toList, i)) {
        var toTxInfo = toList[i]
        var toNonce = toTxInfo.nonce.toString()
        for (const j in fromList) {
          if (Object.hasOwnProperty.call(fromList, j)) {
            var fromTxInfo = fromList[j]
            var fromAmount = fromTxInfo.value
            var isMatch = fromAmount.endsWith(toNonce)
            if (isMatch) {
              if (fromTxInfo.to === toTxInfo.from) {
                var realToAmount = process.realAmount(
                  toTxInfo.value,
                  toTxInfo.tokenDecimal,
                  5
                )
                var realFromAmount = process.realAmount(
                  fromAmount,
                  fromTxInfo.tokenDecimal,
                  5
                )

                if (realToAmount * (1 - pool.fee / 10000) === realFromAmount) {
                  var toIndex = process.getIndexInArr(newToList, toTxInfo)
                  var fromIndex = process.getIndexInArr(newFromList, fromTxInfo)
                  if ((toIndex !== -1) & (fromIndex !== -1)) {
                    newToList.splice(toIndex, 1)
                    newFromList.splice(fromIndex, 1)
                  }
                } else {
                  continue
                }
              }
            } else {
              continue
            }
          }
        }
      }
    }
    return {
      to: newToList,
      from: newFromList,
    }
  }
}
