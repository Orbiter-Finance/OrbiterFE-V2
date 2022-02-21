import BigNumber from 'bignumber.js'
import orbiterCore from '../../orbiterCore'
import arbitrum from '../actions/arbitrum'
import polygon from '../actions/polygon'
import optimistic from '../actions/optimistic'
import etherscan from '../actions/etherscan'
import thegraph from '../actions/thegraph'
import thirdapi from '../actions/thirdapi'
// import config from '../utils/config'
import TxInfo from '../utils/modle/txinfo'

async function getTransactionListEtherscan(
  makerAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const L1FromTxList = []
  const L1ToTxList = []

  let ethScanReq = {
    timestamp: needTimeStamp,
    closest: 'before'
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
    console.log('ethScanStartBlockError =', error)
    throw error.message
  }

  let ethscanReq = {
    maker: makerAddress,
    startblock: ethScanStartBlock,
    endblock: 999999999
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
                orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
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
  makerAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const ARFromTxList = []
  const ARToTxList = []

  let arScanReq = {
    timestamp: needTimeStamp,
    closest: 'before'
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
    console.log('arScanStartBlockError =', error)
    throw error.message
  }

  let ArscanReq = {
    maker: makerAddress,
    startblock: arScanStartBlock,
    endblock: 999999999
  }
  try {
    let res = await arbitrum.getTransationList(ArscanReq, chainID)
    for (const i in res.result) {
      if (Object.hasOwnProperty.call(res.result, i)) {
        let arscanInfo = res.result[i]
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
                orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
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
    console.warn('arbitrumError =', error)
    throw error.message
  }

  return { ARFromTxList, ARToTxList }
}

async function getTransactionListOptimitic(
  makerAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const OPFromTxList = []
  const OPToTxList = []

  let opScanReq = {
    timestamp: needTimeStamp,
    closest: 'before'
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
    console.log('opScanStartBlockError =', error)
    throw error.message
  }

  let OpscanReq = {
    maker: makerAddress,
    startblock: opScanStartBlock,
    endblock: 999999999
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
                orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
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
  makerAddress,
  chainID,
  needTimeStamp,
  makerList
) {
  const PGFromTxList = []
  const PGToTxList = []

  const blockReq = {
    timestamp: needTimeStamp,
    closest: 'before'
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
    console.log('pgScanStartBlockError =', error)
    throw error.message
  }

  const transationReq = {
    maker: makerAddress,
    startblock: startBlockNumber,
    endblock: 999999999
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
              orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
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
  makerAddress,
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
        account: makerAddress,
        localChainID: chainID
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
      console.log('zkError =', error)
      throw error.message
    }
  }
  for (let index = 0; index < zkAllTxList.length; index++) {
    let tx = zkAllTxList[index]
    let zkTokenInfoIndex = (zkTokenList || []).findIndex(
      item => item.id === tx.op.token
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
            orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
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
    if (req.state === 1) {
      await thegraph
        .getAllMakerList(req, true)
        .then(response => {
          makerList = response.data
        })
        .catch(error => {
          console.log('getMakerListError =', error)
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
        allPromises.push(
          (async () => {
            let chainID = supportChains.indexOf(1) > -1 ? 1 : 5
            const {
              L1FromTxList,
              L1ToTxList
            } = await getTransactionListEtherscan(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

            originTxList[chainID] = {
              fromList: L1FromTxList,
              toList: L1ToTxList
            }
          })()
        )
      }

      // 2.2 Ar
      if (supportChains.indexOf(2) > -1 || supportChains.indexOf(22) > -1) {
        allPromises.push(
          (async () => {
            let chainID = supportChains.indexOf(2) > -1 ? 2 : 22
            const {
              ARFromTxList,
              ARToTxList
            } = await getTransactionListArbitrum(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

            originTxList[chainID] = {
              fromList: ARFromTxList,
              toList: ARToTxList
            }
          })()
        )
      }

      // 6.66 pg
      if (supportChains.indexOf(6) > -1 || supportChains.indexOf(66) > -1) {
        allPromises.push(
          (async () => {
            let chainID = supportChains.indexOf(6) > -1 ? 6 : 66
            const {
              PGFromTxList,
              PGToTxList
            } = await getTransactionListPolygon(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

            originTxList[chainID] = {
              fromList: PGFromTxList,
              toList: PGToTxList
            }
          })()
        )
      }

      // 7.77 op
      if (supportChains.indexOf(7) > -1 || supportChains.indexOf(77) > -1) {
        allPromises.push(
          (async () => {
            let chainID = supportChains.indexOf(7) > -1 ? 7 : 77
            const {
              OPFromTxList,
              OPToTxList
            } = await getTransactionListOptimitic(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

            originTxList[chainID] = {
              fromList: OPFromTxList,
              toList: OPToTxList
            }
          })()
        )
      }

      // 2.3 zk==================================================================
      if (supportChains.indexOf(3) > -1 || supportChains.indexOf(33) > -1) {
        allPromises.push(
          (async () => {
            let chainID = supportChains.indexOf(3) > -1 ? 3 : 33
            const { ZKFromTxList, ZKToTxList } = await getTransactionListZksync(
              req.address,
              chainID,
              needTimeStamp,
              makerList
            )

            originTxList[chainID] = {
              fromList: ZKFromTxList,
              toList: ZKToTxList
            }
            // console.log('ZKFromTxList =', ZKFromTxList)
            // console.log('ZKToTxList =', ZKToTxList)
          })()
        )
      }

      // waitting all promise end
      await Promise.all(allPromises)

      //=============================================================================
    } /* else {

      // eslint-disable-next-line no-redeclare
      let makerAddress = req.address

      let res = await thegraph.getMakerInfo(req, true)
      console.log('graphRes =', res.data)
      makerList = res.data

      // [chainID1:{tName1,tName2}, chainID2:{tName2,tName3}]
      // [tName1: {chainID1,chainID2},tName2: {chianID2,chainID3}]
      let supportChains = {}
      let supportTNames = {}
      for (const i in makerList) {
        if (Object.hasOwnProperty.call(res.data, i)) {
          let maker = res.data[i]
          if (supportChains[maker.c1ID] === undefined) {
            supportChains[maker.c1ID] = [maker.tName]
          } else {
            if (supportChains[maker.c1ID].indexOf(maker.tName) === -1) {
              supportChains[maker.c1ID].push(maker.tName)
            }
          }
          if (supportChains[maker.c2ID] === undefined) {
            supportChains[maker.c2ID] = [maker.tName]
          } else {
            if (supportChains[maker.c2ID].indexOf(maker.tName) === -1) {
              supportChains[maker.c2ID].push(maker.tName)
            }
          }
          if (supportTNames[maker.tName] === undefined) {
            supportTNames[maker.tName] = [maker.c1ID, maker.c2ID]
          } else {
            if (supportTNames[maker.tName].indexOf(maker.c1ID) === -1) {
              supportTNames[maker.tName].push(maker.c1ID)
            }
            if (supportTNames[maker.tName].indexOf(maker.c2ID) === -1) {
              supportTNames[maker.tName].push(maker.c2ID)
            }
          }
        }
      }
      // console.log('supportChains =', supportChains)
      // console.log('supportTNames =', supportTNames)

      let nowTimeStamp = Date.parse(new Date()) / 1000
      let needTimeStamp =
        nowTimeStamp - 86400 * (req.daysAgo ? req.daysAgo : 10)

      if (
        Object.keys(supportChains).indexOf('1') !== -1 ||
        Object.keys(supportChains).indexOf('5') !== -1
      ) {

        let chainID = Object.keys(supportChains).indexOf('1') > -1 ? 1 : 5

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
          console.log('ethScanStartBlock =', ethScanStartBlock)
        } catch (error) {
          console.log('ethScanStartBlockError =', error)
          throw error.message
        }

        let ethscanReq = {
          maker: req.address,
          startblock: ethScanStartBlock,
          endblock: 999999999,
        }
        try {
          let res = await etherscan.getTransationList(ethscanReq, chainID)
          console.log('all =', res)
          for (const i in res.result) {
            if (Object.hasOwnProperty.call(res.result, i)) {
              let etherscanInfo = res.result[i]
              let txinfo = TxInfo.getTxInfoWithEtherScan(etherscanInfo)

              if (supportChains[chainID].indexOf(txinfo.tokenName) === -1) {
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
                if (Number(nonce) < 9000 && Number(nonce) >= 0) {
                  L1FromTxList.push(txinfo)
                }
              } else if (txinfo.to === makerAddress) {

                for (let j = 0; j < makerList.length; j++) {
                  let isMatch = false
                  if (
                    orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)
                  ) {
                    let makerInfo = makerList[j]
                    let makerChainIDs = [makerInfo.c1ID, makerInfo.c2ID]
                    let txChainID = [
                      chainID,
                      orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
                    ]

                    if (judgeArrayEqualFun(makerChainIDs, txChainID)) {
                      let avalibleTimes = makerInfo.avalibleTimes
                      for (let z = 0; z < avalibleTimes.length; z++) {
                        let avalibleTime = avalibleTimes[z]

                        if (
                          avalibleTime.startTime <= txinfo.timeStamp &&
                          avalibleTime.endTime >= txinfo.timeStamp
                        ) {
                          L1ToTxList.push(txinfo)
                          isMatch = true
                          break
                        }
                      }
                      if (isMatch) {
                        break
                      }
                    }
                  }
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
        // console.log('L1FromTxList =', L1FromTxList.length)
        // console.log('L1ToTxList =', L1ToTxList.length)
        // console.log('L1FromTxList =', L1FromTxList)
        // console.log('L1ToTxList =', L1ToTxList)
      }
      // =====================================================================
      if (
        Object.keys(supportChains).indexOf('3') !== -1 ||
        Object.keys(supportChains).indexOf('33') !== -1
      ) {
        let chainID = Object.keys(supportChains).indexOf('3') > -1 ? 3 : 33

        let zkTokenList
        try {
          zkTokenList = await getZKTokenAllList(chainID)
        } catch (err) {
          console.log('tokenlistError =', err)
        }
        let isContiue = true
        let lastHash = 0
        let zkAllTxList = []
        let supportTokenInfoDic = {}

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
                  let timestamp = new Date(tx.createdAt).getTime() / 1000
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
          } catch (error) {
            console.log('zkError =', error)
            throw error.message
          }
        }

        for (let i = 0; i < Object.keys(supportTNames).length; i++) {
          let tokenName = Object.keys(supportTNames)[i]
          let zkTokenInfoIndex = (zkTokenList || []).findIndex(
            (item) => item.symbol === tokenName,
          )
          if (zkTokenInfoIndex === -1) {
            continue
          }
          let zkTokenInfo = zkTokenList[zkTokenInfoIndex]
          supportTokenInfoDic[zkTokenInfo.id] = zkTokenInfo
        }

        for (let i = 0; i < zkAllTxList.length; i++) {
          let tx = zkAllTxList[i]

          if (supportTokenInfoDic[tx.token] === undefined) {
            continue
          }

          let zkTokenInfo = supportTokenInfoDic[tx.token]

          let txinfo = TxInfo.getTxInfoWithZksync(tx, zkTokenInfo)
          if (txinfo.from === makerAddress) {

            let pText = orbiterCore.getPTextFromTAmount(chainID, txinfo.value)
            let nonce = 0
            if (pText.state) {
              nonce = pText.pText
            }
            if (Number(nonce) < 9000 && Number(nonce) >= 0) {
              L1FromTxList.push(txinfo)
            }
          } else if (txinfo.to === makerAddress) {

            for (let j = 0; j < makerList.length; j++) {
              let isMatch = false
              if (orbiterCore.getToChainIDFromAmount(chainID, txinfo.value)) {
                let makerInfo = makerList[j]
                let makerChainIDs = [makerInfo.c1ID, makerInfo.c2ID]
                let txChainID = [
                  chainID,
                  orbiterCore.getToChainIDFromAmount(chainID, txinfo.value),
                ]

                if (judgeArrayEqualFun(makerChainIDs, txChainID)) {
                  let avalibleTimes = makerInfo.avalibleTimes
                  for (let z = 0; z < avalibleTimes.length; z++) {
                    let avalibleTime = avalibleTimes[z]

                    if (
                      avalibleTime.startTime <= txinfo.timeStamp &&
                      avalibleTime.endTime >= txinfo.timeStamp
                    ) {
                      ZKToTxList.push(txinfo)
                      isMatch = true
                      break
                    }
                  }
                  if (isMatch) {
                    break
                  }
                }
              }
            }
          }
        }
        originTxList[chainID] = {
          fromList: ZKFromTxList,
          toList: ZKToTxList,
        }
        // console.log('ZKFromTxList =', ZKFromTxList.length)
        // console.log('ZKToTxList =', ZKToTxList.length)
      }
      // ========================================================
      // if (
      //   Object.keys(supportChains).indexOf('2') !== -1 ||
      //   Object.keys(supportChains).indexOf('22') !== -1
      // ) {

      //   let arScanReq = {
      //     timestamp: needTimeStamp,
      //     closest: 'before',
      //   }
      //   let arScanStartBlock = 0
      //   try {
      //     let resp = await arbitrum.getBlockNumberWithTimeStamp(arScanReq, next)
      //     if (resp.status === '1' && resp.message === 'OK') {
      //       arScanStartBlock = resp.result
      //     } else {
      //       arScanStartBlock = 0
      //     }
      //     console.log('arScanStartBlock =', arScanStartBlock)
      //   } catch (error) {
      //     console.log('arScanStartBlockError =', error)
      //     throw error.message
      //   }

      //   let arscanReq = {
      //     maker: req.address,
      //     startblock: arScanStartBlock,
      //     endblock: 999999999,
      //   }
      //   try {
      //     let res = await arbitrum.getTransationList(arscanReq, next)
      //     for (const i in res.result) {
      //       if (Object.hasOwnProperty.call(res.result, i)) {
      //         let arbitrumInfo = res.result[i]
      //         let txinfo = TxInfo.getTxInfoWithEtherScan(arbitrumInfo)

      //         if (
      //           supportChains[config.arbitrum.chainID.toString()].indexOf(
      //             txinfo.tokenName,
      //           ) === -1
      //         ) {
      //           continue
      //         }
      //         if (txinfo.from === makerAddress) {
      //           ARFromTxList.push(txinfo)
      //         } else if (txinfo.to === makerAddress) {
      //           for (let j = 0; j < makerList.length; j++) {
      //             let makerInfo = makerList[j]
      //             let makerChainIDs = [makerInfo.c1ID, makerInfo.c2ID]
      //             let txChainID = [
      //               config.arbitrum.chainID,
      //               getChainIDStrFromAmount(txinfo.value),
      //             ]

      //             if (judgeArrayEqualFun(makerChainIDs, txChainID)) {
      //               let avalibleTimes = makerInfo.avalibleTimes
      //               for (let z = 0; z < avalibleTimes.length; z++) {
      //                 let avalibleTime = avalibleTimes[z]

      //                 if (
      //                   avalibleTime.startTime <= txinfo.timeStamp &&
      //                   avalibleTime.endTime >= txinfo.timeStamp
      //                 ) {
      //                   ARToTxList.push(txinfo)
      //                 }
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   } catch (error) {
      //     console.log('ethError =', error)
      //     throw error.message
      //   }
      //   originTxList[config.arbitrum.chainID] = {
      //     fromList: ARFromTxList,
      //     toList: ARToTxList,
      //   }
      //   console.log('ARFromTxList =', ARFromTxList.length)
      //   console.log('ARToTxList =', ARToTxList.length)
      // }
    }*/

    const transactionList = getTrasactionListFromTxList(
      originTxList,
      req.state,
      makerList
    )
    return transactionList
  }
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
      localChainID: chainID
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
    arr1.forEach(item => {
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
    for (let i = 0; i < Object.keys(origin).length; i++) {
      let fromChainID = Object.keys(origin)[i]
      let fromList = origin[fromChainID].fromList
      if (fromList.length === 0) {
        continue
      }
      for (let j = 0; j < fromList.length; j++) {
        let transaction
        let fromTxInfo = fromList[j]
        let now = parseInt(new Date().getTime() / 1000)
        let state = now - fromTxInfo.timeStamp > 86400 ? 2 : 1
        let toChainID = orbiterCore.getToChainIDFromAmount(
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
            state: state
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
              avalibleTimes: originMakerInfo.c1AvalibleTimes
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
              avalibleTimes: originMakerInfo.c2AvalibleTimes
            }
          }
          let realToAmount = orbiterCore.getToAmountFromUserAmount(
            new BigNumber(realFromAmount).dividedBy(
              new BigNumber(10 ** makerList[makerIndex].precision)
            ),
            useMakerInfo,
            true
          )

          let toAmount = orbiterCore.getTAmountFromRAmount(
            Number(toChainID),
            realToAmount,
            fromTxInfo.nonce.toString()
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
              fromTimeStamp: timeStampToTime(Number(fromTxInfo.timeStamp)),
              sortTimeStamp: Number(fromTxInfo.timeStamp),
              toTimeStamp: timeStampToTime(toTxInfo.timeStamp),
              tokenName: fromTxInfo.tokenName,
              fromTxHash: fromTxInfo.hash,
              toTxHash: toTxInfo.hash,
              state: 0
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
            state: state
          }
          transactionList.push(transaction)
          continue
        }
      }
    }
  }
  /* else {

    for (let i = 0; i < Object.keys(origin).length; i++) {
      let toChainID = Object.keys(origin)[i]
      let toList = origin[toChainID].toList
      if (toList.length === 0) {

        continue
      }
      for (let j = 0; j < toList.length; j++) {
        let transaction
        let toTxInfo = toList[j]
        let now = parseInt(new Date().getTime() / 1000)
        let state = now - toTxInfo.timeStamp > 1200 ? 2 : 1
        let fromChainID = getChainIDStrFromAmount(toTxInfo.value)

        let fromList = origin[fromChainID].fromList
        if (fromList.length === 0) {

          transaction = {
            fromChainID: fromChainID,
            toChainID: toChainID,
            userAddress: shortAddress(toTxInfo.from),
            makerAddress: shortAddress(toTxInfo.to),
            userAmount: toTxInfo.value,
            fromTimeStamp: 0,
            toTimeStamp: timeStampToTime(toTxInfo.timeStamp),
            sortTimeStamp: toTxInfo.timeStamp,
            tokenName: toTxInfo.tokenName,
            fromTxHash: '0',
            toTxHash: toTxInfo.txHash,
            state: state,
          }
          transactionList.push(transaction)
          continue
        }
        let isMatch = false
        for (let z = 0; z < fromList.length; z++) {
          let fromTxInfo = fromList[z]

          if (
            toTxInfo.from !== fromTxInfo.to ||
            !fromTxInfo.value.endsWith(toTxInfo.nonce.toString()) ||
            toTxInfo.tokenName !== fromTxInfo.tokenName
          ) {

            continue
          }

          let makerAddress = fromTxInfo.from
          let txChainIDS = [fromChainID, toChainID]


          let makerIndex = (makerList || []).findIndex((item) => {
            let makerChainIDs = [item.c1ID, item.c2ID]
            item.makerAddress === makerAddress &&
              judgeArrayEqualFun(txChainIDS, makerChainIDs)
          })
          if (makerIndex === -1) {
            continue
          }
          let txFee = makerList[makerIndex].fee
          let realToAmount = process.realAmount(
            toTxInfo.value,
            toTxInfo.tokenDecimal,
            5,
          )
          let realFromAmount = process.realAmount(
            fromTxInfo.value,
            fromTxInfo.tokenDecimal,
            5,
          )

          if (realToAmount * (1 - txFee / 10000) !== realFromAmount) {
            continue
          } else {

            fromList.splice(z, 1)
            transaction = {
              fromChainID: fromChainID,
              toChainID: toChainID,
              userAddress: shortAddress(fromTxInfo.to),
              makerAddress: shortAddress(makerAddress),
              userAmount: toTxInfo.value,
              fromTimeStamp: timeStampToTime(fromTxInfo.timeStamp),
              toTimeStamp: timeStampToTime(toTxInfo.timeStamp),
              sortTimeStamp: toTxInfo.timeStamp,
              tokenName: fromTxInfo.tokenName,
              fromTxHash: fromTxInfo.txHash,
              toTxHash: toTxInfo.txHash,
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
            userAddress: shortAddress(toTxInfo.from),
            makerAddress: shortAddress(toTxInfo.to),
            userAmount: toTxInfo.value,
            fromTimeStamp: 0,
            toTimeStamp: timeStampToTime(toTxInfo.timeStamp),
            sortTimeStamp: toTxInfo.timeStamp,
            tokenName: toTxInfo.tokenName,
            fromTxHash: '0',
            toTxHash: toTxInfo.txHash,
            state: state,
          }
          transactionList.push(transaction)
          continue
        }
      }
    }
  } */
  transactionList.sort(sortBy('sortTimeStamp'))
  return {
    list: transactionList,
    state: state // 0 / 1  maker / user
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
