<template>
<div class="confirm-box">
  <CommBoxHeader :back="closerButton" :style="isMobile?'':'margin-bottom:30px;'">Confirm</CommBoxHeader>
  <div v-for="item in confirmData" :key="item.title" class="confirm-item" :style="{marginBottom: item.haveSep ? '46px' : '22px'}">
    <div class="item-left">
      <SvgIconThemed :icon="item.icon" />
      <span class="left-txt">{{item.title}}</span>
      <o-tooltip placement="topLeft">
        <template v-slot:titleDesc>
          <span>{{ item.notice }}</span>
        </template>
        <SvgIconThemed v-if="item.notice" icon="help" size="sm" />
      </o-tooltip>
    </div>
    <div class="item-right">
      <span v-if="item.desc" :class="{textBold: item.textBold}">{{ item.desc }}</span>
    </div>
    <div v-if="item.descInfo && item.descInfo.length > 0" class="descBottom">
      <div v-for="desc in item.descInfo" :key="desc.no" style="margin-bottom: 1rem">
        Send
        <span style="margin-left: 0.7rem; margin-right: 1.1rem;color:#DF2E2D;">{{ desc.amount }}{{ desc.coin }}</span>
        To
        <span style="margin-left: 0.7rem;color:#DF2E2D;">{{desc.toAddress}}</span>
      </div>
    </div>
  </div>
  <div v-if="isStarkNetChain" style="padding:0 30px;display:flex;text-align:left;padding-top: 8px;">
    <SvgIconThemed style="margin-right:10px;" icon="info" />
    <span style="color:#DF2E2D">StarkNet is still in alpha version, the transaction on it maybe will be done in 1~2 hours. Orbiter keeps your funds safe.</span>
  </div>
  <div style="padding:0 30px;display:flex;text-align:left;padding-top: 8px;">
    <SvgIconThemed style="margin-right:10px;" icon="info" />
    <span style="color:#DF2E2D">Modifying the transfer amount in MetaMask will cause the transfer to fail.</span>
  </div>

  <CommBtn @click="RealTransfer" class="select-wallet-dialog">
    <span
      v-if="!transferLoading"
      class="wbold s16"
      style="letter-spacing: 0.1rem"
      >CONFIRM AND SEND</span
    >
    <CommLoading
      v-else
      style="margin: auto"
      loadingColor="white"
      width="2rem"
      height="2rem"
    />
  </CommBtn>
</div>
</template>

<script>
import { SvgIconThemed, CommBoxHeader, CommBtn } from '../../components'
import BigNumber from 'bignumber.js'
import getProceeding from '../../util/proceeding/getProceeding'
import {
  getTransferContract,
  getTransferGasLimit,
} from '../../util/constants/contract/getContract.js'
import transferCalculate from '../../util/transfer/transferCalculate'
import orbiterCore from '../../orbiterCore'
import util from '../../util/util'
import Middle from '../../util/middle/middle'
import { utils } from 'zksync'
import { submitSignedTransactionsBatch } from 'zksync/build/wallet'
import Web3 from 'web3'
import {
  sendTransfer,
  getStarkMakerAddress,
} from '../../util/constants/starknet/helper'
import loopring from '../../core/actions/loopring'
import { IMXHelper } from '../../util/immutablex/imx_helper'
import { ERC20TokenType, ETHTokenType } from '@imtbl/imx-sdk'
import { CrossAddress } from '../../util/cross_address'
import { DydxHelper } from '../../util/dydx/dydx_helper'
import { checkStateWhenConfirmTransfer } from '../../util/confirmCheck'
import zkspace from '../../core/actions/zkspace'
import config from '../../core/utils/config'
import env from '../../../env'
import * as ethers from 'ethers'
import * as zksync from 'zksync'
import { walletIsLogin, compatibleGlobalWalletConf } from "../../composition/walletsResponsiveData";
import { walletDispatchersOnSignature, walletDispatchersOnSwitchChain } from "../../util/walletsDispatchers";
import { isMobile } from '../../composition/hooks'

export default {
  name: 'Confirm',
  components: { SvgIconThemed, CommBoxHeader, CommBtn, },
  data() {
    return {
      transferLoading: false,
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    isStarkNetChain() {
      const { fromChainID, toChainID } = this.$store.state.transferData
      return fromChainID == 4 ||
        fromChainID == 44 ||
        toChainID == 4 ||
        toChainID == 44
    },
    confirmData() {
      // 0.000120000000009022 to 0.000120...09022
      let realTransferAmount = transferCalculate.realTransferAmount().toString()
      realTransferAmount = realTransferAmount.replace(
        /(.*?0)0{4,}(0.*?)/,
        '$1...$2'
      )
      if (this.isStarkNetChain) {
        return [
          {
            icon: 'withholding',
            title: 'Withholding Fee',
            notice:
              'Maker will charge Sender a fixed fee to cover the fluctuant gas fee incurred on the destination network.',
            desc:
              (this.$store.getters.realSelectMakerInfo
                ? this.$store.getters.realSelectMakerInfo.tradingFee
                : 0) +
              ' ' +
              this.$store.getters.realSelectMakerInfo.tName,
          },
          {
            icon: 'security',
            title: 'Security Code',
            notice:
              'In Orbiter, each transaction will have a security code. The code is attached to the end of the transfer amount in the form of a four-digit number to specify the necessary information for the transfer. If a Maker is dishonest, the security code will become the necessary evidence for you to claim money from margin contracts.',
            desc: transferCalculate.realTransferOPID(),
            haveSep: true,
          },
          {
            icon: 'send',
            title: 'Total Send',
            notice:
              'Include the amount transferred by Sender and withholding gas fee.',
            desc:
              realTransferAmount +
              ' ' +
              this.$store.getters.realSelectMakerInfo.tName,
            textBold: true,
          },
          {
            icon: 'Received',
            title: 'Received',
            desc:
              orbiterCore.getToAmountFromUserAmount(
                new BigNumber(
                  this.$store.state.transferData.transferValue
                ).plus(
                  new BigNumber(
                    this.$store.getters.realSelectMakerInfo.tradingFee
                  )
                ),
                this.$store.getters.realSelectMakerInfo,
                false
              ) +
              ' ' +
              this.$store.getters.realSelectMakerInfo.tName,
            textBold: true,
          },
          {
            icon: 'exchange',
            title: 'Maker Routes',
            notice:
              "After a sender submits a transfer application, the asset is transferred to the Maker's address and the Maker will provide liquidity. Orbiter's staking agreement ensures the security of the asset.",
            descInfo: this.$store.state.confirmData.routeDescInfo,
          },
        ]
      }

      return [
        {
          icon: 'withholding',
          title: 'Withholding Fee',
          notice:
            'Maker will charge Sender a fixed fee to cover the fluctuant gas fee incurred on the destination network.',
          desc:
            (this.$store.getters.realSelectMakerInfo
              ? this.$store.getters.realSelectMakerInfo.tradingFee
              : 0) +
            ' ' +
            this.$store.getters.realSelectMakerInfo.tName,
        },
        {
          icon: 'security',
          title: 'Security Code',
          notice:
            'In Orbiter, each transaction will have a security code. The code is attached to the end of the transfer amount in the form of a four-digit number to specify the necessary information for the transfer. If a Maker is dishonest, the security code will become the necessary evidence for you to claim money from margin contracts.',
          desc: transferCalculate.realTransferOPID(),
          haveSep: true,
        },
        {
          icon: 'send',
          title: 'Total Send',
          notice:
            'Include the amount transferred by Sender and withholding gas fee.',
          desc:
            realTransferAmount +
            ' ' +
            this.$store.getters.realSelectMakerInfo.tName,
          textBold: true,
        },
        {
          icon: 'received',
          title: 'Received',
          desc:
            orbiterCore.getToAmountFromUserAmount(
              new BigNumber(this.$store.state.transferData.transferValue).plus(
                new BigNumber(
                  this.$store.getters.realSelectMakerInfo.tradingFee
                )
              ),
              this.$store.getters.realSelectMakerInfo,
              false
            ) +
            ' ' +
            this.$store.getters.realSelectMakerInfo.tName,
          textBold: true,
        },
        {
          icon: 'exchange',
          title: 'Maker Routes',
          notice:
            "After a sender submits a transfer application, the asset is transferred to the Maker's address and the Maker will provide liquidity. Orbiter's staking agreement ensures the security of the asset.",
          descInfo: this.$store.state.confirmData.routeDescInfo,
        },
      ]
    },
  },
  methods: {
    async zkspceTransfer(fromChainID, toChainID, selectMakerInfo) {
      try {
        let provider = new ethers.providers.Web3Provider(compatibleGlobalWalletConf.value.walletPayload.provider)
        const walletAccount = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
        const signer = provider.getSigner()

        const privateKey = await zkspace.getL1SigAndPriVateKey(signer)

        const { transferValue, tValue } = await zkspace.getTransferValue(
          selectMakerInfo,
          fromChainID,
          toChainID
        )

        const accountInfo = await zkspace.getAccountInfo(
          fromChainID,
          privateKey,
          signer,
          walletAccount
        )
        const feeTokenId = 0
        const zksNetWorkID =
          fromChainID === 512
            ? config.ZKSpace.zksrinkebyChainID
            : config.ZKSpace.zksChainID

        let fee = await zkspace.getZKSpaceTransferGasFee(
          fromChainID,
          walletAccount
        )

        const transferFee = zksync.utils.closestPackableTransactionFee(
          ethers.utils.parseUnits(fee.toString(), 18)
        )

        const zksTokenInfos =
          fromChainID === 12
            ? this.$store.state.zksTokenList.mainnet
            : this.$store.state.zksTokenList.rinkeby
        const tokenAddress =
          fromChainID == selectMakerInfo.c1ID
            ? selectMakerInfo.t1Address
            : selectMakerInfo.t2Address
        const tokenInfo = zksTokenInfos.find(
          (item) => item.address == tokenAddress
        )
        const { pubKey, l2SignatureOne } = zkspace.getL2SigOneAndPK(
          privateKey,
          accountInfo,
          walletAccount,
          selectMakerInfo,
          tokenInfo ? tokenInfo.id : 0,
          transferValue,
          feeTokenId,
          transferFee,
          zksNetWorkID
        )

        const l2SignatureTwo = await zkspace.getL2SigTwoAndPK(
          signer,
          accountInfo,
          selectMakerInfo,
          transferValue,
          fee,
          zksNetWorkID,
          tokenInfo
        )
        const req = {
          signature: {
            type: 'EthereumSignature',
            signature: l2SignatureTwo,
          },
          fastProcessing: false,
          tx: {
            type: 'Transfer',
            accountId: accountInfo.id,
            from: walletAccount,
            to: selectMakerInfo.makerAddress,
            token: tokenInfo ? tokenInfo.id : 0,
            amount: transferValue.toString(),
            feeToken: feeTokenId,
            fee: transferFee.toString(),
            chainId: zksNetWorkID,
            nonce: accountInfo.nonce,
            signature: {
              pubKey: pubKey,
              signature: l2SignatureOne,
            },
          },
        }
        const transferResult = await zkspace.sendTransfer(fromChainID, req)
        const txHash = transferResult.data.data.replace('sync-tx:', '0x')

        const firstResult = await this.getFristResult(fromChainID, txHash)

        this.onTransferSucceed(
          walletAccount,
          selectMakerInfo,
          tValue.tAmount.toString(),
          fromChainID,
          firstResult.data.tx_hash
        )
        this.transferLoading = false
      } catch (error) {
        this.transferLoading = false
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
        console.warn('zkspceTransfer =', error.message)
        return
      }
    },
    getFristResult(fromChainID, txHash) {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          const firstResult = await zkspace.getZKSpaceTransactionData(
            fromChainID,
            txHash
          )
          if (
            firstResult.success &&
            !firstResult.data.fail_reason &&
            !firstResult.data.success &&
            !firstResult.data.amount
          ) {
            resolve(await this.getFristResult(fromChainID, txHash))
          } else if (
            firstResult.success &&
            !firstResult.data.fail_reason &&
            firstResult.data.success &&
            firstResult.data.amount
          ) {
            resolve(firstResult)
          } else {
            reject(new Error('zks sendResult is error, do not care'))
          }
        }, 300)
      })
    },

    async zkTransfer(fromChainID, toChainID, selectMakerInfo) {
      const web3Provider = new Web3(compatibleGlobalWalletConf.value.walletPayload.provider)
      const walletAccount = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
      var tokenAddress =
        selectMakerInfo.c1ID === fromChainID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      const ethWallet = new ethers.providers.Web3Provider(
        web3Provider.currentProvider
      )
      const syncProvider =
        fromChainID === 3
          ? await zksync.getDefaultProvider('mainnet')
          : await zksync.getDefaultProvider('rinkeby')
      // const contractAddresses = await syncProvider.getTokens();
      try {
        const syncWallet = await zksync.Wallet.fromEthSigner(
          ethWallet.getSigner(walletAccount),
          syncProvider
        )
        // const state = await syncWallet.getAccountState();

        var rAmount = new BigNumber(
          this.$store.state.transferData.transferValue
        )
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
          return
        }
        const amount = zksync.utils.closestPackableTransactionAmount(
          tValue.tAmount
        )
        const transferFee = await syncProvider.getTransactionFee(
          'Transfer',
          syncWallet.address() || '',
          tokenAddress
        )
        if (!(await syncWallet.isSigningKeySet())) {
          const nonce = await syncWallet.getNonce('committed')
          const batchBuilder = syncWallet.batchBuilder(nonce)
          if (syncWallet.ethSignerType?.verificationMethod === 'ERC-1271') {
            const isOnchainAuthSigningKeySet =
              await syncWallet.isOnchainAuthSigningKeySet()
            if (!isOnchainAuthSigningKeySet) {
              const onchainAuthTransaction =
                await syncWallet.onchainAuthSigningKey()
              await onchainAuthTransaction?.wait()
            }
          }
          const newPubKeyHash = await syncWallet.signer.pubKeyHash()
          const accountID = await syncWallet.getAccountId()
          if (typeof accountID !== 'number') {
            throw new TypeError(
              'It is required to have a history of balances on the account to activate it.'
            )
          }
          const changePubKeyMessage = utils.getChangePubkeyLegacyMessage(
            newPubKeyHash,
            nonce,
            accountID
          )
          const ethSignature = (
            await syncWallet.getEthMessageSignature(changePubKeyMessage)
          ).signature
          const keyFee = await syncProvider.getTransactionFee(
            {
              ChangePubKey: { onchainPubkeyAuth: false },
            },
            syncWallet.address() || '',
            tokenAddress
          )

          const changePubKeyTx = await syncWallet.signer.signSyncChangePubKey({
            accountId: accountID,
            account: syncWallet.address(),
            newPkHash: newPubKeyHash,
            nonce: nonce,
            ethSignature: ethSignature,
            validFrom: 0,
            validUntil: utils.MAX_TIMESTAMP,
            fee: keyFee.totalFee,
            feeTokenId:
              syncWallet.provider.tokenSet.resolveTokenId(tokenAddress),
          })
          batchBuilder.addChangePubKey({
            tx: changePubKeyTx,
            // @ts-ignore
            alreadySigned: true,
          })
          batchBuilder.addTransfer({
            to: selectMakerInfo.makerAddress,
            token: tokenAddress,
            amount: amount,
            fee: transferFee.totalFee,
          })
          const batchTransactionData = await batchBuilder.build()
          const transactions = await submitSignedTransactionsBatch(
            syncWallet.provider,
            batchTransactionData.txs,
            [batchTransactionData.signature]
          )
          let transaction
          for (const tx of transactions) {
            if (tx.txData.tx.type !== 'ChangePubKey') {
              transaction = tx
              break
            }
          }
          const transferReceipt = await transaction.awaitReceipt()
          if (transferReceipt.success && !transferReceipt.failReason) {
            this.onTransferSucceed(
              walletAccount,
              selectMakerInfo,
              amount.toString(),
              fromChainID,
              transaction.txHash
            )
          }
          this.transferLoading = false
        } else {
          try {
            const transfer = await syncWallet.syncTransfer({
              to: selectMakerInfo.makerAddress,
              token: tokenAddress,
              amount: amount,
            })
            // this.$notify.success({
            //   title: transfer.txHash,
            //   duration: 3000,
            // })
            const transferReceipt = await transfer.awaitReceipt()
            if (transferReceipt.success && !transferReceipt.failReason) {
              this.onTransferSucceed(
                walletAccount,
                selectMakerInfo,
                amount.toString(),
                fromChainID,
                transfer.txHash
              )
            }
            this.transferLoading = false
          } catch (error) {
            console.warn('inError =', error.message)
            this.transferLoading = false
            this.$notify.error({
              title: error.message,
              duration: 3000,
            })
          }
        }
      } catch (error) {
        console.warn('outError =', error.message)
        this.transferLoading = false
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      }
    },
    async loopringTransfer(fromChainID, toChainID, selectMakerInfo) {
      var tokenAddress =
        selectMakerInfo.c1ID === fromChainID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address

      try {
        var rAmount = new BigNumber(
          this.$store.state.transferData.transferValue
        )
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
          return
        }
        const amount = tValue.tAmount
        try {
          const response = await loopring.sendTransfer(
            compatibleGlobalWalletConf.value.walletPayload.walletAddress,
            this.$store.state.transferData.fromChainID,
            selectMakerInfo.makerAddress,
            0,
            tokenAddress,
            amount,
            p_text
          )
          if (response.hash && response.status == 'processing') {
            this.onTransferSucceed(
              compatibleGlobalWalletConf.value.walletPayload.walletAddress,
              selectMakerInfo,
              amount,
              fromChainID,
              response.hash
            )
          }
          this.transferLoading = false
        } catch (error) {
          this.transferLoading = false
          if (error.message == 'account is not activated') {
            const notify = this.$notify({
              type: 'error',
              message: `<div style="text-align:left;font-size: 1.4rem; color: black">This Loopring account is not activated, please activate it at <span style="color:blue;text-decoration: underline"> here </span> before transferring.</div>`,
              dangerouslyUseHTMLString: true,
              duration: 8000,
            })
            notify.$el.querySelector('span').onclick = () => {
              notify.close()
              window.open('https://loopring.io/#/layer2/assets', '_blank')
            }
          } else if (error.message == 'User account is frozen') {
            const notify = this.$notify({
              type: 'error',
              message: `<div style="text-align:left;font-size: 1.4rem; color: black">Your Loopring account is frozen, please check your Loopring account status on Loopring website. Get more details <span style="color:blue;text-decoration: underline"> here </span>.</div>`,
              dangerouslyUseHTMLString: true,
              duration: 8000,
            })
            notify.$el.querySelector('span').onclick = () => {
              notify.close()
              window.open(
                'https://docs.loopring.io/en/basics/key_mgmt.html?h=frozen',
                '_blank'
              )
            }
          } else {
            this.$notify.error({
              title: error.message,
              duration: 3000,
            })
          }
        }
      } catch (error) {
        console.warn('outError =', error.message)
        this.transferLoading = false
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      }
    },
    addChainNetWork() {
      var that = this
      var chain = util.getChainInfo(
        this.$env.localChainID_netChainID[
          this.$store.state.transferData.fromChainID
        ]
      )
      const switchParams = {
        chainId: util.toHex(chain.chainId),
      } 
        compatibleGlobalWalletConf.value.walletPayload.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [switchParams],
        })
        .then(() => {
          let fromChainID = this.$store.state.transferData.fromChainID
          let toAddress = util.shortAddress(
            that.$store.getters.realSelectMakerInfo.makerAddress
          )
          if (fromChainID == 4 || fromChainID == 44) {
            toAddress = util.shortAddress(
              getStarkMakerAddress(
                that.$store.getters.realSelectMakerInfo.makerAddress,
                fromChainID
              )
            )
          }
          // switch success
          that.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: new BigNumber(
                that.$store.state.transferData.transferValue
              ).plus(
                new BigNumber(
                  that.$store.getters.realSelectMakerInfo.tradingFee
                )
              ),
              coin: that.$store.state.transferData.selectTokenInfo.token,
              toAddress: toAddress,
            },
          ])
          this.RealTransfer()
        })
        .catch((error) => {
          console.warn(error)
          if (error.code === 4902) {
            // need add net
            const params = {
              chainId: util.toHex(chain.chainId), // A 0x-prefixed hexadecimal string
              chainName: chain.name,
              nativeCurrency: {
                name: chain.nativeCurrency.name,
                symbol: chain.nativeCurrency.symbol, // 2-6 characters long
                decimals: chain.nativeCurrency.decimals,
              },
              rpcUrls: chain.rpc,
              blockExplorerUrls: [
                chain.explorers &&
                chain.explorers.length > 0 &&
                chain.explorers[0].url
                  ? chain.explorers[0].url
                  : chain.infoURL,
              ],
            }
            compatibleGlobalWalletConf.value.walletPayload.provider
              .request({
                method: 'wallet_addEthereumChain',
                params: [params, compatibleGlobalWalletConf.value.walletPayload.walletAddress],
              })
              .then(() => {})
              .catch((error) => {
                console.warn(error)
                util.showMessage(error.message, 'error')
              })
          } else {
            util.showMessage(error.message, 'error')
          }
        })
    },
    async ethTransfer(from, selectMakerInfo, value, fromChainID) {

      const matchSignatureDispatcher = walletDispatchersOnSignature[compatibleGlobalWalletConf.value.walletType];
      if (matchSignatureDispatcher) {
        matchSignatureDispatcher(from, selectMakerInfo, value, fromChainID, this.onTransferSucceed);
        return;
      }


      if ((!compatibleGlobalWalletConf.value.walletPayload.isInstalled) && (!this.$store.state.web3.isInstallMeta)) {
        this.transferLoading = false
        return
      }

      try {
        const web3 = new Web3(compatibleGlobalWalletConf.value.walletPayload.provider)

        let gasLimit = await getTransferGasLimit(
          fromChainID,
          selectMakerInfo,
          from,
          selectMakerInfo.makerAddress,
          value
        )
        if (gasLimit < 21000) {
          gasLimit = 21000
        }
        await web3.eth.sendTransaction(
          {
            from,
            to: selectMakerInfo.makerAddress,
            value,
            gas: gasLimit,
          },
          (error, hash) => {
            this.transferLoading = false

            if (!error) {
              this.onTransferSucceed(
                from,
                selectMakerInfo,
                value,
                fromChainID,
                hash
              )
            } else {
              this.$notify.error({
                title: error.message,
                duration: 3000,
              })
            }
          }
        )
      } catch (error) {
        console.error(error)
      }
    },
    async starknetTransfer(from, selectMakerInfo, value, fromChainID) {
      if (!compatibleGlobalWalletConf.value.walletPayload.isInstalled || this.$store.state.web3.isInstallMeta) {
        this.transferLoading = false
        return
      }

      if (fromChainID == 4 || fromChainID == 44) {
        const { starkChain } = this.$store.state.web3.starkNet
        if (!starkChain || starkChain == 'unlogin') {
          util.showMessage('please connect StarkNet Wallet', 'error')
          return
        }
        if (
          fromChainID == 4 &&
          (starkChain == 44 || starkChain == 'localhost')
        ) {
          util.showMessage('please switch StarkNet Wallet to mainnet', 'error')
          return
        }
        if (
          fromChainID == 44 &&
          (starkChain == 4 || starkChain == 'localhost')
        ) {
          util.showMessage('please switch StarkNet Wallet to testNet', 'error')
          return
        }
      }
      try {
        let contractAddress = selectMakerInfo.t1Address
        if (selectMakerInfo.c1ID != fromChainID) {
          contractAddress = selectMakerInfo.t2Address
        }
        const hash = await sendTransfer(
          from,
          contractAddress,
          selectMakerInfo.makerAddress,
          new BigNumber(value),
          fromChainID
        )
        if (hash) {
          this.onTransferSucceed(
            from,
            selectMakerInfo,
            value,
            fromChainID,
            hash
          )
        }
      } catch (error) {
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      } finally {
        this.transferLoading = false
      }
    },
    async imxTransfer(from, selectMakerInfo, value, fromChainID) {
      if (!compatibleGlobalWalletConf.value.walletPayload.isInstalled || this.$store.state.web3.isInstallMeta) {
        this.transferLoading = false
        return
      }

      try {
        let contractAddress = selectMakerInfo.t1Address
        if (selectMakerInfo.c1ID != fromChainID) {
          contractAddress = selectMakerInfo.t2Address
        }

        const imxHelper = new IMXHelper(fromChainID)
        const imxClient = await imxHelper.getImmutableXClient(from, true)

        let tokenInfo = {
          type: ETHTokenType.ETH,
          data: {
            decimals: selectMakerInfo.precision,
          },
        }
        if (!util.isEthTokenAddress(contractAddress)) {
          tokenInfo = {
            type: ERC20TokenType.ERC20,
            data: {
              symbol: selectMakerInfo.tName,
              decimals: selectMakerInfo.precision,
              tokenAddress: contractAddress,
            },
          }
        }

        const resp = await imxClient.transfer({
          sender: from,
          token: tokenInfo,
          quantity: ethers.BigNumber.from(value),
          receiver: selectMakerInfo.makerAddress,
        })

        this.onTransferSucceed(
          from,
          selectMakerInfo,
          value,
          fromChainID,
          resp.transfer_id
        )
      } catch (error) {
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      } finally {
        this.transferLoading = false
      }
    },
    async dydxTransfer(from, selectMakerInfo, value, fromChainID) {
      if (!compatibleGlobalWalletConf.value.walletPayload.isInstalled || this.$store.state.web3.isInstallMeta) {
        this.transferLoading = false
        return
      }

      try {
        const dydxHelper = new DydxHelper(
          fromChainID,
          new Web3(compatibleGlobalWalletConf.value.walletPayload.provider),
          'MetaMask'
        )
        const dydxMakerInfo = dydxHelper.getMakerInfo(
          selectMakerInfo.makerAddress
        )
        const dydxClient = await dydxHelper.getDydxClient(from, false, true)
        const dydxAccount = await dydxHelper.getAccount(from)

        const params = {
          clientId: dydxHelper.generateClientId(from),
          amount: new BigNumber(value).dividedBy(10 ** 6).toString(), // Only usdc now!
          expiration: new Date(
            new Date().getTime() + 86400000 * 30
          ).toISOString(),
          receiverAccountId: dydxHelper.getAccountId(
            selectMakerInfo.makerAddress
          ),
          receiverPublicKey: dydxMakerInfo.starkKey,
          receiverPositionId: String(dydxMakerInfo.positionId),
        }
        const resp = await dydxClient.private.createTransfer(
          params,
          dydxAccount.positionId
        )

        this.onTransferSucceed(
          from,
          selectMakerInfo,
          value,
          fromChainID,
          resp.transfer.id
        )
      } catch (error) {
        console.error(error)
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      } finally {
        this.transferLoading = false
      }
    },

    async transferCrossAddress(from, selectMakerInfo, value, fromChainID) {
      if (!compatibleGlobalWalletConf.value.walletPayload.isInstalled || this.$store.state.web3.isInstallMeta) {
        return
      }

      let contractAddress = selectMakerInfo.t1Address
      if (selectMakerInfo.c1ID != fromChainID) {
        contractAddress = selectMakerInfo.t2Address
      }

      try {
        const { transferExt } = this.$store.state.transferData
        const provider = new ethers.providers.Web3Provider(compatibleGlobalWalletConf.value.walletPayload.provider)
        const crossAddress = new CrossAddress(provider, fromChainID)

        const amount = ethers.BigNumber.from(value)
        let transactionHash = ''

        if (util.isEthTokenAddress(contractAddress)) {
          transactionHash = (
            await crossAddress.transfer(
              selectMakerInfo.makerAddress,
              amount,
              transferExt
            )
          ).hash
        } else {
          transactionHash = (
            await crossAddress.transferERC20(
              contractAddress,
              selectMakerInfo.makerAddress,
              amount,
              transferExt
            )
          ).hash
        }

        this.onTransferSucceed(
          from,
          selectMakerInfo,
          value,
          fromChainID,
          transactionHash
        )
      } catch (err) {
        this.$notify.error({
          title: err?.data?.message || err.message,
          duration: 3000,
        })
      } finally {
        this.transferLoading = false
      }
    },

    async RealTransfer() {
      if (!walletIsLogin.value) {
        Middle.$emit('connectWallet', true)
        return
      }
      const { fromChainID, toChainID, transferExt } =
        this.$store.state.transferData

      if (fromChainID != 4 && fromChainID != 44) {
        if (
        compatibleGlobalWalletConf.value.walletPayload.networkId.toString() !==
        this.$env.localChainID_netChainID[
          this.$store.state.transferData.fromChainID
        ]
      ) {
          const matchAddChainDispatcher = walletDispatchersOnSwitchChain[compatibleGlobalWalletConf.value.walletType];
          if (matchAddChainDispatcher) {
            matchAddChainDispatcher(compatibleGlobalWalletConf.value.walletPayload.provider);
            return;
          }
        }
      }
        
      // Only one
      if (this.transferLoading) {
        return
      }

      // sendTransfer
      const selectMakerInfo = this.$store.getters.realSelectMakerInfo

      // Check fromChainID isSupportEVM
      if (transferExt && !util.isSupportEVM(fromChainID)) {
        this.$notify.error({
          title: `Sorry, this fromChainID: ${fromChainID} no support EVM!`,
          duration: 3000,
        })
        return
      }
      this.transferLoading = true

      let shouldReceiveValue = orbiterCore.getToAmountFromUserAmount(
        new BigNumber(this.$store.state.transferData.transferValue).plus(
          new BigNumber(this.$store.getters.realSelectMakerInfo.tradingFee)
        ),
        this.$store.getters.realSelectMakerInfo,
        false
      )

      if (!(await checkStateWhenConfirmTransfer(shouldReceiveValue))) {
        this.transferLoading = false
        return
      }

      if (toChainID != 11 && toChainID != 511) {
        let shouldReceiveValue = orbiterCore.getToAmountFromUserAmount(
          new BigNumber(this.$store.state.transferData.transferValue).plus(
            new BigNumber(this.$store.getters.realSelectMakerInfo.tradingFee)
          ),
          this.$store.getters.realSelectMakerInfo,
          false
        )
        if (!(await checkStateWhenConfirmTransfer(shouldReceiveValue))) {
          this.transferLoading = false
          return
        }
      }

      if (fromChainID === 3 || fromChainID === 33) {
        this.zkTransfer(fromChainID, toChainID, selectMakerInfo)
      } else if (fromChainID === 9 || fromChainID === 99) {
        this.loopringTransfer(fromChainID, toChainID, selectMakerInfo)
      } else if (fromChainID === 12 || fromChainID === 512) {
        this.zkspceTransfer(fromChainID, toChainID, selectMakerInfo)
      } else {
        const tokenAddress =
          selectMakerInfo.c1ID === fromChainID
            ? selectMakerInfo.t1Address
            : selectMakerInfo.t2Address

        const to = selectMakerInfo.makerAddress
        const rAmount = new BigNumber(
          this.$store.state.transferData.transferValue
        )
          .plus(new BigNumber(selectMakerInfo.tradingFee))
          .multipliedBy(new BigNumber(10 ** selectMakerInfo.precision))
        const rAmountValue = rAmount.toFixed()
        const p_text = 9000 + Number(toChainID) + ''
        const tValue = orbiterCore.getTAmountFromRAmount(
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
          return
        }
        const account = compatibleGlobalWalletConf.value.walletPayload.walletAddress;
        if (fromChainID == 4 || fromChainID == 44) {
          this.starknetTransfer(
            account,
            selectMakerInfo,
            tValue.tAmount,
            fromChainID
          )
          return
        }

        if (fromChainID == 8 || fromChainID == 88) {
          this.imxTransfer(
            account,
            selectMakerInfo,
            tValue.tAmount,
            fromChainID
          )
          return
        }

        if (fromChainID == 11 || fromChainID == 511) {
          this.dydxTransfer(
            account,
            selectMakerInfo,
            tValue.tAmount,
            fromChainID
          )
          return
        }

        // Cross address transfer
        if (transferExt) {
          this.transferCrossAddress(
            account,
            selectMakerInfo,
            tValue.tAmount,
            fromChainID
          )

          return
        }

        if (util.isEthTokenAddress(tokenAddress)) {
          // When tokenAddress is eth
          this.ethTransfer(
            account,
            selectMakerInfo,
            tValue.tAmount,
            fromChainID
          )
        } else {
          // When tokenAddress is erc20
          const transferContract = getTransferContract(
            fromChainID,
            selectMakerInfo
          )
          if (!transferContract) {
            this.$notify.error({
              title: `Failed to obtain contract information, please refresh and try again`,
              duration: 3000,
            })
            return
          }

          let gasLimit = await getTransferGasLimit(
            fromChainID,
            selectMakerInfo,
            account,
            to,
            tValue.tAmount
          )
          if (gasLimit < 21000) {
            gasLimit = 21000
          }
          const objOption = { from: account, gas: gasLimit }
          transferContract.methods
            .transfer(to, tValue.tAmount)
            .send(objOption, (error, transactionHash) => {
              this.transferLoading = false
              if (!error) {
                this.onTransferSucceed(
                  account,
                  selectMakerInfo,
                  tValue.tAmount,
                  fromChainID,
                  transactionHash
                )
              } else {
                this.$notify.error({
                  title: error.message,
                  duration: 3000,
                })
              }
            })
        }
      }
    },
    onTransferSucceed(
      from,
      selectMakerInfo,
      amount,
      fromChainID,
      transactionHash
    ) {
      getProceeding.UserTransferReady(
        from,
        selectMakerInfo.makerAddress,
        amount,
        fromChainID,
        selectMakerInfo,
        transactionHash
      )

      // Immutablex's identifier is not a hash
      let title = transactionHash
      if (fromChainID == 8 || fromChainID == 88) {
        title = 'TransferId: ' + title
      }

      this.$notify.success({
        title,
        duration: 3000,
      })
      this.$emit('stateChanged', '3')
    },
    closerButton() {
      this.$emit('stateChanged', '1')
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  .confirm-box {
    width: 480px;
    height: 540px;
    .confirm-item {
      margin: 22px 0;
    }
  }
  .select-wallet-dialog {
    width:420px;
  }
}
.app-mobile {
  .confirm-box {
    width: 100%;
    // height: calc(100% - );
    padding: 0 20px;
    .confirm-item {
      margin: 12px 0;
    }
  }
  .select-wallet-dialog {
    width: 100%;
  }
}
.confirm-box {
  border-radius: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  .confirm-item {
    overflow: hidden;
    padding: 0 30px;
    .item-left {
      float: left;
      display: flex;
      align-items: center;
      .left-txt {
        margin: 0 10px 0 8px;
      }
    }
    .item-right {
      float: right;
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
      text-align: right;
      .textBold {
        font-weight: 600
      }
    }

    .descBottom {
      max-height: 9.2rem;
      // overflow-y: scroll;
      text-align: center;
      clear: both;
      padding-top: 20px;
    }
  }
  .select-wallet-dialog {
    margin-top:20px;
    height:50px;
    line-height:34px;
  }
}
</style>
