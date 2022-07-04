<template>
  <div class="addLiquidityContent">
    <o-box-content class="addLiquidityBottom" style="width: 34.5rem">
      <div
        style="display: flex; justify-content: space-between; padding: 1.5rem"
      >
        <span class="wbolder" style="margin-left: 1.5rem">Add Liquidity</span>
        <div @click="closerButton">
          <svg-icon
            style="width: 2rem; height: 2rem"
            iconName="close"
          ></svg-icon>
        </div>
      </div>
      <div
        style="
          height: 0.2rem;
          background-color: var(--default-black);
          border-top: 0.2rem dashed var(--default-black);
        "
      ></div>
      <div class="header">
        <span class="left">To Chain</span>
        <button
          @click="selectToChain"
          class="right"
          style="padding-left: 5px; padding-right: 5px; width: auto"
        >
          <div class="token_name">
            {{
              showChainName(toChainId, $env.localChainID_netChainID[toChainId])
            }}
          </div>
          <svg-icon class="arrow_icon" iconName="arrow_down"></svg-icon>
        </button>
      </div>
      <div class="sep"></div>
      <div class="header">
        <span class="left">Token</span>
        <button @click="selectToken" class="right">
          <img
            class="token_icon"
            v-if="tokenInfo && tokenInfo.icon"
            :src="tokenInfo.icon"
            alt=""
          />
          <svg-icon v-else class="token_icon" iconName="tokenLogo"></svg-icon>
          <div class="token_name">{{ tokenInfo ? tokenInfo.token : '-' }}</div>
          <svg-icon class="arrow_icon" iconName="arrow_down"></svg-icon>
        </button>
      </div>
      <div class="sep"></div>
      <!-- <div class="netContent">
        <span class="s14 wbolder"
              style="margin-top:2rem">Select Network</span>
        <div class="s14 wbolder"
             style="margin-top:2rem;display:flex;justify-content:space-between">
          <span class="tleft"
                style="flex:1.5">Network</span>
          <span class="tleft"
                style="flex:1">Value</span>
          <span class="tcenter"
                style="flex:1">Fee</span>
        </div>
        <a-checkbox-group @change="onChange">
          <div v-for="item in liquidityData"
               class="checkContent"
               style="margin-top:1.9rem"
               :key="item.no">
            <a-checkbox :value="item.chainOne"
                        class="tleft"
                        style="flex:1.5">
              <span class="s14 nColor">{{item.chainOne}}</span>
            </a-checkbox>
            <div style="flex:1">
              <input type="text"
                     v-model="amount"
                     class="right dColor"
                     style="width:100%"
                     @input="checkAmount()"
                     :placeholder="`0`">
            </div>
            <div class="tright"
                 style="flex:1">456</div>
          </div>
        </a-checkbox-group>
      </div>
      <div class="sep"></div> -->
      <!-- <div class="batchContent">
        <div style="display:flex;align-items:center; margin-top:2rem">
          <span class="s14 wbolder">One Batch Value</span>
          <o-tooltip placement="bottom">
            <template v-slot:titleDesc>
              <span v-html="toolTipDesc1"></span>
            </template>
            <svg-icon style="margin-left:0.8rem;width:1.5rem;height:1.5rem"
                      iconName="help"></svg-icon>
          </o-tooltip>
          <div class="s14 dColor tright"
               style="margin:0 0.5rem 0 auto">1000000</div>
        </div>
        <div style="display:flex;align-items:center;margin-top:1.5rem">
          <span class="s14 wbolder">One Batch Limit</span>
          <o-tooltip placement="bottom">
            <template v-slot:titleDesc>
              <span v-html="toolTipDesc2"></span>
            </template>
            <svg-icon style="margin-left:0.8rem;width:1.5rem;height:1.5rem"
                      iconName="help"></svg-icon>
          </o-tooltip>
          <span class="s14 dColor tright"
                style="margin:0 0.5rem 0 auto">1000</span>
        </div>
      </div>
      <div class="sep"></div> -->
      <!-- <div class="timeContent">
        <div style="display:flex;align-items:center;">
          <span class="s14 wbolder">Start Time</span>
          <div class="s14 tright"
               style="margin:0 0.5rem 0 auto">
            <span class=" dColor "
                  style="margin:0 0.5rem 0 auto">0.05</span>
            <span>hour later</span>
          </div>
        </div>
      </div>
      <div class="sep"></div> -->
      <div class="moneyConfirmContent tcenter">
        <span class="s14 wbolder">Become a maker and send</span>
        <div class="s20 wnormal dColor amount-input" style="margin-top: 1.9rem">
          <input
            type="text"
            v-model="amount"
            class="right dColor"
            @input="checkAmount()"
            :placeholder="sendInputValue"
          />{{ tokenInfo ? tokenInfo.token : '-' }}
        </div>
        <span class="s14 wbolder" style="margin-top: 1.9rem"
          >to Orbiter LP Contract ({{
            shortAddress(dTokenAddresses[toChainId])
          }})</span
        >
      </div>
      <div class="sep"></div>
      <div class="timeContent">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span class="s14 wbolder">Estimated APY</span>
          <span class="dColor s14 wnormal">410%</span>
          <!-- 参数：流动性（现金）,总存款 -->
        </div>
      </div>
      <div class="sep"></div>
      <div class="confirmContent">
        <!-- <div class="agreementContent tcenter">
          <a-checkbox @change="agreement">
          </a-checkbox>
          <span class="agreemetTitle s14 wnormal"
                @click="clickAgreement">Read Agreements</span>
        </div> -->
        <o-button
          width="29.5rem"
          height="4rem"
          style="margin-top: 2rem"
          @click="confirmAddLiquidity"
        >
          <span v-if="!addLiquidityLoading" class="wbold s16" 
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

    <CustomPopup ref="liquiditySelectTokenPopupRef">
      <div slot="PoperContent" style="padding-bottom: var(--bottom-nav-height)">
        <SelectToken
          :tokenData="tokenInfoArray"
          @getTokenInfo="getTokenInfo"
          @closeSelect="closeTokenPopupClick()"
        />
      </div>
    </CustomPopup>
    <CustomPopup ref="liquiditySelectChainPopupRef">
      <div slot="PoperContent" style="padding-bottom: var(--bottom-nav-height)">
        <SelectChain
          :ChainData="toChainArray"
          @getChainInfo="getToChainInfo"
          @closeSelect="closeToChainPopupClick()"
        />
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import config from '../../config'
import util from '../../util/util'
import {
  getDTokenContractABI,
  getBasicContractABI,
} from '../../util/constants/contract/getContract'
import CustomPopup from '../popup/bottomPop'
import SelectChain from '../popup/selectChain/selectChain.vue'
import SelectToken from '../popup/selectToken/selectToken.vue'
// import BigNumber from 'bignumber.js'
export default {
  name: 'AddLiquidity',
  props: { dTokenAddresses: Object, makerInfoList: Array },
  data() {
    return {
      amount: '',
      fee: '',
      toolTipDesc1: 'One Batch Value',
      toolTipDesc2: 'One Batch Limit',
      liquidityData: [
        {
          no: 0,
          chainOne: 'Polygon',
          value: '0',
          Fee: '0',
          isContractNet: true,
        },
        {
          no: 1,
          chainOne: 'ETH Main',
          value: '0',
          Fee: '0',
          isContractNet: false,
        },
        {
          no: 2,
          chainOne: 'Optimistic',
          value: '0',
          Fee: '0',
          isContractNet: false,
        },
        {
          no: 3,
          chainOne: 'Arbitrum',
          value: '0',
          Fee: '0',
          isContractNet: false,
        },
        {
          no: 4,
          chainOne: 'zkSync',
          value: '0',
          Fee: '0',
          isContractNet: false,
        },
      ],
      tokenInfo: null,
      tokenInfoArray: [],
      toChainId: 0,
      toChainArray: [],
      sendInputValue: '0',
      addLiquidityLoading: false,
    }
  },
  components: {
    SelectToken,
    SelectChain,
    CustomPopup,
  },
  watch: {
    // 'amount':function(newValue,oldValue){
    //   console.log('oldValue: ', oldValue);
    //   console.log(ethers.BigNumber.from(newValue).gt('12'));
    //   if(ethers.BigNumber.from(newValue).gt('12')){
    //     this.isShowMax = true
    //   }
    // }
  },
  computed:{

  },
  mounted() {
    // Init chain
    this.toChainArray = []
    this.makerInfoList.filter((makerInfo) => {
      if (this.toChainArray.indexOf(makerInfo.c2ID) === -1) {
        this.toChainArray.push(makerInfo.c2ID)
      }
      if (this.toChainArray.indexOf(makerInfo.c1ID) === -1) {
        this.toChainArray.push(makerInfo.c1ID)
      }
    })
    this.toChainId = this.toChainArray[0]

    // Init token
    this.freshTokens()
  },
  methods: {
    freshTokens() {
      this.tokenInfoArray = []
      this.makerInfoList.filter((makerInfo) => {
        const pushToken = (_fromChainID, _toChainID) => {
          if (
            _fromChainID !== this.toChainId &&
            _toChainID !== this.toChainId
          ) {
            return
          }

          if (
            this.tokenInfoArray.findIndex(
              (tokenInfo) => tokenInfo.token === makerInfo.tName
            ) == -1
          ) {
            this.tokenInfoArray.push({
              icon: config.getTokenIcon(makerInfo.tName),
              token: makerInfo.tName,
              amount: 0,
            })
          }
        }
        pushToken(makerInfo.c1ID, makerInfo.c2ID)
        pushToken(makerInfo.c2ID, makerInfo.c1ID)
      })
      this.tokenInfo = this.tokenInfoArray[0]
    },

    changeFee() {
      console.log('fee =', this.fee)
    },
    checkAmount() {
      this.amount = this.amount.replace(/^\D*(\d*(?:\.\d{0,8})?).*$/g, '$1')
    },
    closerButton() {
      console.log('addLiquidity close')
      this.$emit('stateChanged', '1')
    },
    // open selectPop
    showTokenPopupClick() {
      this.$refs.liquiditySelectTokenPopupRef.showCustom()
    },
    // close selectPop
    closeTokenPopupClick() {
      this.$refs.liquiditySelectTokenPopupRef.maskClick()
    },

    // open selectChain
    showToChainPopupClick() {
      this.$refs.liquiditySelectChainPopupRef.showCustom()
    },
    // close selectChain
    closeToChainPopupClick() {
      this.$refs.liquiditySelectChainPopupRef.maskClick()
    },
    selectToken() {
      this.showTokenPopupClick()
    },
    selectToChain() {
      this.showToChainPopupClick()
    },
    getTokenInfo(info) {
      this.tokenInfo = info
    },
    getToChainInfo(info) {
      this.toChainId = info.localID
      this.freshTokens()
    },
    agreement(e) {
      console.log(`agreement = ${e.target.checked}`)
    },
    clickAgreement() {
      console.log('clickAgreement')
    },
    async confirmAddLiquidity() {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      const singer = provider.getSigner()
      await util.ensureMetamaskNetwork(
        this.$env.localChainID_netChainID[this.toChainId]
      )
      const basicToken = new ethers.Contract(
        '0x2e055eEe18284513B993dB7568A592679aB13188',
        getBasicContractABI(),
        singer
      )
      const dTokenInstance = new ethers.Contract(
        this.dTokenAddresses[this.toChainId],
        getDTokenContractABI(),
        singer
      )
      const account = await singer.getAddress()
      const allowanceAmount = await basicToken.allowance(
        account,
        this.dTokenAddresses[this.toChainId]
      )
      const basicBalance = await basicToken.balanceOf(account)
      if (ethers.utils.parseEther(this.amount).isZero()) return
      if (
        ethers.BigNumber.from(ethers.utils.parseEther(this.amount)).gt(
          basicBalance
        )
      ) {
        util.showMessage(
          'Your account balance is ' + ethers.utils.formatEther(basicBalance) + ' DAI',
          'warning'
        )
        return
      }
      if (
        ethers.BigNumber.from(allowanceAmount).lt(
          ethers.utils.parseEther(this.amount)
        )
      ) {
        await basicToken.approve(
          this.dTokenAddresses[this.toChainId],
          ethers.constants.MaxUint256
        )
      } else {
        this.addLiquidityLoading = true
        let overrides = {
          from: account,
          gasLimit: 1000000,
        }
        try {
          let tx = await dTokenInstance.mint(
            ethers.utils.parseEther(this.amount),
            overrides
          )
          this.$notify.success({
            title: tx.hash,
            duration: 3000,
          })
          await tx.wait()
          util.showMessage('AddLiquidity Success', 'success')
          this.amount = ''
        } catch (error) {
          console.log(error)
          this.$notify.error({
            title: error.message,
            duration: 3000,
          })
        } finally {
          this.addLiquidityLoading = false
        }
      }
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues)
    },
    showChainName(localChainID, netChainID) {
      return util.chainName(localChainID, netChainID)
    },
    shortAddress(address) {
      if (!address) {
        return address
      }
      return address.replace(/^(.{6}).*?(.{4})$/i, '$1...$2')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.addLiquidityContent {
  margin: 4.2rem auto;
  .addLiquidityBottom {
    max-height: calc(
      100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
    );
    max-height: calc(
      var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
        var(--bottom-nav-height)
    );
    overflow-y: scroll;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    .header {
      display: flex;
      align-items: center;
      .left {
        margin: 3.3rem 0 0 0.5rem;
        font-weight: bold;
      }
      .right {
        margin: 2.5rem 0.5rem 0 auto;
        padding: 0;
        display: flex;
        width: 13rem;
        height: 3.6rem;
        background-color: transparent;
        border-width: 0.1rem 0.2rem 0.3rem 0.2rem;
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
          font-weight: 600;
          height: 100%;
        }
        .arrow_icon {
          width: 1.5rem;
          height: 1.5rem;
          margin: auto 1rem auto auto;
        }
      }
    }
    .sep {
      box-sizing: border-box;
      background-color: #ffece6;
      height: 0.2rem;
      border-top: 0.2rem dashed rgba(24, 25, 31, 0.2);
      margin-top: 1.6rem;
    }
    .netContent {
      display: flex;
      flex-direction: column;
      .checkContent {
        display: flex;
        justify-content: space-between;
        .right {
          text-align: left;
          border: 0;
          outline: 0px;
          appearance: none;
          transition: all 0.2s ease 0s;
        }
      }
    }
    .batchContent {
      margin: 0;
      padding: 0;
    }
    .timeContent {
      padding-top: 2rem;
    }
    .amount-input input {
      border: none;
      outline: none;
      display: inline;
      width: 100px;
      border-bottom: 2px solid #e8e8e8;
      margin-right: 5px;
      text-align: center;
    }
    .moneyConfirmContent {
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
    }
    .confirmContent {
      padding: 2rem 0;
      .agreementContent {
        .agreemetTitle {
          text-decoration: underline;
          margin-left: 0.5rem;
        }
        .agreemetTitle:hover {
          color: turquoise;
        }
      }
    }
  }
}

.ant-checkbox-inner {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
  border-color: var(--default-black);
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
        background-color: #ff9675;
        color: #ffffff;
        font-size: 1rem;
        line-height: 1.5rem;
        text-align: left;
        border-radius: 0.3rem;
        margin-left: 0.7rem;
      }
    }
  }
}
</style>
