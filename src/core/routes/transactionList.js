import etherscan from '../actions/etherscan'
import arbitrum from '../actions/arbitrum'
import thirdapi from '../actions/thirdapi'
// import config from '../utils/config'
import TxInfo from '../utils/modle/txinfo'
import thegraph from '../actions/thegraph'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'

export default {
  getTransactionList: async function(req) {
    /*
      Req:
      address: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
      daysAgo: 10
      state: 0 / 1    maker/user
     */
    var originTxList = {}
    var makerList = []
    var L1FromTxList = new Array()
    var L1ToTxList = new Array()
    var ZKFromTxList = new Array()
    var ZKToTxList = new Array()
    var ARFromTxList = new Array()
    var ARToTxList = new Array()
    if (req.state === 1) {
      // user
      // 1.1 Get the full list of makers through theGraph
      await thegraph
        .getAllMakerList(req, true)
        .then((response) => {
          makerList = response.data
        })
        .catch((error) => {
          console.log('getMakerListError =', error)
          throw error.message
        })
      let supportChains = []
      for (const i in makerList) {
        if (Object.hasOwnProperty.call(makerList, i)) {
          let maker = makerList[i]
          if (supportChains.indexOf(maker.c1ID) === -1) {
            supportChains.push(maker.c1ID)
          }
          if (supportChains.indexOf(maker.c2ID) === -1) {
            supportChains.push(maker.c2ID)
          }
        }
      }
      // 2 Get block timestamp N days ago
      let nowTimeStamp = Date.parse(new Date()) / 1000
      let needTimeStamp =
        nowTimeStamp - 86400 * (req.daysAgo ? req.daysAgo : 10)
      // 2.Obtain the full transaction information of the user within the N-day timestamp, and only retain the transaction information of the user<->maker after filtering to generate the original array
      // 2.1 etherscan
      // 2.1.1 Get the block number of daysAgo days ago through etherscan as the starting block for querying transaction information
      if (supportChains.indexOf(1) > -1 || supportChains.indexOf(5) > -1) {
        let chainID = supportChains.indexOf(1) > -1 ? 1 : 5
        let ethScanReq = {
          timestamp: needTimeStamp,
          closest: 'before',
        }
        let ethScanStartBlock = 0
        try {
          let resp = await etherscan.getBlockNumberWithTimeStamp(
            ethScanReq,
            chainID,
          )
          if (resp.status === '1' && resp.message === 'OK') {
            ethScanStartBlock = resp.result
          } else {
            ethScanStartBlock = 0
          }
        } catch (error) {
          console.log('ethScanStartBlockError =', error)
          throw error.message
        }
        // 2.1.2The transaction information of all erc20 tokens under this address obtained from daysAgo days ago to the present through etherscan
        let ethscanReq = {
          maker: req.address,
          startblock: ethScanStartBlock,
          endblock: 999999999,
        }
        try {
          let res = await etherscan.getTransationList(ethscanReq, chainID)
          for (const i in res.result) {
            if (Object.hasOwnProperty.call(res.result, i)) {
              let etherscanInfo = res.result[i]
              let txinfo = TxInfo.getTxInfoWithEtherScan(etherscanInfo)
              let isMatch = false
              for (let j = 0; j < makerList.length; j++) {
                let makerInfo = makerList[j]
                let makerAddress = makerInfo.makerAddress.toLowerCase()
                if (
                  txinfo.from !== makerAddress &&
                  txinfo.to !== makerAddress
                ) {
                  continue
                }
                if (txinfo.tokenName !== makerInfo.tName) {
                  continue
                }
                let avalibleTimes = makerInfo.avalibleTimes
                for (let z = 0; z < avalibleTimes.length; z++) {
                  const avalibleTime = avalibleTimes[z]
                  if (
                    avalibleTime.startTime <= txinfo.timeStamp &&
                    avalibleTime.endTime >= txinfo.timeStamp
                  ) {
                    isMatch = true
                    break
                  }
                }
                if (!isMatch) {
                  continue
                }
                if (txinfo.from === makerAddress) {
                  let pText = orbiterCore.getPTextFromTAmount(
                    chainID,
                    txinfo.value,
                  )
                  let nonce = 0
                  if (pText.state) {
                    nonce = pText.pText
                  }
                  if (Number(nonce) < 9000 && Number(nonce) !== 0) {
                    L1ToTxList.push(txinfo)
                    break
                  }
                } else if (txinfo.to === makerAddress) {
                  if (
                    orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
                  ) {
                    let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
                    let arr2 = [
                      chainID,
                      orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
                    ]
                    if (judgeArrayEqualFun(arr1, arr2)) {
                      L1FromTxList.push(txinfo)
                      break
                    }
                  }
                } else {
                  // doNothiing
                }
              }
            }
          }
        } catch (error) {
          console.log('ethError =', error)
          throw error.message
        }
        originTxList[chainID] = {
          fromList: L1FromTxList,
          toList: L1ToTxList,
        }
        // console.log('L1FromTxList =', L1FromTxList)
        // console.log('L1ToTxList =', L1ToTxList)
      }

      // 2.2 Ar
      if (supportChains.indexOf(2) > -1 || supportChains.indexOf(22) > -1) {
        let chainID = supportChains.indexOf(2) > -1 ? 2 : 22
        let arScanReq = {
          timestamp: needTimeStamp,
          closest: 'before',
        }
        let arScanStartBlock = 0
        try {
          let resp = await arbitrum.getBlockNumberWithTimeStamp(
            arScanReq,
            chainID,
          )
          if (resp.status === '1' && resp.message === 'OK') {
            arScanStartBlock = resp.result
          } else {
            arScanStartBlock = 0
          }
        } catch (error) {
          console.log('arScanStartBlockError =', error)
          throw error.message
        }
        // 2.1.2
        let ArscanReq = {
          maker: req.address,
          startblock: arScanStartBlock,
          endblock: 999999999,
        }
        try {
          let res = await arbitrum.getTransationList(ArscanReq, chainID)
          // console.log('all_ar =', res)
          for (const i in res.result) {
            if (Object.hasOwnProperty.call(res.result, i)) {
              let arscanInfo = res.result[i]
              let txinfo = TxInfo.getTxInfoWithEtherScan(arscanInfo)
              let isMatch = false
              for (let j = 0; j < makerList.length; j++) {
                let makerInfo = makerList[j]
                let makerAddress = makerInfo.makerAddress.toLowerCase()
                if (
                  txinfo.from !== makerAddress &&
                  txinfo.to !== makerAddress
                ) {
                  continue
                }
                if (txinfo.tokenName !== makerInfo.tName) {
                  continue
                }
                let avalibleTimes = makerInfo.avalibleTimes
                for (let z = 0; z < avalibleTimes.length; z++) {
                  const avalibleTime = avalibleTimes[z]
                  if (
                    avalibleTime.startTime <= txinfo.timeStamp &&
                    avalibleTime.endTime >= txinfo.timeStamp
                  ) {
                    isMatch = true
                    break
                  }
                }
                if (!isMatch) {
                  continue
                }
                if (txinfo.from === makerAddress) {
                  let pText = orbiterCore.getPTextFromTAmount(
                    chainID,
                    txinfo.value,
                  )
                  let nonce = 0
                  if (pText.state) {
                    nonce = pText.pText
                  }
                  if (Number(nonce) < 9000 && Number(nonce) !== 0) {
                    ARToTxList.push(txinfo)
                    break
                  }
                } else if (txinfo.to === makerAddress) {
                  if (
                    orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
                  ) {
                    let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
                    let arr2 = [
                      chainID,
                      orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
                    ]
                    if (judgeArrayEqualFun(arr1, arr2)) {
                      ARFromTxList.push(txinfo)
                      break
                    }
                  }
                } else {
                  // doNothiing
                }
              }
            }
          }
        } catch (error) {
          console.log('ethError =', error)
          throw error.message
        }
        originTxList[chainID] = {
          fromList: ARFromTxList,
          toList: ARToTxList,
        }
        // console.log('ARFromTxList =', ARFromTxList)
        // console.log('ARToTxList =', ARToTxList)
      }
      // 2.3 zk==================================================================
      if (supportChains.indexOf(3) > -1 || supportChains.indexOf(33) > -1) {
        let chainID = supportChains.indexOf(3) > -1 ? 3 : 33
        let zkTokenList
        try {
          zkTokenList = await getZKTokenAllList(chainID)
        } catch (err) {
          console.log('tokenlistError =', err)
        }
        let isContiue = true
        let lastHash = 0
        let zkAllTxList = []
        while (isContiue) {
          try {
            let zkScanReq1 = {
              from: lastHash ? lastHash : 'latest',
              limit: 100,
              direction: 'older',
              account: req.address,
              localChainID: chainID,
            }
            let zkInfo = await thirdapi.getZKInfo(zkScanReq1)
            let zkList = zkInfo.result.list
            if (zkList.length === 0) {
              break
            } else {
              for (const i in zkList) {
                if (Object.hasOwnProperty.call(zkList, i)) {
                  let tx = zkList[i]
                  if (lastHash === tx.txHash) {
                    if (zkList.length === 1) {
                      isContiue = false
                      break
                    } else {
                      continue
                    }
                  }
                  lastHash = tx.txHash
                  if (
                    !tx.failReason &&
                    (tx.status === 'finalized' || tx.status === 'committed') &&
                    tx.op.type === 'Transfer'
                  ) {
                    let strtime = tx.createdAt
                    let date = new Date(
                      strtime
                        .replace(/-/g, '/')
                        .replace(/T/g, '/')
                        .replace(/Z/g, '/'),
                    )
                    let timestamp = Date.parse(date) / 1000
                    if (timestamp >= needTimeStamp) {
                      tx.timestamp = timestamp
                      zkAllTxList.push(tx)
                    } else {
                      isContiue = false
                      break
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.log('zkError =', error)
            throw error.message
          }
        }
        // console.log('zkAllList =', zkAllTxList)
        for (let index = 0; index < zkAllTxList.length; index++) {
          let tx = zkAllTxList[index]
          let zkTokenInfoIndex = (zkTokenList || []).findIndex(
            (item) => item.id === tx.op.token,
          )
          if (zkTokenInfoIndex === -1) {
            continue
          }
          let zkTokenInfo = zkTokenList[zkTokenInfoIndex]
          // generate txinfo
          let txinfo = TxInfo.getTxInfoWithZksync(tx, zkTokenInfo)
          // cycle makerList
          for (let j = 0; j < makerList.length; j++) {
            // get makerinfo
            let makerInfo = makerList[j]
            let makerAddress = makerInfo.makerAddress.toLowerCase()
            if (txinfo.from !== makerAddress && txinfo.to !== makerAddress) {
              continue
            }
            if (txinfo.tokenName !== makerInfo.tName) {
              continue
            }
            let avalibleTimes = makerInfo.avalibleTimes
            let isMatch = false
            for (let z = 0; z < avalibleTimes.length; z++) {
              let avalibleTime = avalibleTimes[z]
              if (
                avalibleTime.startTime <= txinfo.timeStamp &&
                avalibleTime.endTime >= txinfo.timeStamp
              ) {
                isMatch = true
                break
              }
            }
            if (!isMatch) {
              continue
            }
            if (txinfo.from === makerAddress) {
              let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
              let nonce = 0
              if (pText.state) {
                nonce = pText.pText
              }
              if (Number(nonce) < 9000 && Number(nonce) !== 0) {
                ZKToTxList.push(txinfo)
                break
              }
            } else if (txinfo.to === makerAddress) {
              if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
                let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
                let arr2 = [
                  chainID,
                  orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
                ]
                if (judgeArrayEqualFun(arr1, arr2)) {
                  ZKFromTxList.push(txinfo)
                  break
                }
              }
            } else {
              // doNothiing
            }
          }
        }
        originTxList[chainID] = {
          fromList: ZKFromTxList,
          toList: ZKToTxList,
        }
        // console.log('ZKFromTxList =', ZKFromTxList)
        // console.log('ZKToTxList =', ZKToTxList)
      }
      //=============================================================================
    } else {
      //maker
    }
    var transactionList = getTrasactionListFromTxList(
      originTxList,
      req.state,
      makerList,
    )
    return transactionList
  },
}

async function getZKTokenAllList(chainID) {
  var isContiue = true
  var startID = 0
  var zkTokenAllList = []
  let err = null
  while (isContiue) {
    var zkTokenListReq = {
      from: startID,
      limit: 100,
      direction: 'newer',
      localChainID: chainID,
    }
    var result
    try {
      result = await thirdapi.getZKTokenList(zkTokenListReq)
    } catch (error) {
      err = error
      break
    }
    var tokenList = result.result.list
    if (tokenList.length !== 100) {
      isContiue = false
    }
    zkTokenAllList = zkTokenAllList.concat(tokenList)
  }
  return new Promise((resolve, reject) => {
    if (err) {
      reject(err)
    } else {
      resolve(zkTokenAllList)
    }
  })
}

function judgeArrayEqualFun(arr1, arr2) {
  let flag = true
  if (arr1.length !== arr2.length) {
    flag = false
  } else {
    arr1.forEach((item) => {
      if (arr2.indexOf(item) === -1) {
        flag = false
      }
    })
  }
  return flag
}

/*
    * origin:txList
    {
      chainID:{
        fromList:xxx
        toList:xxx
      },
      chainID:{
        fromList:xxx
        toList:xxx
      }
    }
    * state: user or maker
    0 / 1    maker / user
    * makerList: makerInfoList
    [
      {makerInfo},{makerInfo}....
    ]
*/
function getTrasactionListFromTxList(origin, state, makerList) {
  let transactionList = []
  if (state) {
    // user
    for (let i = 0; i < Object.keys(origin).length; i++) {
      let fromChainID = Object.keys(origin)[i]
      let timestampRep = 0
      if (fromChainID === '3' || fromChainID === '33') {
        timestampRep = 3600 * 8
      }
      let fromList = origin[fromChainID].fromList
      if (fromList.length === 0) {
        continue
      }
      for (let j = 0; j < fromList.length; j++) {
        let transaction
        let fromTxInfo = fromList[j]
        let now = parseInt(new Date().getTime() / 1000)
        let state = now - fromTxInfo.timeStamp > 1200 ? 2 : 1
        let toChainID = orbiterCore.getToChainIDFromAmount(
          Number(fromChainID),
          fromTxInfo.value,
        )
        let realFromAmount = orbiterCore.getRAmountFromTAmount(
          Number(fromChainID),
          fromTxInfo.value,
        ).rAmount
        let userAmount = new BigNumber(realFromAmount).dividedBy(
          new BigNumber(10 ** fromTxInfo.tokenDecimal),
        )
        if (!origin[toChainID] || origin[toChainID].toList.length === 0) {
          transaction = {
            fromChainID: Number(fromChainID),
            toChainID: Number(toChainID),
            userAddress: shortAddress(fromTxInfo.from),
            makerAddress: shortAddress(fromTxInfo.to),
            userAmount: userAmount,
            fromTimeStamp: timeStampToTime(
              Number(fromTxInfo.timeStamp) + timestampRep,
            ),
            sortTimeStamp: Number(fromTxInfo.timeStamp) + timestampRep,
            toTimeStamp: 0,
            tokenName: fromTxInfo.tokenName,
            fromTxHash: fromTxInfo.hash,
            toTxHash: '0',
            state: state, // Pending repayment
          }
          transactionList.push(transaction)
          continue
        }
        let toList = origin[toChainID].toList
        let isMatch = false
        for (let z = 0; z < toList.length; z++) {
          let toTxInfo = toList[z]

          let pText = orbiterCore.getPTextFromTAmount(toChainID, toTxInfo.value)
          let nonce = 0
          if (pText.state) {
            nonce = pText.pText
          }
          if (
            toTxInfo.from !== fromTxInfo.to ||
            Number(nonce) !== Number(fromTxInfo.nonce) ||
            toTxInfo.tokenName !== fromTxInfo.tokenName
          ) {
            continue
          }
          let makerAddress = fromTxInfo.to
          let txChainIDS = [Number(fromChainID), Number(toChainID)]

          let makerIndex = -1
          for (let index = 0; index < makerList.length; index++) {
            const item = makerList[index]
            if (
              item.makerAddress.toLowerCase() === makerAddress &&
              judgeArrayEqualFun(txChainIDS, [item.c1ID, item.c2ID])
            ) {
              let avalibleTimes = item.avalibleTimes
              for (let j = 0; j < avalibleTimes.length; j++) {
                const avalibleTime = avalibleTimes[j]
                if (
                  avalibleTime.startTime <= fromTxInfo.timeStamp &&
                  avalibleTime.endTime >= fromTxInfo.timeStamp
                ) {
                  makerIndex = index
                  break
                }
              }
              if (makerIndex !== -1) {
                break
              }
            }
          }
          if (makerIndex === -1) {
            continue
          }

          let realToAmount = orbiterCore.getToAmountFromUserAmount(
            new BigNumber(realFromAmount).dividedBy(
              new BigNumber(10 ** makerList[makerIndex].precision),
            ),
            makerList[makerIndex],
            true,
          )

          let toAmount = orbiterCore.getTAmountFromRAmount(
            Number(toChainID),
            realToAmount,
            fromTxInfo.nonce.toString(),
          ).tAmount
          if (toAmount !== toTxInfo.value) {
            continue
          } else {
            toList.splice(z, 1)
            transaction = {
              fromChainID: fromChainID,
              toChainID: toChainID,
              userAddress: shortAddress(fromTxInfo.from),
              makerAddress: shortAddress(makerAddress),
              userAmount: userAmount,
              fromTimeStamp: timeStampToTime(
                Number(fromTxInfo.timeStamp) + timestampRep,
              ),
              sortTimeStamp: Number(fromTxInfo.timeStamp) + timestampRep,
              toTimeStamp: timeStampToTime(toTxInfo.timeStamp),
              tokenName: fromTxInfo.tokenName,
              fromTxHash: fromTxInfo.hash,
              toTxHash: toTxInfo.hash,
              state: 0, // success
            }
            transactionList.push(transaction)
            isMatch = true
            break
          }
        }
        if (!isMatch) {
          transaction = {
            fromChainID: fromChainID,
            toChainID: toChainID,
            userAddress: shortAddress(fromTxInfo.from),
            makerAddress: shortAddress(fromTxInfo.to),
            userAmount: userAmount,
            fromTimeStamp: timeStampToTime(
              Number(fromTxInfo.timeStamp) + timestampRep,
            ),
            sortTimeStamp: Number(fromTxInfo.timeStamp) + timestampRep,
            toTimeStamp: 0,
            tokenName: fromTxInfo.tokenName,
            fromTxHash: fromTxInfo.hash,
            toTxHash: '0',
            state: state, //Pending repayment
          }
          transactionList.push(transaction)
          continue
        }
      }
    }
  } else {
    // maker
  }
  transactionList.sort(sortBy('sortTimeStamp'))
  return {
    list: transactionList,
    state: state, // 0 / 1  maker / user
  }
}

function sortBy(field) {
  return function(a, b) {
    return b[field] - a[field]
  }
}

function timeStampToTime(timestamp) {
  if (!timestamp) {
    return timestamp
  }
  if (timestamp.toString().length === 10) {
    timestamp = timestamp * 1000
  }
  var date = new Date(timestamp)
  // var Y = date.getFullYear() + '-'
  var M =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  // var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  var result = M + D + h + m
  return result
}

function shortAddress(address) {
  if (address && address.length > 5) {
    var subStr1 = address.substr(0, 4)
    var subStr2 = address.substr(address.length - 4, 4)
    return subStr1 + '...' + subStr2
  }
  return ''
}
