<template>
  <div class="pool-box-container">
    <div class="pool-box-nav">
      <div class="network-button">
        <template v-for="(item, idx) in networkData">
          <span
            :key="idx"
            @click="
              togglePageTab({
                type: 'NetworkliquidityState',
                value: item.index,
              })
            "
            :class="[
              'options-item',
              { selected: curPage.NetworkliquidityState === item.index },
            ]"
            >{{ item.name }}</span
          >
        </template>
      </div>
      <span class="option-button">Pools & Add Liquidity</span>
    </div>
    <div class="pool-box-main">
      <CommLoading
        v-if="isLoading"
        style="margin: auto; margin-top: 5rem"
        width="4rem"
        height="4rem"
      />
      <div
        v-else
        v-for="(item, idx) in curNetworkliquidityData"
        :key="idx"
        class="pool-overview"
      >
        <div class="line-content">
          <div class="content-left">
            <img style="width: 24px; height: 24px" :src="item.tokenSrc" />
            <span class="token-name">{{ item.tokenName }}</span>
          </div>
          <div class="content-right">
            <span class="content-item">My Liquidity in Pizza</span>
            <span class="content-value">{{
              item.liquidity + ' ' + item.tokenName
            }}</span>
          </div>
        </div>
        <div class="line-content">
          <div class="content-left">
            <div class="total-revenue">
              <span class="content-item" style="flex-grow: 1"
                >Total Revenue</span
              >
              <span class="content-value">{{
                item.totalRevenue + ' ' + item.tokenName
              }}</span>
            </div>
            <div class="APR">
              <span class="content-item">APR</span>
              <span class="content-value">{{ item.apr }}%</span>
            </div>
          </div>
          <div class="content-right">
            <span class="content-item"
              >Last Day Revenue
              <SvgIconThemed
                class="mode-icon"
                icon="clock"
                style="margin: 0 4px 0 5px"
              />
              {{ item.dayRevenueTime }}h ago</span
            >
            <span class="content-value">{{
              item.dayRevenue + ' ' + item.tokenName
            }}</span>
          </div>
        </div>
        <hr
          width="150"
          style="
            border: 1px dashed rgba(0, 0, 0, 0.2);
            width: 100%;
            margin-bottom: 30px;
          "
        />
        <div class="line-content">
          <div class="content-left">
            <span class="content-item">Wait to be filled Amount</span>
            <span class="content-value">{{ item.filledAmount }} ETH</span>
          </div>
          <div class="content-right">
            <span class="content-item">Estimated 7 days Profit</span>
            <span class="content-value">{{ item.estimatedProfit }} ETH</span>
          </div>
        </div>
        <div class="line-content">
          <span class="content-button add">Add Liquidity</span>

          <span class="content-button reduce">Reduce Liquidity</span>
        </div>
      </div>
    </div>
    <pool-add-liquidity :AddLiquidityVisible="AddLiquidityVisible" />
  </div>
</template>

<script>
import { SvgIconThemed, CommLoading, PoolAddLiquidity } from '../components'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Pool',
  components: { SvgIconThemed, CommLoading, PoolAddLiquidity },
  computed: {
    ...mapState(['curPage']),
  },
  watch: {
    'curPage.NetworkliquidityState': function () {
      this.getCurNetworkliquidityData()
    },
  },
  data() {
    return {
      isLoading: true,
      networkData: [
        {
          name: 'Goerli',
          index: '1',
        },
        {
          name: 'Arbitrum',
          index: '2',
        },
        {
          name: 'Optimism',
          index: '3',
        },
        {
          name: 'Polygon',
          index: '4',
        },
      ],
      curNetworkliquidityData: [],
      AddLiquidityVisible: false,
    }
  },
  mounted() {
    this.getCurNetworkliquidityData()
  },
  methods: {
    ...mapMutations(['togglePageTab']),
    async getCurNetworkliquidityData() {
      this.isLoading = true
      //   mock of data
      const mockData = [
        {
          tokenSrc: require('../assets/usdtlogo.png'),
          tokenName: 'USDT',
          liquidity: '1,000,000.00',
          totalRevenue: '2335.32',
          apr: '5.22',
          dayRevenueTime: '15',
          dayRevenue: '49.55',
          filledAmount: '1,000,000.000',
          estimatedProfit: '1,000.000',
        },
        {
          tokenSrc: require('../assets/usdtlogo.png'),
          tokenName: 'ETH',
          liquidity: '100,000.000',
          totalRevenue: '100.235',
          apr: '5.22',
          dayRevenueTime: '15',
          dayRevenue: '0.000',
          filledAmount: '1,000,000.000',
          estimatedProfit: '1,000.000',
        },
        {
          tokenSrc: require('../assets/usdclogo.png'),
          tokenName: 'USDC',
          liquidity: '1,000,000.00',
          totalRevenue: '2335.32',
          apr: '5.22',
          dayRevenueTime: '15',
          dayRevenue: '49.55',
          filledAmount: '1,000,000.000',
          estimatedProfit: '1,000.000',
        },
      ]
      setTimeout(() => {
        this.curNetworkliquidityData = mockData
        this.isLoading = false
      }, 300)
    },
  },
}
</script>

<style lang="scss" scoped>
.pool-box-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 28px 85px 21px 85px;
  .network-button {
    display: flex;
    .options-item {
      display: flex;
      // width: 83px;
      height: 32px;
      padding: 6px 10px;
      border-radius: 20px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      align-items: center;
      margin-right: 10px;
      text-align: center;
      letter-spacing: -0.01em;

      &.selected {
        color: #ffffff;
        background: #df2e2d;
      }
    }
  }

  .option-button {
    width: 290px;
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
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
      box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
    }
  }
}
.pool-overview {
  width: 950px;
  height: 280px;
  padding: 25px 40px;
  border-radius: 20px;
  margin: 0px 85px 30px;
  .line-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    &:last-child {
      justify-content: flex-end;
    }
    &:not(:first-child) .content-left {
      justify-content: space-between;
    }
    &:nth-last-child(2) .content-value {
      color: #5ec2b7;
    }
    .content-left {
      display: flex;
      width: 40%;
      .token-name {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 24px;

        /* identical to box height, or 120% */
        display: flex;
        align-items: center;
        letter-spacing: -0.01em;
        margin-left: 11px;
        color: #333333;
      }
      .total-revenue {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 60%;
      }
      .APR {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 24%;
      }
    }
    .content-right {
      display: flex;
      width: 35%;
      align-items: center;
      justify-content: space-between;
    }
    .content-item {
      height: 20px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;

      /* identical to box height, or 167% */
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;

      color: rgba(51, 51, 51, 0.8);
    }
    .content-value {
      height: 24px;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;

      /* identical to box height, or 133% */
      display: flex;
      align-items: center;
      text-align: right;
      letter-spacing: -0.01em;

      /* #333333深色文字 */
      color: #333333;
    }
    .content-button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 8px 24px;
      gap: 10px;
      height: 40px;
      border-radius: 20px;
      box-shadow: inset 0px -3px 0px rgba(0, 0, 0, 0.16);

      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;

      /* identical to box height, or 150% */
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: -0.01em;

      color: #ffffff;
      &.add {
        background: #084c61;
        &:not(:disabled):hover {
          background: #053442;
        }
      }
      &.reduce {
        background: rgba(51, 51, 51, 0.4);
        margin-left: 14px;
        &:not(:disabled):hover {
          background: rgba(26, 26, 26, 0.4);
        }
      }
    }
  }
}
</style>
