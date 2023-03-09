const etherscan = require('../actions/etherscan')
const arbitrum = require('../actions/arbitrum')
const thirdapi = require('../actions/thirdapi')

const process = require('../utils/process')

const TxInfo = require('../utils/modle/txinfo')

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
    const L1FromTxList = new Array()
    const L1ToTxList = new Array()
    const ZKFromTxList = new Array()
    const ZKToTxList = new Array()
    const ARFromTxList = new Array()
    const ARToTxList = new Array()
    let L1Ready = false
    let ZKReady = false
    const ArReady = false
    // 1.(0:mainNet   1:zk   2:Ar)
    // 1.1 Get N day ago timestramp
    const nowTimeStamp = Date.parse(new Date()) / 1000
    const needTimeStamp = nowTimeStamp - 86400 * (req.daysAgo ? req.daysAgo : 7)

    if (req.pool.c1ID === 1 || req.pool.c2ID === 1) {
      L1Ready = true
      const etherTokenAddress =
        req.pool.c1ID === 1 ? req.pool.t1Address : req.pool.t2Address
      const ethScanReq = {
        timestamp: needTimeStamp,
        closest: 'before',
      }
      let ethScanStartBlock = 0

      try {
        const resp = await etherscan.getBlockNumberWithTimeStamp(
          ethScanReq,
          next
        )
        if (resp.status === '1' && resp.message === 'OK') {
          ethScanStartBlock = resp.result
        } else {
          ethScanStartBlock = 0
        }
      } catch (error) {
        console.warn('ethScanStartBlockError =', error)
      }

      const ethscanReq = {
        maker: req.maker,
        tokenAddress: etherTokenAddress,
        startblock: ethScanStartBlock,
        endblock: 999999999,
      }
      try {
        var res = await etherscan.getTransationList(ethscanReq, next)
        const avalibleTimes = req.pool.avalibleTimes
        for (const i in res.result) {
          if (Object.hasOwnProperty.call(res.result, i)) {
            const etherscanInfo = res.result[i]
            const txinfo = TxInfo.getTxInfoWithEtherScan(etherscanInfo)
            if (txinfo.from === req.maker) {
              L1FromTxList.push(txinfo)
            } else if (txinfo.to === req.maker) {
              let isMatch = false
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
      const zkTokenInfoReq = {
        token: req.zkParam.zkTokenAddress, // id or address
      }
      let zkTokenInfo
      try {
        zkTokenInfo = await thirdapi.getZKTokenInfo(zkTokenInfoReq, next)
      } catch (error) {
        console.warn()
        'zk zkTokenInfo Error =', error
      }

      let lastHash = 0
      let isContiue = true
      while (isContiue) {
        try {
          const zkScanReq1 = {
            from: lastHash || req.zkParam.zkFrom,
            limit: req.zkParam.zkLimit,
            direction: req.zkParam.zkDirection,
            zkAddress: req.zkParam.maker,
          }
          const zkInfo = await thirdapi.getZKInfo(zkScanReq1, next)
          const zkList = zkInfo.result.list
          const zkAvalibleTimes = req.pool.avalibleTimes
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
                const strtime = tx.createdAt
                const date = new Date(
                  strtime
                    .replace(/-/g, '/')
                    .replace(/T/g, '/')
                    .replace(/Z/g, '/')
                )
                const timestamp = Date.parse(date) / 1000
                if (timestamp >= needTimeStamp) {
                  tx.timestamp = timestamp
                  const zk_txinfo = TxInfo.getTxInfoWithZksync(
                    tx,
                    zkTokenInfo.result
                  )
                  if (zk_txinfo.from === req.zkParam.maker) {
                    ZKFromTxList.push(zk_txinfo)
                  } else if (zk_txinfo.to === req.zkParam.maker) {
                    let zk_isMatch = false
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
      const arTokenAddress =
        req.pool.c1ID === 2 ? req.pool.t1Address : req.pool.t2Address
      L1Ready = true
      const arScanReq = {
        timestamp: needTimeStamp,
        closest: 'before',
      }
      let ArScanStartBlock = 0

      try {
        const arResp = await arbitrum.getBlockNumberWithTimeStamp(
          arScanReq,
          next
        )
        if (arResp.status === '1' && arResp.message === 'OK') {
          ArScanStartBlock = arResp.result
        } else {
          ArScanStartBlock = 0
        }
      } catch (error) {
        console.warn('ArScanStartBlockError =', error)
      }

      const ArReq = {
        maker: req.maker,
        tokenAddress: arTokenAddress,
        startblock: ArScanStartBlock,
        endblock: 999999999,
      }
      try {
        const ArRes = await arbitrum.getTransationList(ArReq, next)
        const ArAvalibleTimes = req.pool.avalibleTimes
        for (const i in ArRes.result) {
          if (Object.hasOwnProperty.call(res.result, i)) {
            const ArScanInfo = res.result[i]
            const ArTxinfo = TxInfo.getTxInfoWithEtherScan(ArScanInfo)
            if (ArTxinfo.from === req.maker) {
              ARFromTxList.push(ArTxinfo)
            } else if (ArTxinfo.to === req.maker) {
              let ArIsMatch = false
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

    let match1, firstToList, match2, secondToList
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
    let toBeReturnedAmount = 0
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
  const newToList = toList.slice(0)
  const newFromList = fromList.slice(0)
  if (toList.length === 0 || fromList.length === 0) {
    return {
      to: newToList,
      from: newFromList,
    }
  } else {
    for (const i in toList) {
      if (Object.hasOwnProperty.call(toList, i)) {
        const toTxInfo = toList[i]
        const toNonce = toTxInfo.nonce.toString()
        for (const j in fromList) {
          if (Object.hasOwnProperty.call(fromList, j)) {
            const fromTxInfo = fromList[j]
            const fromAmount = fromTxInfo.value
            const isMatch = fromAmount.endsWith(toNonce)
            if (isMatch) {
              if (fromTxInfo.to === toTxInfo.from) {
                const realToAmount = process.realAmount(
                  toTxInfo.value,
                  toTxInfo.tokenDecimal,
                  5
                )
                const realFromAmount = process.realAmount(
                  fromAmount,
                  fromTxInfo.tokenDecimal,
                  5
                )

                if (realToAmount * (1 - pool.fee / 10000) === realFromAmount) {
                  const toIndex = process.getIndexInArr(newToList, toTxInfo)
                  const fromIndex = process.getIndexInArr(
                    newFromList,
                    fromTxInfo
                  )
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
