import BigNumber from 'bignumber.js'
import orbiterCore from '../../orbiterCore'
import util from '../../util/util'
import arbitrum from '../actions/arbitrum'
import metis from '../actions/metis'
import boba from '../actions/boba'
import etherscan from '../actions/etherscan'
import immutablex from '../actions/immutablex'
import loopring from '../actions/loopring'
import optimistic from '../actions/optimistic'
import polygon from '../actions/polygon'
import thegraph from '../actions/thegraph'
import thirdapi from '../actions/thirdapi'
import zkspace from '../actions/zkspace'
import TxInfo from '../utils/modle/txinfo'

async function getTransactionListEtherscan(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const L1FromTxList = []
  const L1ToTxList = []

  let ethScanReq = {
    timestamp: needTimeStamp,
    closest: 'before',
  }

  let ethScanStartBlock = 0
  try {
    let resp = await etherscan.getBlockNumberWithTimeStamp(ethScanReq, chainID)
    if (resp.status === '1' && resp.message === 'OK') {
      ethScanStartBlock = resp.result
    } else {
      ethScanStartBlock = 0
    }
  } catch (error) {
    console.warn('ethScanStartBlockError =', error)
    throw error.message
  }
  let ethscanReq = {
    maker: userAddress,
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
          let _makerAddress = makerInfo.makerAddress.toLowerCase()

          if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
            continue
          }

          if (txinfo.tokenName !== makerInfo.tName) {
            continue
          }

          let avalibleTimes =
            chainID === makerInfo.c1ID
              ? makerInfo.c1AvalibleTimes
              : makerInfo.c2AvalibleTimes
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

          if (txinfo.from === _makerAddress) {
            let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
            let nonce = 0
            if (pText.state) {
              nonce = pText.pText
            }
            if (Number(nonce) < 9000 && Number(nonce) >= 0) {
              L1ToTxList.push(txinfo)
              break
            }
          } else if (txinfo.to === _makerAddress) {
            if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
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
    console.warn('ethError =', error)
    throw error.message
  }

  return { L1FromTxList, L1ToTxList }
}

async function getTransactionListArbitrum(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const ARFromTxList = []
  const ARToTxList = []

  let arScanReq = {
    timestamp: needTimeStamp,
    closest: 'before',
  }
  let arScanStartBlock = 0
  try {
    let resp = await arbitrum.getBlockNumberWithTimeStamp(arScanReq, chainID)
    if (resp.status === '1' && resp.message === 'OK') {
      arScanStartBlock = resp.result
    } else {
      arScanStartBlock = 0
    }
  } catch (error) {
    console.warn('arScanStartBlockError =', error)
    throw error.message
  }

  let ArscanReq = {
    maker: userAddress,
    startblock: arScanStartBlock,
    endblock: 999999999,
  }
  try {
    let res = await arbitrum.getTransationList(ArscanReq, chainID)
    for (const arscanInfo of res.result) {
      let txinfo = TxInfo.getTxInfoWithEtherScan(arscanInfo)
      let isMatch = false

      for (let j = 0; j < makerList.length; j++) {
        let makerInfo = makerList[j]
        let _makerAddress = makerInfo.makerAddress.toLowerCase()

        if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
          continue
        }

        if (txinfo.tokenName !== makerInfo.tName) {
          continue
        }

        let avalibleTimes =
          chainID === makerInfo.c1ID
            ? makerInfo.c1AvalibleTimes
            : makerInfo.c2AvalibleTimes
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

        if (txinfo.from === _makerAddress) {
          let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
          let nonce = 0
          if (pText.state) {
            nonce = pText.pText
          }
          if (Number(nonce) < 9000 && Number(nonce) >= 0) {
            ARToTxList.push(txinfo)
            break
          }
        } else if (txinfo.to === _makerAddress) {
          if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
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
  } catch (error) {
    console.warn('arbitrumError =', error)
    throw error.message
  }
  return { ARFromTxList, ARToTxList }
}

async function getTransactionListMetis(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const MTFromTxList = []
  const MTToTxList = []

  let mtScanReq = {
    timestamp: needTimeStamp,
    closest: 'before',
  }
  let mtScanStartBlock = 0
  try {
    let resp = await metis.getBlockNumberWithTimeStamp(mtScanReq, chainID)
    if (resp.status === '1' && resp.message === 'OK') {
      mtScanStartBlock = resp.result?.blockNumber
    } else {
      mtScanStartBlock = 0
    }
  } catch (error) {
    console.warn('mtScanStartBlockError =', error)
    throw error.message
  }
  let MtscanReq = {
    maker: userAddress,
    startblock: mtScanStartBlock,
    endblock: 999999999,
  }
  try {
    let res = await metis.getTransationList(MtscanReq, chainID)
    for (const item of res.result) {
      let txinfo = TxInfo.getTxInfoWithMetis(item)
      let isMatch = false
      for (let j = 0; j < makerList.length; j++) {
        let makerInfo = makerList[j]
        let _makerAddress = makerInfo.makerAddress.toLowerCase()

        if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
          continue
        }

        if (txinfo.tokenName !== makerInfo.tName) {
          continue
        }

        let avalibleTimes =
          chainID === makerInfo.c1ID
            ? makerInfo.c1AvalibleTimes
            : makerInfo.c2AvalibleTimes
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
        if (txinfo.from === _makerAddress) {
          let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
          let nonce = 0
          if (pText.state) {
            nonce = pText.pText
          }
          if (Number(nonce) < 9000 && Number(nonce) >= 0) {
            MTToTxList.push(txinfo)
            break
          }
        } else if (txinfo.to === _makerAddress) {
          if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
            let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
            let arr2 = [
              chainID,
              orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
            ]
            if (judgeArrayEqualFun(arr1, arr2)) {
              MTFromTxList.push(txinfo)
              break
            }
          }
        } else {
          // doNothiing
        }
      }
    }
  } catch (error) {
    console.warn('arbitrumError =', error)
    throw error.message
  }

  return { MTFromTxList, MTToTxList }
}

// boba
async function getTransactionListBoba(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const L1FromTxList = []
  const L1ToTxList = []
  // let mtScanReq = {
  //   timestamp: needTimeStamp,
  //   closest: 'before',
  // }
  let mtScanStartBlock = 0
  // try {
  //   let resp = await boba.getBlockNumberWithTimeStamp(mtScanReq, chainID)
  //   if (resp.status === '1' && resp.message === 'OK') {
  //     mtScanStartBlock = resp.result?.blockNumber
  //   } else {
  //     mtScanStartBlock = 0
  //   }
  // } catch (error) {
  //   console.log('boba ScanStartBlockError =', error)
  // }
  let MtscanReq = {
    maker: userAddress,
    startblock: mtScanStartBlock,
    endblock: 999999999,
  }
  try {
    let res = await boba.getTransationList(MtscanReq, chainID)
    for (const i in res.result) {
      if (Object.hasOwnProperty.call(res.result, i)) {
        let etherscanInfo = res.result[i]
        let txinfo = TxInfo.getTxInfoWithBoba(etherscanInfo)
        let isMatch = false
        for (let j = 0; j < makerList.length; j++) {
          let makerInfo = makerList[j]
          let _makerAddress = makerInfo.makerAddress.toLowerCase()

          if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
            continue
          }

          if (txinfo.tokenName !== makerInfo.tName) {
            continue
          }

          let avalibleTimes =
            chainID === makerInfo.c1ID
              ? makerInfo.c1AvalibleTimes
              : makerInfo.c2AvalibleTimes
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
          if (txinfo.from === _makerAddress) {
            let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
            let nonce = 0
            if (pText.state) {
              nonce = pText.pText
            }
            if (Number(nonce) < 9000 && Number(nonce) >= 0) {
              L1ToTxList.push(txinfo)
              break
            }
          } else if (txinfo.to === _makerAddress) {
            if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
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
    console.warn('boba error =', error)
    throw error.message
  }
  return { FromTxList: L1FromTxList, ToTxList: L1ToTxList }
}

async function getTransactionListOptimitic(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const OPFromTxList = []
  const OPToTxList = []

  let opScanReq = {
    timestamp: needTimeStamp,
    closest: 'before',
  }
  let opScanStartBlock = 0
  try {
    let resp = await optimistic.getBlockNumberWithTimeStamp(opScanReq, chainID)
    if (resp.status === '1' && resp.message === 'OK') {
      opScanStartBlock = resp.result
    } else {
      opScanStartBlock = 0
    }
  } catch (error) {
    console.warn('opScanStartBlockError =', error)
    throw error.message
  }

  let OpscanReq = {
    maker: userAddress,
    startblock: opScanStartBlock,
    endblock: 999999999,
  }
  try {
    let res = await optimistic.getTransationList(OpscanReq, chainID)
    for (const i in res.result) {
      if (Object.hasOwnProperty.call(res.result, i)) {
        let opscanInfo = res.result[i]
        let txinfo = TxInfo.getTxInfoWithEtherScan(opscanInfo)
        let isMatch = false

        for (let j = 0; j < makerList.length; j++) {
          let makerInfo = makerList[j]
          let _makerAddress = makerInfo.makerAddress.toLowerCase()

          if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
            continue
          }

          if (txinfo.tokenName !== makerInfo.tName) {
            continue
          }

          let avalibleTimes =
            chainID === makerInfo.c1ID
              ? makerInfo.c1AvalibleTimes
              : makerInfo.c2AvalibleTimes
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

          if (txinfo.from === _makerAddress) {
            let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
            let nonce = 0
            if (pText.state) {
              nonce = pText.pText
            }
            if (Number(nonce) < 9000 && Number(nonce) >= 0) {
              OPToTxList.push(txinfo)
              break
            }
          } else if (txinfo.to === _makerAddress) {
            if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
              let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
              let arr2 = [
                chainID,
                orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
              ]
              if (judgeArrayEqualFun(arr1, arr2)) {
                OPFromTxList.push(txinfo)
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
    console.warn('optimisticError =', error)
    throw error.message
  }

  return { OPFromTxList, OPToTxList }
}

async function getTransactionListPolygon(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const PGFromTxList = []
  const PGToTxList = []

  const blockReq = {
    timestamp: needTimeStamp,
    closest: 'before',
  }
  let startBlockNumber = 0
  try {
    let resp = await arbitrum.getBlockNumberWithTimeStamp(blockReq, chainID)
    if (resp.status === '1' && resp.message === 'OK') {
      startBlockNumber = resp.result
    } else {
      startBlockNumber = 0
    }
  } catch (error) {
    console.warn('pgScanStartBlockError =', error)
    throw error.message
  }

  const transationReq = {
    maker: userAddress,
    startblock: startBlockNumber,
    endblock: 999999999,
  }
  try {
    const res = await polygon.getTransationList(transationReq, chainID)
    for (const item of res.result) {
      let txinfo = TxInfo.getTxInfoWithPolygon(item)
      let isMatch = false

      for (let j = 0; j < makerList.length; j++) {
        let makerInfo = makerList[j]
        let _makerAddress = makerInfo.makerAddress.toLowerCase()

        if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
          continue
        }

        if (txinfo.tokenName !== makerInfo.tName) {
          continue
        }

        let avalibleTimes =
          chainID === makerInfo.c1ID
            ? makerInfo.c1AvalibleTimes
            : makerInfo.c2AvalibleTimes
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

        if (txinfo.from === _makerAddress) {
          let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
          let nonce = 0
          if (pText.state) {
            nonce = pText.pText
          }
          if (Number(nonce) < 9000 && Number(nonce) >= 0) {
            PGToTxList.push(txinfo)
            break
          }
        } else if (txinfo.to === _makerAddress) {
          if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
            let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
            let arr2 = [
              chainID,
              orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
            ]
            if (judgeArrayEqualFun(arr1, arr2)) {
              PGFromTxList.push(txinfo)
              break
            }
          }
        } else {
          // doNothiing
        }
      }
    }
  } catch (error) {
    console.warn('polygonError =', error)
    throw error.message
  }

  return { PGFromTxList, PGToTxList }
}

async function getTransactionListZksync(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const ZKFromTxList = []
  const ZKToTxList = []

  let zkTokenList
  try {
    zkTokenList = await getZKTokenAllList(chainID)
  } catch (err) {
    console.warn('tokenlistError =', err)
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
        account: userAddress,
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
              let timestamp = parseInt(new Date(tx.createdAt).getTime() / 1000)
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
      console.warn('zkError =', error)
      throw error.message
    }
  }
  for (let index = 0; index < zkAllTxList.length; index++) {
    let tx = zkAllTxList[index]
    let zkTokenInfoIndex = (zkTokenList || []).findIndex(
      (item) => item.id === tx.op.token
    )
    if (zkTokenInfoIndex === -1) {
      continue
    }
    let zkTokenInfo = zkTokenList[zkTokenInfoIndex]

    let txinfo = TxInfo.getTxInfoWithZksync(tx, zkTokenInfo)

    for (let j = 0; j < makerList.length; j++) {
      let makerInfo = makerList[j]
      let _makerAddress = makerInfo.makerAddress.toLowerCase()

      if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
        continue
      }

      if (txinfo.tokenName !== makerInfo.tName) {
        continue
      }

      let avalibleTimes =
        chainID === makerInfo.c1ID
          ? makerInfo.c1AvalibleTimes
          : makerInfo.c2AvalibleTimes
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

      if (txinfo.from === _makerAddress) {
        let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
        let nonce = 0
        if (pText.state) {
          nonce = pText.pText
        }
        if (Number(nonce) < 9000 && Number(nonce) >= 0) {
          ZKToTxList.push(txinfo)
          break
        }
      } else if (txinfo.to === _makerAddress) {
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

  return { ZKFromTxList, ZKToTxList }
}

async function getTransactionListStarknet() {
  // userAddress,
  // chainID,
  // needTimeStamp,
  // makerList
  const SNFromTxList = []
  const SNToTxList = []
  // const networkId = getNetworkIdByChainId(chainID)

  // const starknetAllTxList = []
  // const transactionHashs = []
  // const getTxList = async (starknetAddress, p = 1) => {
  //   const list = await mStarknet.getTransationList(
  //     { starknetAddress, p },
  //     chainID
  //   )

  //   if (list.length <= 0) {
  //     return
  //   }

  //   let isGetNextPage = true
  //   const _allPromises = []
  //   for (const item of list) {
  //     if (item.timestamp < needTimeStamp) {
  //       isGetNextPage = false
  //       break
  //     }

  //     if (transactionHashs.indexOf(item.hash) > -1) {
  //       continue
  //     }
  //     transactionHashs.push(item.hash)

  //     _allPromises.push(
  //       (async () => {
  //         const transaction = await mStarknet.getTransaction(item.hash, chainID)
  //         if (transaction) {
  //           starknetAllTxList.push(transaction)
  //         }
  //       })()
  //     )
  //   }
  //   await Promise.all(_allPromises)

  //   if (isGetNextPage) {
  //     await getTxList(starknetAddress, (p += 1))
  //   }
  // }

  // // All starknet addresses
  // const userAddressStarknet = await getL2AddressByL1(userAddress, networkId)
  // const starknetAddresses = [userAddressStarknet]
  // const allPromises = [getTxList(userAddressStarknet)]
  // for (const item of makerList) {
  //   if (item.c1ID != chainID && item.c2ID != chainID) {
  //     continue
  //   }
  //   const _starknetAddress = await getL2AddressByL1(
  //     item.makerAddress,
  //     networkId
  //   )
  //   if (starknetAddresses.indexOf(_starknetAddress) === -1) {
  //     starknetAddresses.push(_starknetAddress)

  //     allPromises.push(getTxList(_starknetAddress))
  //   }
  // }

  // await Promise.all(allPromises)

  // for (const index in starknetAllTxList) {
  //   const item = starknetAllTxList[index]
  //   const txinfo = TxInfo.getTxInfoWithStarknet(item)

  //   for (const makerInfo of makerList) {
  //     const _makerAddress = makerInfo.makerAddress.toLowerCase()
  //     const _makerAddressStarknet = await getL2AddressByL1(
  //       _makerAddress,
  //       networkId
  //     )

  //     if (
  //       txinfo.from !== _makerAddressStarknet &&
  //       txinfo.to !== _makerAddressStarknet
  //     ) {
  //       continue
  //     }

  //     if (txinfo.tokenName !== makerInfo.tName) {
  //       continue
  //     }

  //     let avalibleTimes =
  //       chainID === makerInfo.c1ID
  //         ? makerInfo.c1AvalibleTimes
  //         : makerInfo.c2AvalibleTimes
  //     let isMatch = false
  //     for (let z = 0; z < avalibleTimes.length; z++) {
  //       let avalibleTime = avalibleTimes[z]

  //       if (
  //         avalibleTime.startTime <= txinfo.timeStamp &&
  //         avalibleTime.endTime >= txinfo.timeStamp
  //       ) {
  //         isMatch = true
  //         break
  //       }
  //     }

  //     if (!isMatch) {
  //       continue
  //     }

  //     if (
  //       txinfo.from === _makerAddressStarknet &&
  //       txinfo.to === userAddressStarknet
  //     ) {
  //       let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
  //       let nonce = 0
  //       if (pText.state) {
  //         nonce = pText.pText
  //       }
  //       if (Number(nonce) < 9000 && Number(nonce) >= 0) {
  //         SNToTxList.push({
  //           ...txinfo,
  //           from: _makerAddress,
  //           to: userAddress,
  //         })
  //         break
  //       }
  //     } else if (
  //       txinfo.to === _makerAddressStarknet &&
  //       txinfo.from === userAddressStarknet
  //     ) {
  //       if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
  //         let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
  //         let arr2 = [
  //           chainID,
  //           orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
  //         ]
  //         if (judgeArrayEqualFun(arr1, arr2)) {
  //           SNFromTxList.push({
  //             ...txinfo,
  //             from: userAddress,
  //             to: _makerAddress,
  //           })
  //           break
  //         }
  //       }
  //     } else {
  //       // doNothiing
  //     }
  //   }
  // }

  return { SNFromTxList, SNToTxList }
}

async function getTransactionListImmutableX(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const IMXFromTxList = []
  const IMXToTxList = []

  const fromList = await immutablex.getTransationList(
    { user: userAddress },
    chainID,
    needTimeStamp
  )
  const toList = await immutablex.getTransationList(
    { receiver: userAddress },
    chainID,
    needTimeStamp
  )

  const imxAllTxList = fromList.concat(toList)
  for (const tx of imxAllTxList) {
    const txinfo = TxInfo.getTxInfoWithImmutableX(tx)

    for (let j = 0; j < makerList.length; j++) {
      let makerInfo = makerList[j]
      let _makerAddress = makerInfo.makerAddress.toLowerCase()

      if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
        continue
      }

      if (txinfo.tokenName !== makerInfo.tName) {
        continue
      }

      let avalibleTimes =
        chainID === makerInfo.c1ID
          ? makerInfo.c1AvalibleTimes
          : makerInfo.c2AvalibleTimes
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

      if (txinfo.from === _makerAddress) {
        let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
        let nonce = 0
        if (pText.state) {
          nonce = pText.pText
        }
        if (Number(nonce) < 9000 && Number(nonce) >= 0) {
          IMXToTxList.push(txinfo)
          break
        }
      } else if (txinfo.to === _makerAddress) {
        if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
          let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
          let arr2 = [
            chainID,
            orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
          ]
          if (judgeArrayEqualFun(arr1, arr2)) {
            IMXFromTxList.push(txinfo)
            break
          }
        }
      } else {
        // doNothiing
      }
    }
  }

  return { IMXFromTxList, IMXToTxList }
}

async function getTransactionListLoopring(
  userAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const LPFromTxList = []
  const LPToTxList = []

  let isContiue = true
  let limit = 50
  let offset = 0
  let LPAllTxList = []
  let endTime = 9999999999999
  while (isContiue) {
    try {
      let LPTransferResult = await loopring.getLoopringTxList(
        userAddress,
        chainID,
        needTimeStamp,
        endTime,
        limit,
        offset
      )
      if (!LPTransferResult) {
        isContiue = false
        break
      }
      if (
        LPTransferResult.totalNum !== 0 &&
        LPTransferResult.userTransfers?.length !== 0
      ) {
        if (LPTransferResult.userTransfers?.length !== limit) {
          isContiue = false
        } else {
          offset += limit
        }
        let transacionts = LPTransferResult.userTransfers
        for (let index = 0; index < transacionts?.length; index++) {
          const lpTransaction = transacionts[index]
          if (
            lpTransaction.txType == 'TRANSFER' &&
            (lpTransaction.senderAddress.toLowerCase() ==
              userAddress.toLowerCase() ||
              lpTransaction.receiverAddress.toLowerCase() ==
                userAddress.toLowerCase()) &&
            lpTransaction.symbol == 'ETH'
          ) {
            LPAllTxList.push(lpTransaction)
          }
        }
      } else {
        break
      }
    } catch (error) {
      console.warn('lpError =', error)
      throw error.message
    }
  }
  for (let index = 0; index < LPAllTxList.length; index++) {
    let tx = LPAllTxList[index]

    let txinfo = TxInfo.getTxInfoWithLoopring(tx)
    for (let j = 0; j < makerList.length; j++) {
      let makerInfo = makerList[j]
      let _makerAddress = makerInfo.makerAddress.toLowerCase()

      if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
        continue
      }

      if (txinfo.tokenName !== makerInfo.tName) {
        continue
      }

      let avalibleTimes =
        chainID === makerInfo.c1ID
          ? makerInfo.c1AvalibleTimes
          : makerInfo.c2AvalibleTimes
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

      if (txinfo.from === _makerAddress) {
        let nonce = txinfo.memo
        if (Number(nonce) < 9000 && Number(nonce) >= 0) {
          LPToTxList.push(txinfo)
          break
        }
      } else if (txinfo.to === _makerAddress) {
        if (txinfo.dataFrom == 'loopring' && txinfo.memo && txinfo.memo != '') {
          let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
          let arr2 = [chainID, txinfo.memo % 9000]
          if (judgeArrayEqualFun(arr1, arr2)) {
            LPFromTxList.push(txinfo)
            break
          }
        }
      } else {
        // doNothiing
      }
    }
  }

  return { LPFromTxList, LPToTxList }
}

async function getTransactionListZkSpace(
  userAddress,
  chainID,
  tokenID,
  needTimeStamp,
  makerList
) {
  const zkSpaceFromTxList = []
  const zkSpaceToTxList = []
  let isContiue = true
  let limit = 50
  let startIndex = 0
  let ZKSAllTxList = []
  while (isContiue) {
    try {
      let ZKSTransferResult = await zkspace.getZKSapceTxList(
        userAddress,
        chainID,
        startIndex,
        tokenID,
        limit
      )
      if (!ZKSTransferResult || !ZKSTransferResult.success) {
        isContiue = false
        break
      }
      if (
        ZKSTransferResult.success &&
        ZKSTransferResult.data?.data?.length !== 0
      ) {
        if (ZKSTransferResult.data?.data?.length !== limit) {
          isContiue = false
        } else {
          startIndex += limit
        }
        let transacionts = ZKSTransferResult.data.data
        for (let index = 0; index < transacionts.length; index++) {
          const zkspaceTransaction = transacionts[index]
          if (zkspaceTransaction.created_at <= needTimeStamp) {
            isContiue = false
            break
          }
          if (
            zkspaceTransaction.tx_type == 'Transfer' &&
            zkspaceTransaction.fail_reason == '' &&
            (zkspaceTransaction.from.toLowerCase() ==
              userAddress.toLowerCase() ||
              zkspaceTransaction.to.toLowerCase() ==
                userAddress.toLowerCase()) &&
            zkspaceTransaction.token.symbol == 'ETH' &&
            zkspaceTransaction.created_at > needTimeStamp
          ) {
            ZKSAllTxList.push(zkspaceTransaction)
          }
        }
      } else {
        break
      }
    } catch (error) {
      console.warn('zksError =', error)
      throw error.message
    }
  }
  for (let index = 0; index < ZKSAllTxList.length; index++) {
    let tx = ZKSAllTxList[index]
    let txinfo = TxInfo.getTxInfoWithZkSpace(tx)
    for (let j = 0; j < makerList.length; j++) {
      let makerInfo = makerList[j]
      let _makerAddress = makerInfo.makerAddress.toLowerCase()

      if (txinfo.from !== _makerAddress && txinfo.to !== _makerAddress) {
        continue
      }

      if (txinfo.tokenName !== makerInfo.tName) {
        continue
      }

      let avalibleTimes =
        chainID === makerInfo.c1ID
          ? makerInfo.c1AvalibleTimes
          : makerInfo.c2AvalibleTimes
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
      if (txinfo.from === _makerAddress) {
        let nonce = txinfo.nonce
        if (Number(nonce) < 9000 && Number(nonce) >= 0) {
          zkSpaceToTxList.push(txinfo)
          break
        }
      } else if (txinfo.to === _makerAddress) {
        if (txinfo.dataFrom == 'zkspace') {
          let arr1 = [makerInfo.c1ID, makerInfo.c2ID]
          let arr2 = [
            chainID,
            orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
          ]
          if (judgeArrayEqualFun(arr1, arr2)) {
            zkSpaceFromTxList.push(txinfo)
            break
          }
        }
      } else {
        // doNothiing
      }
    }
  }

  return { zkSpaceFromTxList, zkSpaceToTxList }
}

export default {
  getTransactionList: async function (req) {
    /*
      Req:
      address: '0x0043d60e87c5dd08C86C3123340705a1556C4719',
      daysAgo: 10
      state: 0 / 1    maker/user
     */
    var originTxList = {}
    var makerList = []
    if (req.state === 1) {
      await thegraph
        .getAllMakerList(req, true)
        .then((response) => {
          makerList = response.data
        })
        .catch((error) => {
          console.warn('getMakerListError =', error)
          throw error.message
        })

      let supportChains = []
      for (const maker of makerList) {
        if (supportChains.indexOf(maker.c1ID) === -1) {
          supportChains.push(maker.c1ID)
        }
        if (supportChains.indexOf(maker.c2ID) === -1) {
          supportChains.push(maker.c2ID)
        }
      }
      let nowTimeStamp = Date.parse(new Date()) / 1000
      let needTimeStamp =
        nowTimeStamp - 86400 * (req.daysAgo ? req.daysAgo : 10)

      const allPromises = []

      // getTransactionListEtherscan
      if (supportChains.indexOf(1) > -1 || supportChains.indexOf(5) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(1) > -1 ? 1 : 5
          const { L1FromTxList, L1ToTxList } =
            await getTransactionListEtherscan(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )
          originTxList[chainID] = {
            fromList: L1FromTxList,
            toList: L1ToTxList,
          }
        })
      }

      // 2.2 Ar
      if (supportChains.indexOf(2) > -1 || supportChains.indexOf(22) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(2) > -1 ? 2 : 22
          const { ARFromTxList, ARToTxList } = await getTransactionListArbitrum(
            req.address,
            chainID,
            needTimeStamp,
            makerList
          )
          originTxList[chainID] = {
            fromList: ARFromTxList,
            toList: ARToTxList,
          }
        })
      }

      // 10 510 Metis
      if (supportChains.indexOf(10) > -1 || supportChains.indexOf(510) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(10) > -1 ? 10 : 510
          const { MTFromTxList, MTToTxList } = await getTransactionListMetis(
            req.address,
            chainID,
            needTimeStamp,
            makerList
          )
          originTxList[chainID] = {
            fromList: MTFromTxList,
            toList: MTToTxList,
          }
        })
      }

      // 6.66 pg
      if (supportChains.indexOf(6) > -1 || supportChains.indexOf(66) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(6) > -1 ? 6 : 66
          const { PGFromTxList, PGToTxList } = await getTransactionListPolygon(
            req.address,
            chainID,
            needTimeStamp,
            makerList
          )

          originTxList[chainID] = {
            fromList: PGFromTxList,
            toList: PGToTxList,
          }
        })
      }

      // 7.77 op
      if (supportChains.indexOf(7) > -1 || supportChains.indexOf(77) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(7) > -1 ? 7 : 77
          const { OPFromTxList, OPToTxList } =
            await getTransactionListOptimitic(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

          originTxList[chainID] = {
            fromList: OPFromTxList,
            toList: OPToTxList,
          }
        })
      }

      // 3.33 zk==================================================================
      if (supportChains.indexOf(3) > -1 || supportChains.indexOf(33) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(3) > -1 ? 3 : 33
          const { ZKFromTxList, ZKToTxList } = await getTransactionListZksync(
            req.address,
            chainID,
            needTimeStamp,
            makerList
          )

          originTxList[chainID] = {
            fromList: ZKFromTxList,
            toList: ZKToTxList,
          }
        })
      }

      // 4.44 sn
      if (supportChains.indexOf(4) > -1 || supportChains.indexOf(44) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(4) > -1 ? 4 : 44
          const { SNFromTxList, SNToTxList } =
            await getTransactionListStarknet()
          // req.address,
          // chainID,
          // needTimeStamp,
          // makerList

          originTxList[chainID] = {
            fromList: SNFromTxList,
            toList: SNToTxList,
          }
        })
      }

      // 8.88 imx
      if (supportChains.indexOf(8) > -1 || supportChains.indexOf(88) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(8) > -1 ? 8 : 88
          const { IMXFromTxList, IMXToTxList } =
            await getTransactionListImmutableX(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

          originTxList[chainID] = {
            fromList: IMXFromTxList,
            toList: IMXToTxList,
          }
        })
      }

      if (supportChains.indexOf(9) > -1 || supportChains.indexOf(99) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(9) > -1 ? 9 : 99
          const { LPFromTxList, LPToTxList } = await getTransactionListLoopring(
            req.address,
            chainID,
            needTimeStamp,
            makerList
          )

          originTxList[chainID] = {
            fromList: LPFromTxList,
            toList: LPToTxList,
          }
        })
      }

      if (supportChains.indexOf(12) > -1 || supportChains.indexOf(512) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(12) > -1 ? 12 : 512
          const { zkSpaceFromTxList, zkSpaceToTxList } =
            await getTransactionListZkSpace(
              req.address,
              chainID,
              0,
              needTimeStamp,
              makerList
            )

          originTxList[chainID] = {
            fromList: zkSpaceFromTxList,
            toList: zkSpaceToTxList,
          }
        })
      }
      // 13 & 513 boba
      if (supportChains.indexOf(13) > -1 || supportChains.indexOf(513) > -1) {
        allPromises.push(async () => {
          let chainID = supportChains.indexOf(13) > -1 ? 13 : 513
          const { FromTxList, ToTxList } = await getTransactionListBoba(
            req.address,
            chainID,
            needTimeStamp,
            makerList
          )
          originTxList[chainID] = {
            fromList: FromTxList,
            toList: ToTxList,
          }
        })
      }

      // waitting all promise end
      const maxRetryCount = 3
      for (let index = 0; index < maxRetryCount; index++) {
        try {
          await Promise.all(allPromises.map((item) => item()))
        } catch (err) {
          console.warn('allPromises exec error：', err)
          if (index < maxRetryCount) {
            await util.sleep(2000)
          } else {
            throw err
          }
        }
      }
      //=============================================================================
    }

    const transactionList = getTrasactionListFromTxList(
      originTxList,
      req.state,
      makerList
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
    } else {
      startID = tokenList[99].id + 1
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
    * origin: todo txList
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
    * state: 0 / 1    maker / user
    * makerList: 
    [
      {makerInfo},{makerInfo}....
    ]
*/
function getTrasactionListFromTxList(origin, state, makerList) {
  let transactionList = []
  if (state) {
    for (let key in origin) {
      let fromChainID = key
      for (let fromTxInfo of origin[key].fromList) {
        let transaction
        let now = parseInt(new Date().getTime() / 1000)
        let state = now - fromTxInfo.timeStamp > 86400 ? 2 : 1
        let toChainID =
          fromTxInfo.dataFrom == 'loopring' && fromTxInfo.memo
            ? fromTxInfo.memo % 9000
            : orbiterCore.getToChainIDFromAmount(
                Number(fromChainID),
                fromTxInfo.value
              )
        let realFromAmount = orbiterCore.getRAmountFromTAmount(
          Number(fromChainID),
          fromTxInfo.value
        ).rAmount
        let userAmount = new BigNumber(realFromAmount).dividedBy(
          new BigNumber(10 ** fromTxInfo.tokenDecimal)
        )

        if (!origin[toChainID] || origin[toChainID].toList.length === 0) {
          transaction = {
            fromChainID: Number(fromChainID),
            toChainID: Number(toChainID),
            userAddress: shortAddress(fromTxInfo.from),
            makerAddress: shortAddress(fromTxInfo.to),
            userAmount: userAmount,
            fromTimeStamp: timeStampToTime(Number(fromTxInfo.timeStamp)),
            sortTimeStamp: Number(fromTxInfo.timeStamp),
            toTimeStamp: 0,
            tokenName: fromTxInfo.tokenName,
            fromTxHash: fromTxInfo.hash,
            toTxHash: '0',
            state: state,
          }
          transactionList.push(transaction)
          continue
        }
        let toList = origin[toChainID].toList

        let isMatch = false
        for (let z = 0; z < toList.length; z++) {
          let toTxInfo = toList[z]

          let nonce = 0
          if (toTxInfo.dataFrom == 'loopring' && toTxInfo.memo) {
            nonce = toTxInfo.memo
          } else {
            let pText = orbiterCore.getPTextFromTAmount(
              toChainID,
              toTxInfo.value
            )
            if (pText.state) {
              nonce = pText.pText
            }
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
              item.tName.toLowerCase() === fromTxInfo.tokenName.toLowerCase() &&
              judgeArrayEqualFun(txChainIDS, [item.c1ID, item.c2ID])
            ) {
              let avalibleTimes =
                item.c1ID === fromChainID
                  ? item.c1AvalibleTimes
                  : item.c2AvalibleTimes
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
          let originMakerInfo = makerList[makerIndex]
          let useMakerInfo
          if (originMakerInfo.c1ID.toString() === fromChainID.toString()) {
            useMakerInfo = {
              makerAddress: originMakerInfo.makerAddress,
              c1ID: originMakerInfo.c1ID,
              c2ID: originMakerInfo.c2ID,
              c1Name: originMakerInfo.c1Name,
              c2Name: originMakerInfo.c2Name,
              t1Address: originMakerInfo.t1Address,
              t2Address: originMakerInfo.t2Address,
              tName: originMakerInfo.tName,
              minPrice: originMakerInfo.c1MinPrice,
              maxPrice: originMakerInfo.c1MaxPrice,
              precision: originMakerInfo.precision,
              avalibleDeposit: originMakerInfo.c1AvalibleDeposit,
              tradingFee: originMakerInfo.c1TradingFee,
              gasFee: originMakerInfo.c1GasFee,
              avalibleTimes: originMakerInfo.c1AvalibleTimes,
            }
          } else {
            useMakerInfo = {
              makerAddress: originMakerInfo.makerAddress,
              c1ID: originMakerInfo.c2ID,
              c2ID: originMakerInfo.c1ID,
              c1Name: originMakerInfo.c2Name,
              c2Name: originMakerInfo.c1Name,
              t1Address: originMakerInfo.t2Address,
              t2Address: originMakerInfo.t1Address,
              tName: originMakerInfo.tName,
              minPrice: originMakerInfo.c2MinPrice,
              maxPrice: originMakerInfo.c2MaxPrice,
              precision: originMakerInfo.precision,
              avalibleDeposit: originMakerInfo.c2AvalibleDeposit,
              tradingFee: originMakerInfo.c2TradingFee,
              gasFee: originMakerInfo.c2GasFee,
              avalibleTimes: originMakerInfo.c2AvalibleTimes,
            }
          }
          let realToAmount = orbiterCore.getToAmountFromUserAmount(
            new BigNumber(realFromAmount).dividedBy(
              new BigNumber(10 ** makerList[makerIndex].precision)
            ),
            useMakerInfo,
            true
          )

          let toAmount =
            toTxInfo.dataFrom == 'loopring' && toTxInfo.memo
              ? orbiterCore.getTAmountFromRAmount(
                  Number(toChainID),
                  realToAmount,
                  '0'
                ).tAmount
              : orbiterCore.getTAmountFromRAmount(
                  Number(toChainID),
                  realToAmount,
                  fromTxInfo.nonce.toString()
                ).tAmount

          if (toTxInfo.dataFrom == 'loopring' && toTxInfo.memo) {
            toTxInfo.memo = fromTxInfo.nonce
          }
          if (toAmount.toString() !== toTxInfo.value) {
            continue
          } else {
            toList.splice(z, 1)
            transaction = {
              fromChainID: fromChainID,
              toChainID: toChainID,
              userAddress: shortAddress(fromTxInfo.from),
              makerAddress: shortAddress(makerAddress),
              userAmount: userAmount,
              fromTimeStamp: timeStampToTime(Number(fromTxInfo.timeStamp)),
              sortTimeStamp: Number(fromTxInfo.timeStamp),
              toTimeStamp: timeStampToTime(toTxInfo.timeStamp),
              tokenName: fromTxInfo.tokenName,
              fromTxHash: fromTxInfo.hash,
              toTxHash: toTxInfo.hash,
              state: 0,
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
            fromTimeStamp: timeStampToTime(Number(fromTxInfo.timeStamp)),
            sortTimeStamp: Number(fromTxInfo.timeStamp),
            toTimeStamp: 0,
            tokenName: fromTxInfo.tokenName,
            fromTxHash: fromTxInfo.hash,
            toTxHash: '0',
            state: state,
          }
          transactionList.push(transaction)
          continue
        }
      }
    }
  }
  transactionList.sort(sortBy('sortTimeStamp'))
  return {
    list: transactionList,
    state: state, // 0 / 1  maker / user
  }
}

function sortBy(field) {
  return function (a, b) {
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
