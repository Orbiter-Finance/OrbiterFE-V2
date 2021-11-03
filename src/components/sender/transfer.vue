<template>
  <o-box-content class="senderbody"
                 style="width:34.5rem">
    <div class="header">
      <span class="left">Token</span>
      <button @click="selectToken"
              class="right">
        <img class="token_icon"
             v-if="this.$store.state.transferData.selectTokenInfo.token === 'USDC'"
             src="../../assets/usdclogo.png"
             alt="">
        <svg-icon v-else
                  class="token_icon"
                  iconName="tokenLogo"></svg-icon>
        <div class="token_name">{{ this.$store.state.transferData.selectTokenInfo.token }}</div>
        <svg-icon class="arrow_icon"
                  iconName="arrow_down"></svg-icon>
      </button>
    </div>
    <div class="content">
      <div class="subContent">
        <div class="topItem">
          <div class="left">From</div>
          <div v-if="isLogin"
               class="right">Balance:
            <loading v-if="fromBalanceLoading"
                     style="left:0.3rem;;top:0.2rem"
                     width="1.2rem"
                     height="1.2rem"></loading>
            <span v-else>{{ fromBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="left"
               @click="changeFromChain">
            <span> {{ showChainName(this.$store.state.transferData.fromChainID, this.$env.localChainID_netChainID[this.$store.state.transferData.fromChainID])}} </span>
            <svg-icon style="margin-left:0.5rem;margin-top:0.5rem;width:2rem;height:2rem"
                      iconName="arrow_down"></svg-icon>
          </div>
          <input type="text"
                 v-model="transferValue"
                 class="right"
                 @input="checkTransferValue()"
                 :placeholder="`${this.userMinPrice}~${this.userMaxPrice}`">
        </div>
      </div>
      <div class="subContent">
        <div class="topItem">
          <div class="left">To</div>
          <div v-if="isLogin"
               class="right">Balance:
            <loading v-if="toBalanceLoading"
                     style="left:0.3rem;top:0.2rem"
                     width="1.2rem"
                     height="1.2rem"></loading>
            <span v-else>{{ toBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="left"
               @click="changeToChain">{{ showChainName(this.$store.state.transferData.toChainID,this.$env.localChainID_netChainID[this.$store.state.transferData.toChainID])}}
            <svg-icon style="margin-left:0.5rem;margin-top:0.5rem;width:2rem;height:2rem"
                      iconName="arrow_down"></svg-icon>
          </div>
          <div style="display:flex;align-items:center;"
               class="right">
            <o-tooltip placement="left">
              <template v-slot:titleDesc>
                <span v-html="toValueToolTip"></span>
              </template>
              <svg-icon style="width:1.5rem;height:1.5rem;margin-left:0.5rem;margin-bottom: 0.1rem"
                        iconName="help"></svg-icon>
            </o-tooltip>
            <div>{{toValue}}</div>

          </div>
        </div>

        <div class="middleImge"
             @click="transfer_mid">
          <img src="../../assets/middleIcon.png"
               style="width:100%;height:100%"
               alt="">
          <!-- <svg-icon style="width:100%;height:100%"
                    iconName="transfer_mid"></svg-icon> -->
        </div>
      </div>
    </div>
    <o-button style="margin: 2.5rem auto 0;"
              width='29.5rem'
              height='4rem'
              @click="sendTransfer">
      <span class="w700 s16"
            style="letter-spacing:0.15rem">{{this.isLogin ? 'SEND' : 'Connect a Wallet'}}</span>
    </o-button>
    <div class="notice">
      <div class="item"
           style="margin-top:1rem">
        <div class="left">
          <svg-icon style="width:1.6rem;height:1.6rem;margin-right:0.8rem;margin-left:0.2rem"
                    iconName='time_spent'></svg-icon>
          Time Spend
        </div>
        <div class="right">
          <loading v-if="timeSpenLoading"
                   width="1.2rem"
                   height="1.2rem"></loading>
          <span v-else>{{timeSpent}}</span>
          <div class="item"> save
            <loading v-if="saveTimeLoading"
                     style="margin:0 1rem"
                     width="1rem"
                     height="1rem"></loading>
            <span style="margin-left:0.4rem"
                  v-else>{{ transferSavingTime }}</span>
          </div>
          <o-tooltip placement="left">
            <template v-slot:titleDesc>
              <span v-html="timeSpenToolTip"></span>
            </template>
            <svg-icon style="width:1.5rem;height:1.5rem;margin-left:0.5rem;margin-bottom: 0.1rem"
                      iconName="help"></svg-icon>
          </o-tooltip>
        </div>
      </div>
      <div class="item"
           style="margin-top:1rem">
        <div class="left">
          <svg-icon style="width:1.5rem;height:1.5rem;left:1.5rem;margin-right:0.8rem;margin-left:0.3rem"
                    iconName='gas_cost'></svg-icon>
          Gas Fee
        </div>
        <div class="right">
          <loading v-if="gasCostLoading"
                   width="1.2rem"
                   height="1.2rem"></loading>
          <span v-else>{{gasCost}}</span>
          <div class="item">save
            <loading v-if="saveGasLoading"
                     style="margin:0 1rem"
                     width="1rem"
                     height="1rem"></loading>
            <span v-else>&nbsp;{{ gasSaving }}</span>
          </div>
          <o-tooltip placement="left">
            <template v-slot:titleDesc>
              <span v-html="gasFeeToolTip"></span>
            </template>
            <svg-icon style="width:1.5rem;height:1.5rem;margin-left:0.5rem;margin-bottom: 0.1rem"
                      iconName="help"></svg-icon>
          </o-tooltip>
        </div>

      </div>
    </div>
    <CustomPopup ref="SelectTokenPopupRef">
      <div slot="PoperContent"
           style="padding-bottom:var(--bottom-nav-height)">
        <SelectToken :tokenData="tokenInfoArray"
                     v-on:getTokenInfo="getTokenInfo"
                     v-on:closeSelect="closeSelectPopupClick()" />
      </div>
    </CustomPopup>
    <CustomPopup ref="SelectFromChainPopupRef">
      <div slot="PoperContent"
           style="padding-bottom:var(--bottom-nav-height)">
        <SelectChain :ChainData="fromChainArray"
                     v-on:getChainInfo="getFromChainInfo"
                     v-on:closeSelect="closeFromChainPopupClick()" />
      </div>
    </CustomPopup>
    <CustomPopup ref="SelectToChainPopupRef">
      <div slot="PoperContent"
           style="padding-bottom:var(--bottom-nav-height)">
        <SelectChain :ChainData="toChainArray"
                     v-on:getChainInfo="getToChainInfo"
                     v-on:closeSelect="closeToChainPopupClick()" />
      </div>
    </CustomPopup>
  </o-box-content>

</template>

<script>
import SelectToken from '../popup/selectToken/selectToken.vue'
import SelectChain from '../popup/selectChain/selectChain.vue'
import CustomPopup from '../popup/bottomPop'
import Loading from '../loading/loading.vue'
import makerInfo from '../../core/routes/makerInfo'
import util from '../../util/util'
import check from '../../util/check/check'
import transferCalculate from '../../util/transfer/transferCalculate'
import Middle from '../../util/middle/middle'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'


export default {
  name: 'Transfer',
  props: {
  },
  components: {
    SelectToken,
    SelectChain,
    CustomPopup,
    Loading
  },
  data() {
    return {
      // loading
      timeSpenLoading: false,
      gasCostLoading: false,
      originGasLoading: false,

      saveTimeLoading: false,

      c1Balance: 0,
      c2Balance: 0,
      originGasCost: 0,

      makerInfoList: '',
      fromChainArray: [],
      toChainArray: [],
      tokenInfoArray: [],

      transferValue: '',
    }
  },
  asyncComputed: {

  },
  computed: {
    userMaxPrice() {
      return this.$store.state.transferData.selectMakerInfo.maxPrice + this.$store.state.transferData.selectMakerInfo.tradingFee
    },
    userMinPrice() {
      return this.$store.state.transferData.selectMakerInfo.minPrice + this.$store.state.transferData.selectMakerInfo.tradingFee
    },
    realTransferValue() {
      return transferCalculate.realTransferOPID()
    },
    realPtext() {
      let ptextResult = orbiterCore.getPTextFromTAmount(this.$store.state.transferData.fromChainID, this.realTransferValue)
      if (ptextResult.state) {
        return ptextResult.pText
      } else {
        return '0'
      }
    },
    toValueToolTip() {
      return `<b>Security Code: ${this.realTransferValue}</b><br />Withholding Gas Fee: ${this.$store.state.transferData.selectMakerInfo ? this.$store.state.transferData.selectMakerInfo.tradingFee : 0}${this.$store.state.transferData.selectMakerInfo.tName}<br />Trading Fee: ${this.$store.state.transferData.selectMakerInfo ? this.$store.state.transferData.selectMakerInfo.gasFee / 10 : 0}%`
    },
    timeSpenToolTip() {
      return `It will take about ${this.originTimeSpent ? this.originTimeSpent.replace('~', '') : this.originTimeSpent} by traditional way, but only take about ${this.timeSpent ? this.timeSpent.replace('~', '') : this.timeSpent} with Orbiter.`
    },
    gasFeeToolTip() {
      return `It will take about ${(this.$store.state.transferData.ethPrice * this.originGasCost).toFixed(1).toString()}USD by traditional way, but only take about ${this.gasCost.toString().replace(/[^\d.]/gi, '')}USD with Orbiter.`
    },
    isLogin() {
      return this.$store.state.web3.isInstallMeta && this.$store.state.web3.isInjected && this.$store.state.web3.localLogin;
    },
    toValue() {
      if (this.transferValue === '' || this.$store.state.transferData.selectMakerInfo === '') {
        return '0'
      }
      return orbiterCore.getToAmountFromUserAmount(new BigNumber(this.transferValue), this.$store.state.transferData.selectMakerInfo, false)
    },
    fromBalanceLoading() {
      if (this.fromBalance === null) {
        return true
      }
      return false
    },
    toBalanceLoading() {
      if (this.toBalance === null) {
        return true
      }
      return false
    },
    fromBalance() {
      if (this.$store.state.transferData.selectMakerInfo.c1ID === this.$store.state.transferData.fromChainID) {
        return this.c1Balance
      } else {
        return this.c2Balance
      }
    },
    toBalance() {
      if (this.$store.state.transferData.selectMakerInfo.c1ID === this.$store.state.transferData.fromChainID) {
        return this.c2Balance
      } else {
        return this.c1Balance
      }
    },
    gasCost() {
      if (this.$store.state.transferData.fromChainID === 3 || this.$store.state.transferData.fromChainID === 33) {
        if (this.$store.state.transferData.selectTokenInfo.token !== 'ETH') {
          return '~' + (Math.ceil(Number(this.$store.state.transferData.gasFee * 10)) / 10).toFixed(1) + 'USD'
        }
      }
      return '~' + (Math.ceil((this.$store.state.transferData.gasFee * this.$store.state.transferData.ethPrice * 10)) / 10).toFixed(1) + 'USD'
    },
    timeSpent() {
      return transferCalculate.transferSpentTime(this.$store.state.transferData.fromChainID, this.$store.state.transferData.toChainID)
    },
    originTimeSpent() {
      return transferCalculate.transferOrginTime(this.$store.state.transferData.fromChainID, this.$store.state.transferData.toChainID)
    },
    gasSaving() {
      let savingValue = this.$store.state.transferData.ethPrice * this.originGasCost - this.gasCost.toString().replace(/[^\d.]/gi, '')
      if (savingValue < 0) {
        savingValue = 0
      }
      let savingTokenName = 'USD'
      return savingValue.toFixed(1).toString() + savingTokenName
    },
    saveGasLoading() {
      return this.gasCostLoading && this.originGasLoading
    },
    transferSavingTime() {
      return transferCalculate.transferSavingTime(this.$store.state.transferData.fromChainID, this.$store.state.transferData.toChainID)
    },
  },
  watch: {
    makerInfoList: function (newValue, oldValue) {
      if (oldValue === '' && newValue !== '') {
        this.makerInfoList.filter(makerInfo => {
          if (this.fromChainArray.indexOf(makerInfo.c1ID) === -1) {
            this.fromChainArray.push(makerInfo.c1ID)
          }
          if (this.fromChainArray.indexOf(makerInfo.c2ID) === -1) {
            this.fromChainArray.push(makerInfo.c2ID)
          }
        })
        this.$store.commit('updateTransferFromChainID', this.fromChainArray[0])
      }
    },
    '$store.state.web3.coinbase': function (newValue, oldValue) {
      if (!newValue || newValue === '0x') {
        this.c1Balance = 0;
        this.c2Balance = 0;
      }
      if (oldValue !== newValue && newValue !== '0x') {
        this.c1Balance = null;
        this.c2Balance = null;
        transferCalculate.getTransferBalance(this.$store.state.transferData.selectMakerInfo.c1ID, this.$store.state.transferData.selectMakerInfo.t1Address, this.$store.state.transferData.selectMakerInfo.tName, this.$store.state.web3.coinbase).then((response) => {
          this.c1Balance = (response / (10 ** this.$store.state.transferData.selectMakerInfo.precision)).toFixed(6)
        }).catch((error) => {
          console.log(error)
          // this.$notify.error({
          //   title: `GetBalanceError`,
          //   desc: error,
          //   duration: 3000
          // })
          return
        })
        transferCalculate.getTransferBalance(this.$store.state.transferData.selectMakerInfo.c2ID, this.$store.state.transferData.selectMakerInfo.t2Address, this.$store.state.transferData.selectMakerInfo.tName, this.$store.state.web3.coinbase).then((response) => {
          this.c2Balance = (response / (10 ** this.$store.state.transferData.selectMakerInfo.precision)).toFixed(6)
        }).catch((error) => {
          console.log(error)

          // this.$notify.error({
          //   title: `GetBalanceError`,
          //   desc: error,
          //   duration: 3000
          // })
        })
      } else {
        this.c1Balance = 0;
        this.c2Balance = 0;
      }
    },
    '$store.state.transferData.selectMakerInfo': function (newValue, oldValue) {
      if (this.isLogin && oldValue !== newValue) {
        this.c1Balance = null;
        this.c2Balance = null;
        transferCalculate.getTransferBalance(newValue.c1ID, newValue.t1Address, this.$store.state.transferData.selectMakerInfo.tName, this.$store.state.web3.coinbase).then((response) => {
          this.c1Balance = (response / (10 ** this.$store.state.transferData.selectMakerInfo.precision)).toFixed(6)
        }).catch((error) => {
          console.log(error)
          // this.$notify.error({
          //   title: `GetBalanceError`,
          //   desc: error,
          //   duration: 3000
          // })
        })
        transferCalculate.getTransferBalance(newValue.c2ID, newValue.t2Address, this.$store.state.transferData.selectMakerInfo.tName, this.$store.state.web3.coinbase).then((response) => {
          this.c2Balance = (response / (10 ** this.$store.state.transferData.selectMakerInfo.precision)).toFixed(6)
        }).catch((error) => {
          console.log(error)
          // this.$notify.error({
          //   title: `GetBalanceError`,
          //   desc: error,
          //   duration: 3000
          // })
        })
      }
    },
    '$store.state.transferData.fromChainID': function (newValue) {
      this.toChainArray = []
      this.makerInfoList.filter(makerInfo => {
        if (makerInfo.c1ID === newValue && this.toChainArray.indexOf(makerInfo.c2ID) === -1) {
          this.toChainArray.push(makerInfo.c2ID)
        }
        if (makerInfo.c2ID === newValue && this.toChainArray.indexOf(makerInfo.c1ID) === -1) {
          this.toChainArray.push(makerInfo.c1ID)
        }
      })
      if (this.toChainArray.indexOf(this.$store.state.transferData.toChainID) === -1) {
        this.$store.commit('updateTransferToChainID', this.toChainArray[0])
      } else {
        this.tokenInfoArray = [];
        this.makerInfoList.filter(makerInfo => {
          if (makerInfo.c1ID === this.$store.state.transferData.fromChainID && makerInfo.c2ID === this.$store.state.transferData.toChainID) {
            let isMatch = false
            this.tokenInfoArray.filter(tokenInfo => {
              if (tokenInfo.token === makerInfo.tName) {
                isMatch = true
              }
            })
            if (!isMatch) {
              this.tokenInfoArray.push({
                icon: 'usdc',
                token: makerInfo.tName,
                amount: 0,
              })
            }
          }
          if (makerInfo.c2ID === this.$store.state.transferData.fromChainID && makerInfo.c1ID === this.$store.state.transferData.toChainID) {
            let isMatch = false
            this.tokenInfoArray.filter(tokenInfo => {
              if (tokenInfo.token === makerInfo.tName) {
                isMatch = true
              }
            })
            if (!isMatch) {
              this.tokenInfoArray.push({
                icon: 'usdc',
                token: makerInfo.tName,
                amount: 0,
              })
            }
          }
        })
        if (this.tokenInfoArray.indexOf(this.$store.state.transferData.selectTokenInfo.token) === -1) {
          this.$store.commit('updateTransferTokenInfo', this.tokenInfoArray[0])
        } else {
          this.makerInfoList.filter(makerInfo => {
            if ((makerInfo.c1ID === this.$store.state.transferData.fromChainID && makerInfo.c2ID === this.$store.state.transferData.toChainID && makerInfo.tName === this.$store.state.transferData.selectTokenInfo.token) ||
              (makerInfo.c2ID === this.$store.state.transferData.fromChainID && makerInfo.c1ID === this.$store.state.transferData.toChainID && makerInfo.tName === this.$store.state.transferData.selectTokenInfo.token)) {
              this.$store.commit('updateTransferMakerInfo', makerInfo)
            }
          })
        }
        if (newValue) {
          let that = this
          this.gasCostLoading = true
          this.originGasLoading = true
          transferCalculate.transferOrginGas(this.$store.state.transferData.fromChainID, this.$store.state.transferData.toChainID).then((response) => {
            that.originGasCost = response
            that.originGasLoading = false
          }).catch((error) => {
            that.originGasLoading = false
            console.log(error)
          })
        }
      }
      if (newValue) {
        let that = this
        this.gasCostLoading = true
        transferCalculate.transferSpentGas(this.$store.state.transferData.fromChainID).then((response) => {
          this.$store.commit('updateTransferGasFee', response)
          that.gasCostLoading = false
        }).catch((error) => {
          that.gasCostLoading = false
          console.log('GetGasFeeError =', error)
        })
      }
    },
    '$store.state.transferData.toChainID': function (newValue) {
      this.tokenInfoArray = [];
      this.makerInfoList.filter(makerInfo => {
        if (makerInfo.c1ID === this.$store.state.transferData.fromChainID && makerInfo.c2ID === this.$store.state.transferData.toChainID) {
          let isMatch = false
          this.tokenInfoArray.filter(tokenInfo => {
            if (tokenInfo.token === makerInfo.tName) {
              isMatch = true
            }
          })
          if (!isMatch) {
            this.tokenInfoArray.push({
              icon: 'usdc',
              token: makerInfo.tName,
              amount: 0,
            })
          }
        }
        if (makerInfo.c2ID === this.$store.state.transferData.fromChainID && makerInfo.c1ID === this.$store.state.transferData.toChainID) {
          let isMatch = false
          this.tokenInfoArray.filter(tokenInfo => {
            if (tokenInfo.token === makerInfo.tName) {
              isMatch = true
            }
          })
          if (!isMatch) {
            this.tokenInfoArray.push({
              icon: 'usdc',
              token: makerInfo.tName,
              amount: 0,
            })
          }
        }
      })
      if (this.tokenInfoArray.indexOf(this.$store.state.transferData.selectTokenInfo.token) === -1) {
        this.$store.commit('updateTransferTokenInfo', this.tokenInfoArray[0])
      } else {
        if ((makerInfo.c1ID === this.$store.state.transferData.fromChainID && makerInfo.c2ID === this.$store.state.transferData.toChainID && makerInfo.tName === this.$store.state.transferData.selectTokenInfo.token) ||
          (makerInfo.c2ID === this.$store.state.transferData.fromChainID && makerInfo.c1ID === this.$store.state.transferData.toChainID && makerInfo.tName === this.$store.state.transferData.selectTokenInfo.token)) {
          this.$store.commit('updateTransferMakerInfo', makerInfo)
        }
      }
      if (newValue) {
        var that = this
        this.originGasLoading = true
        transferCalculate.transferOrginGas(this.$store.state.transferData.fromChainID, this.$store.state.transferData.toChainID).then((response) => {
          that.originGasCost = response
          that.originGasLoading = false
        }).catch((error) => {
          that.originGasLoading = false
          that.$notify.error({
            title: `GetOrginGasFeeError`,
            desc: error,
            duration: 3000
          })
        })
      }
    },
    '$store.state.transferData.selectTokenInfo': function (newValue) {
      this.makerInfoList.filter(makerInfo => {
        if ((makerInfo.c1ID === this.$store.state.transferData.fromChainID && makerInfo.c2ID === this.$store.state.transferData.toChainID && makerInfo.tName === newValue.token) ||
          (makerInfo.c2ID === this.$store.state.transferData.fromChainID && makerInfo.c1ID === this.$store.state.transferData.toChainID && makerInfo.tName === newValue.token)) {
          this.$store.commit('updateTransferMakerInfo', makerInfo)
        }
      })
    },
    transferValue: function (newValue) {
      if (this.$store.state.transferData.transferValue !== newValue) {
        this.$store.commit('updateTransferValue', newValue)
      }
    }
  },
  mounted() {
    var that = this
    transferCalculate.getTokenPrice('ETH').then((response) => {
      that.$store.commit('updateETHPrice', response)
    }).catch((error) => {
      console.log('GetETHPriceError =', error)
    })
    setInterval(() => {
      let selectMakerInfo = that.$store.state.transferData.selectMakerInfo
      if (selectMakerInfo && that.isLogin) {
        transferCalculate.getTransferBalance(selectMakerInfo.c1ID, selectMakerInfo.t1Address, this.$store.state.transferData.selectMakerInfo.tName, that.$store.state.web3.coinbase).then((response) => {
          that.c1Balance = (response / (10 ** that.$store.state.transferData.selectMakerInfo.precision)).toFixed(6)
        }).catch((error) => {
          console.log(error)
          // that.$notify.error({
          //   title: `GetBalanceError`,
          //   desc: error,
          //   duration: 3000
          // })
        })
        transferCalculate.getTransferBalance(selectMakerInfo.c2ID, selectMakerInfo.t2Address, this.$store.state.transferData.selectMakerInfo.tName, that.$store.state.web3.coinbase).then((response) => {
          that.c2Balance = (response / (10 ** that.$store.state.transferData.selectMakerInfo.precision)).toFixed(6)
        }).catch((error) => {
          console.log(error)
          // that.$notify.error({
          //   title: `GetBalanceError`,
          //   desc: error,
          //   duration: 3000
          // })
        })
      }
      transferCalculate.getTokenPrice('ETH').then((response) => {
        that.$store.commit('updateETHPrice', response)
      }).catch((error) => {
        console.log('GetETHPriceError =', error)
      })
    }, 10 * 1000);
    var getMakerInfoFromGraphReq = {
      maker: '0',
    }
    makerInfo
      .getMakerInfoFromGraph(getMakerInfoFromGraphReq, true)
      .then((response) => {
        if (response.code === 0) {
          that.makerInfoList = response.data
        }
      })
      .catch((error) => {
        console.log('error =', error)
      })
  },
  methods: {
    showChainName(localChainID, netChainID) {
      return util.chainName(localChainID, netChainID)
    },
    transfer_mid() {
      var fromChainID = this.$store.state.transferData.fromChainID
      var toChainID = this.$store.state.transferData.toChainID
      var tokenInfo = this.$store.state.transferData.selectTokenInfo
      this.$store.commit('updateTransferFromChainID', toChainID)
      this.$store.commit('updateTransferToChainID', fromChainID)
      this.$store.commit('updateTransferTokenInfo', tokenInfo)
    },
    selectToken() {
      this.showCustomPopupClick()
    },
    getTokenInfo(e) {
      this.$store.commit('updateTransferTokenInfo', e)
    },
    // open pop
    showCustomPopupClick() {
      this.$refs.SelectTokenPopupRef.showCustom();
    },
    // close pop
    closeSelectPopupClick() {
      this.$refs.SelectTokenPopupRef.maskClick();
    },
    changeFromChain() {
      this.showFromChainPopupClick()
    },
    getFromChainInfo(e) {
      this.$store.commit('updateTransferFromChainID', e.localID)
    },
    // open selectChain
    showFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.showCustom();
    },
    // close selectChain
    closeFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.maskClick();
    },
    changeToChain() {
      this.showToChainPopupClick()
    },
    getToChainInfo(e) {
      this.$store.commit('updateTransferToChainID', e.localID)
    },
    // open selectChain
    showToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.showCustom();
    },
    // close selectChain
    closeToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.maskClick();
    },
    checkTransferValue() {
      this.transferValue = (this.$store.state.transferData.selectMakerInfo.precision === 18
        ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,5})?).*$/g, '$1')
        : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1'))
    },
    async sendTransfer() {
      // if unlogin  login first
      if (!this.isLogin) {
        Middle.$emit('connectWallet', true)
      } else {
        if (!check.checkPrice(this.transferValue)) {
          this.$notify.error({
            title: `The format of input amount is incorrect`,
            duration: 3000
          })
          return
        }
        if (this.fromBalance === null) {
          this.$notify.error({
            title: `Waiting for account balance to be obtained`,
            duration: 3000
          })
          return
        }
        if (Number(this.transferValue) >= this.fromBalance) {
          this.$notify.error({
            title: `amount must be less than ${this.fromBalance} `,
            duration: 3000
          })
          return
        }
        if (Number(this.transferValue) > Number(this.userMaxPrice) || Number(this.transferValue) < Number(this.userMinPrice)) {
          this.$notify.error({
            title: `amount must between ${this.userMinPrice} and ${this.userMaxPrice}`,
            duration: 3000
          })
          return
        }
        if (this.$store.state.web3.networkId.toString() !== this.$env.localChainID_netChainID[this.$store.state.transferData.fromChainID]) {
          // add & swith chain
          this.addChainNetWork()
        } else {
          // sendTransfer
          this.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: this.transferValue,
              coin: this.$store.state.transferData.selectTokenInfo.token,
              toAddress: util.shortAddress(this.$store.state.transferData.selectMakerInfo.makerAddress),
            }
          ])
          this.$emit("stateChanged", "2");
        }
      }
    },
    addChainNetWork() {
      var that = this
      var chain = util.getChainInfo(this.$env.localChainID_netChainID[this.$store.state.transferData.fromChainID])
      const switchParams = {
        chainId: util.toHex(chain.chainId),
      }
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [switchParams],
      })
        .then(() => {
          // switch success
          that.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: that.transferValue,
              coin: that.$store.state.transferData.selectTokenInfo.token,
              toAddress: util.shortAddress(that.$store.state.transferData.selectMakerInfo.makerAddress),
            }
          ])
          that.$emit("stateChanged", "2");
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
              blockExplorerUrls: [((chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url) ? chain.explorers[0].url : chain.infoURL)]
            }
            window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [params, that.$store.state.web3.coinbase],
            })
              .then(() => {
              })
              .catch((error) => {
                console.log(error)
                util.showMessage(error.message, 'error')
              });
          } else {
            util.showMessage(error.message, 'error')
          }
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.senderbody {
  margin: 4.2rem auto;
  color: var(--default-black);
  max-height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  max-height: calc(
    var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  text-align: left;
  font-size: 2rem;
  overflow-y: scroll;
  .header {
    display: flex;
    align-items: center;
    .left {
      margin: 1.85rem 0 0 2.5rem;
      font-weight: 900;
    }
    .right {
      margin: 2rem 1.5rem 0 auto;
      padding: 0;
      display: flex;
      width: 13rem;
      height: 3.6rem;
      background-color: #fff;
      border-width: 0.15rem 0.15rem 0.25rem 0.15rem;
      border-color: black;
      border-style: solid;
      border-radius: 2rem;
      .token_icon {
        margin: 0.5rem 0 0.5rem 1rem;
        width: 2.2rem;
        height: 2.2rem;
      }
      .token_name {
        margin-left: 1rem;
        font-size: 1.8rem;
        line-height: 3.6rem;
        font-weight: 500;
        height: 100%;
      }
      .arrow_icon {
        width: 2rem;
        height: 2rem;
        margin: 0.8rem 1rem auto auto;
      }
    }
  }
  .content {
    margin: 2.1rem auto 0;
    width: 29.5rem;
    text-align: center;
    .subContent {
      position: relative;
      height: 5.7rem;
      border: 0.15rem solid var(--default-black);
      border-radius: 2rem;
      text-align: left;
      font-weight: 400;
      font-size: 1.2rem;
      .topItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0.6rem 2.4rem 0 2rem;
        color: #616266;
        .right {
          display: flex;
          text-align: right;
        }
      }
      .bottomItem {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: -0.2rem 2.4rem 1.3rem 2rem;
        font-size: 1.6rem;
        font-weight: 550;
        height: 2.9rem;
        .left {
          color: #2c2d32;
          display: flex;
          line-height: 2.9rem;
        }
        .right {
          width: 100%;
          color: var(--primary-color);
          text-align: right;
          border: 0;
          outline: 0px;
          appearance: none;
          background-color: transparent;
          transition: all 0.2s ease 0s;
          flex-direction: row-reverse;
        }
        input {
          font-weight: 600;
        }
        input::placeholder {
          color: #adadb0;
          font-size: 1.4rem;
          font-weight: 400;
        }
      }
    }
    .subContent:last-child {
      margin-top: 1.8rem;
      .middleImge {
        position: absolute;
        width: 3.8rem;
        height: 3.8rem;
        top: -2.9rem;
        left: calc(50% - 1.7rem);
        z-index: 1;
      }
    }
  }
  .notice {
    margin: 3rem auto 3rem;
    width: 27rem;
    .item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 1.2rem;
      color: #78797d;
      text-align: left;
      .left {
        display: flex;
        // line-height: 100%;
      }
      .right {
        display: flex;
        text-align: right;
        align-items: center;
        .item {
          height: 1.5rem;
          padding: 0.1rem 0.2rem;
          background-color: #ffeddd;
          color: #ff9c64;
          font-size: 1rem;
          line-height: 1rem;
          text-align: left;
          border: 0.1rem solid #4e5055;
          border-radius: 0.3rem;
          margin-left: 0.7rem;
        }
      }
    }
  }
}
</style>
