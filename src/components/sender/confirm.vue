<template>
  <o-box-content class="confirmbody" style="width: 34.5rem">
    <div class="confirmContent">
      <div class="topItem">
        <div @click="closerButton">
          <svg-icon
            style="
              width: 1.5rem;
              height: 1.5rem;
              margin-bottom: 0.2rem;
              position: absolute;
              left: 1rem;
            "
            iconName="back"
          ></svg-icon>
        </div>
        Confirm
      </div>
      <div
        style="width: 100%; height: 0.2rem; background: var(--default-black)"
      ></div>
      <div v-for="item in confirmData" :key="item.title" class="contentItem">
        <div class="up">
          <svg-icon
            style="margin-right: 1.4rem; width: 1.5rem; height: 1.5rem"
            :iconName="item.icon"
          ></svg-icon>
          <span style="margin-right: 1rem; font-weight: 600">{{
            item.title
          }}</span>
          <o-tooltip placement="topLeft">
            <template v-slot:titleDesc>
              <span>{{ item.notice }}</span>
            </template>
            <svg-icon
              v-if="item.notice"
              style="width: 1.5rem; height: 1.5rem"
              iconName="help"
            ></svg-icon>
          </o-tooltip>
          <span v-if="!item.textBold && item.desc" class="right">{{
            item.desc
          }}</span>
          <span
            v-else-if="item.textBold && item.desc"
            class="right"
            style="font-weight: 600"
            >{{ item.desc }}</span
          >
        </div>
        <div
          v-if="item.descInfo && item.descInfo.length > 0"
          class="descBottom"
        >
          <div
            v-for="desc in item.descInfo"
            :key="desc.no"
            style="margin-bottom: 1rem"
          >
            Send
            <span
              class="dColor"
              style="margin-left: 0.7rem; margin-right: 1.1rem"
            >
              {{ desc.amount }}{{ desc.coin }}
            </span>
            To
            <span class="dColor" style="margin-left: 0.7rem">
              {{ desc.toAddress }}
            </span>
          </div>
        </div>
        <div v-if="item.haveSep" class="sep"></div>
      </div>
      <o-button
        style="margin-top: 2.5rem"
        width="29.5rem"
        height="4rem"
        @click="RealTransfer"
      >
        <span
          v-if="!transferLoading"
          class="wbold s16"
          style="letter-spacing: 0.1rem"
          >CONFIRM AND SEND</span
        >
        <loading
          v-else
          style="margin: auto"
          loadingColor="white"
          width="2rem"
          height="2rem"
        ></loading>
      </o-button>
    </div>
  </o-box-content>
</template>

<script>
import BigNumber from 'bignumber.js'
import getProceeding from '../../util/proceeding/getProceeding'
import {
  getTransferContract,
  getSourceContract,
  sourceAddress,
} from '../../util/constants/contract/getContract.js'
import orbiterCore from '../../orbiterCore'
import Loading from '../loading/loading.vue'
import util from '../../util/util'
import Middle from '../../util/middle/middle'
import { ethers } from 'ethers'

export default {
  name: 'Confirm',
  props: {},
  components: {
    Loading,
  },
  data() {
    return {
      transferLoading: false,
      sourceAddress: { ...sourceAddress },
    }
  },
  asyncComputed: {},
  computed: {
    isLogin() {
      return (
        this.$store.state.web3.isInstallMeta &&
        this.$store.state.web3.isInjected &&
        this.$store.state.web3.localLogin
      )
    },
    confirmData() {
      // 0.000120000000009022 to 0.000120...09022
      let realTransferAmount = new BigNumber(
        this.$store.state.transferData.transferValue
      ).plus(new BigNumber(this.$store.getters.realSelectMakerInfo.tradingFee))
      // realTransferAmount = realTransferAmount.replace(
      //   /(.*?0)0{4,}(0.*?)/,
      //   '$1...$2'
      // )

      return [
        {
          icon: 'withholding_gas_cost',
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
          desc: '0',
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
          icon: 'receive',
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
          icon: 'router',
          title: 'Maker Routes',
          notice:
            "After a sender submits a transfer application, the asset is transferred to the Maker's address and the Maker will provide liquidity. Orbiter's staking agreement ensures the security of the asset.",
          descInfo: this.$store.state.confirmData.routeDescInfo,
        },
      ]
    },
  },
  watch: {},
  mounted() {},
  methods: {
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
       window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [switchParams],
        })
        .then(() => {
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
              toAddress: util.shortAddress(
                that.$store.getters.realSelectMakerInfo.makerAddress
              ),
            },
          ])
          this.RealTransfer()
        })
        .catch((error) => {
          console.log(error)
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
            window.ethereum
              .request({
                method: 'wallet_addEthereumChain',
                params: [params, that.$store.state.web3.coinbase],
              })
              .then(() => {})
              .catch((error) => {
                console.log(error)
                util.showMessage(error.message, 'error')
              })
          } else {
            util.showMessage(error.message, 'error')
          }
        })
    },
    async RealTransfer() {
      if (!this.isLogin) {
        Middle.$emit('connectWallet', true)
        return
      }

      if (
        this.$store.state.web3.networkId.toString() !==
        this.$env.localChainID_netChainID[
          this.$store.state.transferData.fromChainID
        ]
      ) {
        this.addChainNetWork()
        return
      }

      // Only one
      if (this.transferLoading) {
        return
      }
      // sendTransfer
      this.transferLoading = true
      var fromChainID = this.$store.state.transferData.fromChainID
      var selectMakerInfo = this.$store.getters.realSelectMakerInfo
      var amount = new BigNumber(
        this.$store.state.transferData.amount
      ).toFixed()
      var dest = this.$store.state.transferData.destAddress
        ? this.$store.state.transferData.destAddress
        : this.$store.state.web3.coinbase

      // When tokenAddress is erc20
      const transferContract = getTransferContract(fromChainID, selectMakerInfo)
      const sourceContract = getSourceContract(
        this.$store.state.transferData.fromChainID
      )
      if (!sourceContract) {
        this.$notify.error({
          title: `Failed to obtain contract information, please refresh and try again`,
          duration: 3000,
        })
        this.transferLoading = false
        return
      }
      if (!transferContract) {
        this.$notify.error({
          title: `Failed to obtain contract information, please refresh and try again`,
          duration: 3000,
        })
        this.transferLoading = false
        return
      }
      const account = this.$store.state.web3.coinbase
      const objOption = { from: account, gasLimit: 1000000 }
      console.warn('account =', account)
      console.warn('objOption =', objOption)
      console.warn('amount =', amount)
      console.warn(
        'source =',
        this.sourceAddress[this.$store.state.transferData.fromChainID]
      )

      const allowance = await transferContract.methods
        .allowance(
          account,
          this.sourceAddress[this.$store.state.transferData.fromChainID]
        )
        .call()
      console.warn('transferContract allowance: ', allowance)

      try {
        if (ethers.BigNumber.from(allowance).lt(amount)) {
          const approveTransactionHash = await transferContract.methods
            .approve(
              this.sourceAddress[this.$store.state.transferData.fromChainID],
              ethers.constants.MaxUint256
            )
            .send(objOption)
          console.warn('approveTransactionHash =', approveTransactionHash)
        }

        if (dest) {
          sourceContract.methods
            .transferWithDest(
              Number(this.$store.state.transferData.toChainID),
              dest,
              amount,
              0
            )
            .send(objOption, (error, transactionHash) => {
              this.transferLoading = false
              if (!error) {
                console.warn('dest_transactionHash =', transactionHash)
                this.onTransferSucceed(
                  account,
                  selectMakerInfo,
                  amount,
                  fromChainID,
                  transactionHash,
                  dest
                )
              } else {
                this.$notify.error({
                  title: error.message,
                  duration: 3000,
                })
              }
            })
        } else {
          sourceContract.methods
            .transfer(
              Number(this.$store.state.transferData.fromChainID),
              amount,
              0
            )
            .send(objOption, (error, transactionHash) => {
              this.transferLoading = false
              if (!error) {
                console.warn('transactionHash =', transactionHash)
                this.onTransferSucceed(
                  account,
                  selectMakerInfo,
                  amount,
                  fromChainID,
                  transactionHash,
                  dest
                )
              } else {
                this.$notify.error({
                  title: error.message,
                  duration: 3000,
                })
              }
            })
        }
      } catch (error) {
        this.transferLoading = false
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      }
    },
    onTransferSucceed(
      from,
      selectMakerInfo,
      amount,
      fromChainID,
      transactionHash,
      dest
    ) {
      getProceeding.UserTransferReady(
        from,
        selectMakerInfo.makerAddress,
        amount,
        fromChainID,
        selectMakerInfo,
        transactionHash,
        dest
      )
      this.$notify.success({
        title: transactionHash,
        duration: 3000,
      })
      this.$emit('stateChanged', '3')
    },
    closerButton() {
      this.$emit('stateChanged', '1')
    },
    gasCost() {
      if (
        this.$store.state.transferData.fromChainID === 3 ||
        this.$store.state.transferData.fromChainID === 33
      ) {
        if (this.$store.state.transferData.selectTokenInfo.token !== 'ETH') {
          return (
            Number(this.$store.state.transferData.gasFee).toFixed(4) + 'USD'
          )
        }
      }
      return (
        (
          this.$store.state.transferData.gasFee *
          this.$store.state.transferData.ethPrice
        ).toFixed(4) + 'USD'
      )
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.confirmbody {
  margin: 4.2rem auto;
  max-height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  max-height: calc(
    var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  overflow-y: scroll;
  .confirmContent {
    margin: 0.5rem 1rem 2rem;
    position: relative;
    .topItem {
      width: 100%;
      height: 2rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2rem;
      color: var(--default-black);
      text-align: center;
      padding: 0 1rem;
      margin-bottom: 1rem;
    }
    .contentItem {
      width: 100%;
      font-size: 1.4rem;
      line-height: 2rem;
      color: var(--default-black);
      margin: 2rem auto 0 auto;
      align-items: center;
      .up {
        padding: 0 0.5rem;
        align-items: center;
        display: flex;
        .right {
          color: rgba($color: #18191f, $alpha: 0.7);
          text-align: right;
          font-weight: 400;
          position: absolute;
          right: 0.5rem;
        }
      }
      .descBottom {
        max-height: 9.2rem;
        padding: 1rem 1.5rem 0 2.5rem;
        overflow-y: scroll;
        margin: 1rem 0.5rem 0;
        text-align: left;
      }
      .sep {
        box-sizing: border-box;
        background-color: #ffece6;
        height: 0.1rem;
        border-top: 0.1rem dashed rgba(24, 25, 31, 0.2);
        margin-top: 1.6rem;
      }
    }
  }
}
</style>
