<template>
  <div class="addLiquidityContent">
    <o-box-content class="addLiquidityBottom"
                   style="width:34.5rem">
      <div style="display:flex;justify-content: space-between; padding:1.5rem">
        <span class="wbolder"
              style="margin-left:1.5rem">Add Liquidity</span>
        <div @click="closerButton">
          <svg-icon style="width:2rem;height:2rem"
                    iconName="close"></svg-icon>
        </div>
      </div>
      <div style="height:0.2rem;background-color:var(--default-black);border-top:0.2rem dashed var(--default-black);"></div>
      <div class="header">
        <span class="left">Token</span>
        <button @click="selectToken"
                class="right">
          <svg-icon class="token_icon"
                    iconName="tokenLogo"></svg-icon>
          <div class="token_name">token</div>
          <svg-icon v-if="isSelected"
                    class="arrow_icon"
                    iconName="arrow_down"></svg-icon>
          <svg-icon v-else
                    class="arrow_icon"
                    iconName="arrow_up"></svg-icon>
        </button>
      </div>
      <div class="sep"></div>
      <div class="netContent">
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
      <div class="sep"></div>
      <div class="batchContent">
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
      <div class="sep"></div>
      <div class="timeContent">
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
      <div class="sep"></div>
      <div class="moneyConfirmContent tcenter">
        <span class="s14 wbolder">Become a Maker will need to send</span>
        <span class="s20 wnormal dColor"
              style="margin-top:1.9rem">33000 USDC</span>
        <span class="s14 wbolder"
              style="margin-top:1.9rem">to Orbiter Maker Contract (0x8765…9988)</span>
      </div>
      <div class="sep"></div>
      <div class="timeContent">
        <div style="display:flex;align-items:center;justify-content: space-between;">
          <span class="s14 wbolder">Estimated APY</span>
          <span class="dColor s14 wnormal">410%</span>
        </div>
      </div>
      <div class="sep"></div>
      <div class="confirmContent">
        <div class="agreementContent tcenter">
          <a-checkbox @change="agreement">
          </a-checkbox>
          <span class="agreemetTitle s14 wnormal"
                @click="clickAgreement">Read Agreements</span>
        </div>
        <o-button width="29.5rem"
                  height="4rem"
                  style="margin-top:2rem"
                  @click="confirmAddLiquidity">
          <span class="wbold s16">CONFIRM AND SEND</span>
        </o-button>
      </div>

    </o-box-content>
    <CustomPopup ref="LiquiditySelectTokenPopupRef">
      <div slot="PoperContent"
           style="padding-bottom:var(--bottom-nav-height)">
        <Select v-on:getTokenInfo="getTokenInfo"
                v-on:closeSelect="closeSelectPopupClick()" />
      </div>
    </CustomPopup>
  </div>
</template>

<script>

import Select from '../popup/selectToken/selectToken.vue'
import CustomPopup from '../popup/bottomPop'

export default {
  name: 'AddLiquidity',
  props: {
  },
  data() {
    return {
      amount: '',
      fee: '',
      toolTipDesc1: 'One Batch Value',
      toolTipDesc2: 'One Batch Limit',
      isSelected: false,
      liquidityData: [
        {
          no: 0,
          chainOne: 'Polygon',
          value: '0',
          Fee: '0',
          isContractNet: true
        },
        {
          no: 1,
          chainOne: 'ETH Main',
          value: '0',
          Fee: '0',
          isContractNet: false
        },
        {
          no: 2,
          chainOne: 'Optimistic',
          value: '0',
          Fee: '0',
          isContractNet: false
        },
        {
          no: 3,
          chainOne: 'Arbitrum',
          value: '0',
          Fee: '0',
          isContractNet: false
        },
        {
          no: 4,
          chainOne: 'zkSync',
          value: '0',
          Fee: '0',
          isContractNet: false
        }
      ]
    }
  },
  components: {
    Select,
    CustomPopup
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    changeFee() {
      console.log('fee =', this.fee)
    },
    checkAmount() {
      this.amount = this.amount.replace(/^\D*(\d*(?:\.\d{0,8})?).*$/g, '$1')
    },
    closerButton() {
      console.log('addLiquidity close')
      this.$emit("stateChanged", "1");
    },
    // open selectPop
    showSelectPopupClick() {
      this.$refs.LiquiditySelectTokenPopupRef.showCustom();
    },
    // close selectPop
    closeSelectPopupClick() {
      this.$refs.LiquiditySelectTokenPopupRef.maskClick();
      this.isSelected = false
    },
    selectToken() {
      this.isSelected = !this.isSelected
      this.showSelectPopupClick()
    },
    getTokenInfo(e) {
      console.log('getTokenInfo =', e)
    },
    agreement(e) {
      console.log(`agreement = ${e.target.checked}`);
    },
    clickAgreement() {
      console.log('clickAgreement')
    },
    confirmAddLiquidity() {
      console.log('confirmAddLiquidity')
    },
    onChange(checkedValues) {
      console.log('checked = ', checkedValues);
    },
  }
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
</style>
