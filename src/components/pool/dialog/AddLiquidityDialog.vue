<template>
  <div class="dialog-bg" v-if="dialog.addLiquidityDialogVisible">
    <div class="add-liquidity-dialog">
      <div class="add-liquidity-title">
        Add Liquidity
        <SvgIconThemed
          @click.native="
            setDialogVisible({
              type: 'addLiquidityDialogVisible',
              value: false,
            })
          "
          class="toolbox-close"
          iconName="close"
        />
      </div>
      <div class="add-liquidity-content">
        <div class="liquidity-network">
          <span class="liquidity-item" @click="selectNetwork">Network</span>
        </div>
        <div class="liquidity-token">
          <span class="liquidity-item">Token</span>
        </div>
      </div>
      <div class="add-liquidity-buttom">
        <span class="option-button">Confirm and Add Liquidity</span>
      </div>
    </div>
    <!-- <comm-dialog ref="SelectNetworkPopupRef"> -->
    <!-- <div slot="PoperContent" style="width: 100%"> -->
    <network-select
      v-if="visible"
      v-on:closeSelect="closeNetworkPopupClick()"
      v-on:getNetworkInfo="getNewNetworkInfo"
    />
    <!-- </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SvgIconThemed, NetworkSelect } from '../../'
export default {
  name: 'AddLiquidityDialog',
  components: { SvgIconThemed, NetworkSelect },
  computed: {
    ...mapState(['dialog']),
  },
  data() {
    return {
      visible: false,
    }
  },
  mounted() {
    setTimeout(() => {
      this.visible = true
    }, 500)
  },
  methods: {
    ...mapMutations(['setDialogVisible']),
    // open selectNetwork
    showNetworkPopupClick() {
      console.log(this.$refs.SelectNetworkPopupRef)
      // this.$refs.SelectNetworkPopupRef.showCustom()
    },
    // close selectNetwork
    closeNetworkPopupClick() {
      this.$refs.SelectNetworkPopupRef.maskClick()
    },

    // open selectToken
    showTokenPopupClick() {
      this.$refs.SelectTokenPopupRef.showCustom()
    },
    // close selectToken
    closeTokenPopupClick() {
      this.$refs.SelectTokenPopupRef.maskClick()
    },
    selectNetwork() {
      this.showNetworkPopupClick()
    },
    selectToken() {
      this.showTokenPopupClick()
    },
    getNewNetworkInfo(info) {
      console.log('info: ', info)
      // this.toChainId = info.localID
      // this.freshTokens()
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  .add-liquidity-dialog {
    @extend .dialog-bg;
    border-radius: 20px;
    padding: 44px 40px;
    text-align: left;
    width: 610px;
    height: 395px;
    .add-liquidity-title {
      font: {
        family: 'Inter';
        style: normal;
        weight: 700;
        size: 20px;
      }
      .toolbox-close {
        width: 1.5rem;
        height: 1.5rem;
        position: absolute;
        top: 44px;
        right: 40px;
        opacity: 0.8;
        cursor: pointer;
        &:hover {
          opacity: 0.4;
        }
      }
    }
    .add-liquidity-content {
      font: {
        family: 'Inter Regular';
        weight: 400;
        size: 14px;
      }
      display: flex;
      flex-direction: column;
      line-height: 20px;
      margin-top: 30px;
      .liquidity-network {
        // width: 100%;
      }
      .liquidity-token {
        // width: 100%;
      }
      .maker-link {
        margin-top: 20px;
        color: #df2e2d;
      }
      .maker-link:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      .maker-foot-btn {
        height: 50px;
        box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
        border-radius: 40px;
        font-weight: 700;
        font-size: 20px;
        line-height: 20px;
        color: #fff;
        margin-top: 40px;
        text-align: center;
        line-height: 50px;
        font-family: 'Inter Bold';
      }
    }
    .option-button {
      width: 100%;
      height: 50px;
      background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
      box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
      border-radius: 40px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;

      /* identical to box height, or 100% */
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: -0.01em;
      color: #ffffff;
      justify-content: center;
      &:hover {
        background: #ca2221;
      }
      &:active {
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.2)
          ),
          linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
        box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
      }
    }
  }
}
</style>
