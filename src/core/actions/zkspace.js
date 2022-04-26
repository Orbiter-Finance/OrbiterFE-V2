// util/thirdapi.js
import Axios from '../utils/Axios'
import axios from 'axios'
import * as ethers from 'ethers'
import * as zksync from 'zksync'
import config from '../utils/config'
import orbiterCore from '../../orbiterCore'
import { store } from '../../store'
import { private_key_to_pubkey_hash, sign_musig } from "zksync-crypto"

const BigNumber = require('bignumber.js')
Axios.axios()
export default {
  getZKspaceBalance: function (req) {
    return new Promise((resolve, reject) => {
      if (req.localChainID !== 12 && req.localChainID !== 512) {
        reject({
          errorCode: 1,
          errMsg: 'getZKSpaceAccountError_wrongChainID',
        })
      }
      const url =
        (req.localChainID === 512
          ? config.ZKSpace.Rinkeby
          : config.ZKSpace.Mainnet) +
        '/account/' +
        req.account +
        '/' +
        'balances'
      axios
        .get(url)
        .then(function (response) {
          if (response.status === 200 && response.statusText == 'OK') {
            var respData = response.data
            if (respData.success == true) {
              resolve(respData.data.balances.tokens)
            } else {
              reject(respData.data)
            }
          } else {
            reject({
              errorCode: 1,
              errMsg: 'NetWorkError',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errMsg: error,
          })
        })
    })
  },
  getZKTransferGasFee: function (localChainID, account) {
    let ethPrice = store.state.transferData.ethPrice
      ? store.state.transferData.ethPrice
      : 2000
    return new Promise((resolve, reject) => {
      if (localChainID !== 12 && localChainID !== 512) {
        reject({
          errorCode: 1,
          errMsg: 'getZKSpaceGasFeeError_wrongChainID',
        })
      }
      const url =
        (localChainID === 512
          ? config.ZKSpace.Rinkeby
          : config.ZKSpace.Mainnet) +
        '/account/' +
        account +
        '/' +
        'fee'
      axios
        .get(url)
        .then(function (response) {
          if (response.status === 200 && response.statusText == 'OK') {
            var respData = response.data
            if (respData.success == true) {
              const gasFee = new BigNumber(respData.data.transfer).dividedBy(
                new BigNumber(ethPrice)
              )
              let gasFee_fix = gasFee.decimalPlaces(6, BigNumber.ROUND_UP)
              resolve(Number(gasFee_fix))
            } else {
              reject(respData.data)
            }
          } else {
            reject({
              errorCode: 1,
              errMsg: 'NetWorkError',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errMsg: error.message,
          })
        })
    })
  },
  getZKSpaceWithDrawGasFee: function (localChainID, account) {
    let ethPrice = store.state.transferData.ethPrice
      ? store.state.transferData.ethPrice
      : 1000
    return new Promise((resolve, reject) => {
      if (localChainID !== 12 && localChainID !== 512) {
        reject({
          errorCode: 1,
          errMsg: 'getZKSpaceGasFeeError_wrongChainID',
        })
      }
      const url =
        (localChainID === 512
          ? config.ZKSpace.Rinkeby
          : config.ZKSpace.Mainnet) +
        '/account/' +
        account +
        '/' +
        'fee'
      axios
        .get(url)
        .then(function (response) {
          if (response.status === 200 && response.statusText == 'OK') {
            var respData = response.data
            if (respData.success == true) {
              const gasFee = new BigNumber(respData.data.withdraw).dividedBy(
                new BigNumber(ethPrice)
              )
              let gasFee_fix = gasFee.decimalPlaces(6, BigNumber.ROUND_UP)
              resolve(Number(gasFee_fix))
            } else {
              reject(respData.data)
            }
          } else {
            reject({
              errorCode: 1,
              errMsg: 'NetWorkError',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errMsg: error,
          })
        })
    })
  },
  /**
   *
   * @param {localChianID,account} req
   * @returns
   */
  getZKAccountInfo: function (localChainID, account) {
    return new Promise((resolve, reject) => {
      if (localChainID !== 12 && localChainID !== 512) {
        reject({
          errorCode: 1,
          errMsg: 'getZKSpaceAccountInfoError_wrongChainID',
        })
      }
      const url =
        (localChainID === 512
          ? config.ZKSpace.Rinkeby
          : config.ZKSpace.Mainnet) +
        '/account/' +
        account +
        '/' +
        'info'
      axios
        .get(url)
        .then(function (response) {
          if (response.status === 200 && response.statusText == 'OK') {
            var respData = response.data
            if (respData.success == true) {
              resolve(respData.data)
            } else {
              reject(respData.data)
            }
          } else {
            reject({
              errorCode: 1,
              errMsg: 'NetWorkError',
            })
          }
        })
        .catch(function (error) {
          reject({
            errorCode: 2,
            errMsg: error,
          })
        })
    })
  },
  sendTransfer: async function (localChainID, req) {
    if (localChainID !== 12 && localChainID !== 512) {
      return {
        code: '1',
        error: 'sendZKSpaceTransferError_wrongChainID',
      }
    }
    let response = await axios.post(
      (localChainID === 512 ? config.ZKSpace.Rinkeby : config.ZKSpace.Mainnet) +
      '/tx',
      {
        signature: req.signature,
        fastProcessing: req.fastProcessing,
        tx: req.tx,
      }
    )
    return response
  },
  getZKSpaceTransactionData: async function (localChainID, txHash) {

    if (localChainID !== 12 && localChainID !== 512) {
      throw new Error('getZKTransactionDataError_wrongChainID')
    }
    const url = (localChainID === 512 ? config.ZKSpace.Rinkeby : config.ZKSpace.Mainnet) + '/tx/' + txHash
    const response = await axios.get(url)

    if (response.status === 200 && response.statusText === 'OK') {
      var respData = response.data
      if (respData.success === true) {
        return respData
      } else {
        throw new Error(respData)
      }
    } else {
      throw new Error("getZKSpaceTransactionData NetWorkError")
    }
  },

  getZKSapceTxList: async (address, localChainID, startIndex, tokenID, limit) => {
    if (localChainID !== 12 && localChainID !== 512) {
      throw {
        errorCode: 1,
        errMsg: 'getZKSTransactinListError_wrongChainID',
      }
    }
    let baseUrl = localChainID === 512 ? config.ZKSpace.Rinkeby : config.ZKSpace.Mainnet
    const url = `${baseUrl}/txs?types=Transfer&address=${address}&token=${tokenID}&start=${startIndex}&limit=${limit}`
    try {
      const response = await axios.get(url)
      if (response.status === 200 && response.statusText === 'OK') {
        var respData = response.data
        if (respData.success === true) {
          return respData
        } else {
          throw respData
        }
      } else {
        throw {
          errorCode: 1,
          errMsg: 'NetWorkError',
        }
      }
    } catch (error) {
      throw {
        errorCode: 2,
        errMsg: error.message,
      }
    }
  },
  async getL2SigTwoAndPK(signer, accountInfo, selectMakerInfo, transferValue, fee, zksChainID) {
    try {
      const l2MsgParams = {
        accountId: accountInfo.id,
        to: selectMakerInfo.makerAddress,
        tokenSymbol: 'ETH',
        tokenAmount: ethers.utils.formatUnits(transferValue, 18),
        feeSymbol: 'ETH',
        fee: fee.toString(),
        zksChainID,
        nonce: accountInfo.nonce,
      }
      const l2Msg =
        `Transfer ${l2MsgParams.tokenAmount} ${l2MsgParams.tokenSymbol}\n` +
        `To: ${l2MsgParams.to.toLowerCase()}\n` +
        `Chain Id: ${l2MsgParams.zksChainID}\n` +
        `Nonce: ${l2MsgParams.nonce}\n` +
        `Fee: ${l2MsgParams.fee} ${l2MsgParams.feeSymbol}\n` +
        `Account Id: ${l2MsgParams.accountId}`
      const l2SignatureTwo = await signer.signMessage(l2Msg)
      return l2SignatureTwo
    } catch (error) {
      throw new Error(`getL2SigTwoAndPK error ${error.message}`)
    }
  },
  getL2SigOneAndPK(privateKey, accountInfo, walletAccount, selectMakerInfo, tokenId, transferValue, feeTokenId, transferFee, zksChainID) {
    const msgBytes = ethers.utils.concat([
      '0x05',
      zksync.utils.numberToBytesBE(accountInfo.id, 4),
      walletAccount,
      selectMakerInfo.makerAddress,
      zksync.utils.numberToBytesBE(tokenId, 2),
      zksync.utils.packAmountChecked(transferValue),
      zksync.utils.numberToBytesBE(feeTokenId, 1),
      zksync.utils.packFeeChecked(transferFee),
      zksync.utils.numberToBytesBE(zksChainID, 1),
      zksync.utils.numberToBytesBE(accountInfo.nonce, 4),
    ])
    const signaturePacked = sign_musig(privateKey, msgBytes)
    const pubKey = ethers.utils.hexlify(signaturePacked.slice(0, 32)).substr(2)
    const l2SignatureOne = ethers.utils.hexlify(signaturePacked.slice(32)).substr(2)
    return { pubKey, l2SignatureOne }
  },
  async getAccountInfo(fromChainID, privateKey, signer, walletAccount) {
    try {
      const accountInfo = await this.getZKAccountInfo(fromChainID, walletAccount)
      if (accountInfo.pub_key_hash == 'sync:0000000000000000000000000000000000000000') {
        const new_pub_key_hash = await this.registerAccount(accountInfo, privateKey, fromChainID, signer, walletAccount)
        accountInfo.pub_key_hash = new_pub_key_hash
        accountInfo.nonce = accountInfo.nonce + 1
      }
      return accountInfo
    } catch (error) {
      throw new Error(`getAccountInfo error ${error.message}`)
    }

  },
  async getTransferValue(selectMakerInfo, fromChainID, toChainID) {
    try {
      var rAmount = new BigNumber(store.state.transferData.transferValue)
        .plus(new BigNumber(selectMakerInfo.tradingFee))
        .multipliedBy(new BigNumber(10 ** selectMakerInfo.precision))
      var rAmountValue = rAmount.toFixed()
      var p_text = 9000 + Number(toChainID) + ''
      var tValue = orbiterCore.getTAmountFromRAmount(
        fromChainID,
        rAmountValue,
        p_text
      )
      if (!tValue.state) {
        this.$notify.error({
          title: tValue.error,
          duration: 3000,
        })
        this.transferLoading = false
        return null
      }
      const transferValue = zksync.utils.closestPackableTransactionAmount(
        tValue.tAmount
      )
      return { transferValue, tValue }
    } catch (error) {
      throw new Error(`getTransferValue error ${error.message}`)
    }

  },
  async getL1SigAndPriVateKey(signer) {
    try {
      const msg =
        'Access ZKSwap account.\n\nOnly sign this message for a trusted client!'
      const signature = await signer.signMessage(msg)
      const seed = ethers.utils.arrayify(signature)
      const privateKey = await zksync.crypto.privateKeyFromSeed(seed)
      return privateKey
    } catch (error) {
      throw new Error(`getL1SigAndPriVateKey error ${error.message}`)
    }

  },
  async registerAccount(accountInfo, privateKey, fromChainID, signer, walletAccount) {
    try {
      const pubKeyHash = ethers.utils.hexlify(private_key_to_pubkey_hash(privateKey)).substr(2)
      const hexlifiedAccountId = this.toHex(accountInfo.id, 4)
      const hexlifiedNonce = this.toHex(accountInfo.nonce, 4)
      // Don't move here any way and don't format it anyway!!!
      let resgiterMsg = `Register ZKSwap pubkey:

${pubKeyHash}
nonce: ${hexlifiedNonce}
account id: ${hexlifiedAccountId}

Only sign this message for a trusted client!`

      const registerSignature = await signer.signMessage(resgiterMsg)
      const url = `${fromChainID == 512 ? config.ZKSpace.Rinkeby : config.ZKSpace.Mainnet}/tx`
      let transferResult = await axios.post(url,
        {
          signature: null,
          fastProcessing: null,
          extraParams: null,
          tx: {
            account: walletAccount,
            accountId: accountInfo.id,
            ethSignature: registerSignature,
            newPkHash: `sync:` + pubKeyHash,
            nonce: 0,
            type: "ChangePubKey",
          }
        },
        {
          headers: {
            "zk-account": walletAccount
          },
        }
      )
      if (transferResult.status == 200 && transferResult.data.success) {
        return transferResult.data
      } else {
        throw new Error("registerAccount fail")
      }
    } catch (error) {
      throw new Error(`registerAccount error ${error.message}`)
    }

  },
  toHex(num, length) {
    var charArray = ['a', 'b', 'c', 'd', 'e', 'f']
    let strArr = Array(length * 2).fill("0")
    var i = length * 2 - 1;
    while (num > 15) {
      var yushu = num % 16;
      if (yushu >= 10) {
        let index = yushu % 10;
        strArr[i--] = charArray[index];
      } else {
        strArr[i--] = yushu.toString();
      }
      num = Math.floor(num / 16);
    }

    if (num != 0) {
      if (num >= 10) {
        let index = num % 10;
        strArr[i--] = charArray[index];
      } else {
        strArr[i--] = num.toString();
      }
    }
    strArr.unshift('0x')
    var hex = strArr.join('');
    return hex;
  }
}
