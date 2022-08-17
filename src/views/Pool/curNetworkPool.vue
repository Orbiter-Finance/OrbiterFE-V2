<template>
  <div class="pool-box-container">
    <!-- curNetworkPool -->
    <template v-if="curPage.curNetworkPoolMode">
      <div class="pool-box-nav">
        <div class="network-button">
          <template
            v-for="(item, idx) in poolNetworkOrTokenConfig.NetworkArray"
          >
            <span
              :key="idx"
              @click="
                togglePageTab({
                  type: 'NetworkliquidityState',
                  value: String(item),
                })
              "
              :class="[
                'options-item',
                { selected: curPage.NetworkliquidityState === String(item) },
              ]"
              >{{
                showChainName(item, $env.localChainID_netChainID[item])
              }}</span
            >
          </template>
        </div>
        <span
          class="option-button"
          @click="togglePageTab({ type: 'curNetworkPoolMode', value: false })"
          >Pools & Add Liquidity</span
        >
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
          v-for="(item, idx) in getCurNetworkLiquidityData"
          :key="idx"
          class="pool-overview"
        >
          <div class="line-content">
            <div class="content-left">
              <img style="width: 2.4rem; height: 2.4rem" :src="item.tokenSrc" />
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
                <span class="content-item">APY</span>
                <span class="content-value">{{ item.apr }}%</span>
              </div>
            </div>
            <div class="content-right">
              <span class="content-item"
                >Last Day Revenue
                <SvgIconThemed
                  class="mode-icon"
                  icon="clock"
                  style="margin: 0 0.4rem 0 0.5rem"
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
              border: 0.1rem dashed rgba(0, 0, 0, 0.2);
              width: 100%;
              margin-bottom: 3rem;
            "
          />
          <div class="line-content">
            <div class="content-left">
              <span class="content-item">Wait to be filled Amount</span>
              <span class="content-value">{{
                item.filledAmount + ' ' + item.tokenName
              }}</span>
            </div>
            <div class="content-right">
              <span class="content-item">Estimated 7 days Profit</span>
              <span class="content-value">{{
                item.estimatedProfit + ' ' + item.tokenName
              }}</span>
            </div>
          </div>
          <div class="line-content">
            <span
              :class="[
                'content-button',
                'add',
                { addLoading: item.addLiquidityLoading },
              ]"
              @click="
                item.addLiquidityLoading ? '' : showAddLiquidityDialog(item)
              "
            >
              <template v-if="!item.addLiquidityLoading">
                Add Liquidity
              </template>
              <template v-else
                ><loading
                  style="margin: auto"
                  loadingColor="white"
                  width="2rem"
                  height="2rem"
                ></loading>
              </template>
            </span>
            <span
              :class="[
                'content-button',
                'reduce',
                { reduceLoading: item.reduceLoading },
              ]"
              @click="item.reduceLoading ? '' : reduceLiquidity(item)"
            >
              <template v-if="!item.reduceLoading"> Reduce Liquidity </template>
              <template v-else>
                <loading
                  style="margin: auto"
                  loadingColor="white"
                  width="2rem"
                  height="2rem"
                ></loading>
              </template>
            </span>
          </div>
        </div>
      </div>
    </template>
    <!-- allNetworkPool -->
    <template v-else>
      <all-network-pool v-on:deliveryInfo="showAddLiquidityDialog" />
    </template>

    <pool-add-liquidity
      :destChainInfo="destChainInfo"
      v-on:updateTokens="getAllTokenArray"
      v-on:updateLiquidity="getCurNetworkliquidityData"
    />
  </div>
</template>

<script>
import { SvgIconThemed, CommLoading, PoolAddLiquidity } from '../../components'
import allNetworkPool from './allNetworkPool.vue'
import config from '../../config'
import util from '../../util/util'
import { ethers } from 'ethers'
import { mapState, mapMutations, mapGetters } from 'vuex'
import {
  getDTokenContractInstance,
  getSourceContract,
} from '../../util/constants/contract/getContract'
export default {
  name: 'curNetworkPool',
  components: { SvgIconThemed, CommLoading, PoolAddLiquidity, allNetworkPool },
  computed: {
    ...mapState(['curPage', 'web3', 'poolNetworkOrTokenConfig']),
    ...mapGetters(['getCurNetworkLiquidityData', 'HasOrNotTrading']),
    isLoading() {
      return this.getCurNetworkLiquidityData.length === 0 ? true : false
    },
  },
  watch: {
    'curPage.NetworkliquidityState': function () {
      if (!this.HasOrNotTrading) {
        this.getCurNetworkliquidityData()
      }
      this.updatePoolNetworkOrTokenConfig({
        type: 'toChainId',
        value: parseInt(this.curPage.NetworkliquidityState),
      })
    },
    'web3.coinbase': function () {
      this.getCurNetworkliquidityData()
    },
  },
  data() {
    return {
      curPoolMode: false,
      tokenInfoArray: [],
      toChainId: 0,
      destChainInfo: null,
    }
  },
  mounted() {
    this.getAllNetwork()
  },
  methods: {
    ...mapMutations([
      'togglePageTab',
      'setDialogVisible',
      'updatePoolNetworkOrTokenConfig',
      'updateLiquidityData',
      'updateLiquidityDataStatus',
    ]),
    // 获取所有网络
    getAllNetwork() {
      let networkArray = []
      let toChainAddress = {}
      this.poolNetworkOrTokenConfig.makerInfoList.filter((makerInfo) => {
        if (networkArray.indexOf(makerInfo.c2ID) === -1) {
          networkArray.push(makerInfo.c2ID)
          toChainAddress[makerInfo.c2ID] = makerInfo.t2Address
        }
        if (networkArray.indexOf(makerInfo.c1ID) === -1) {
          networkArray.push(makerInfo.c1ID)
          toChainAddress[makerInfo.c1ID] = makerInfo.t1Address
        }
      })
      this.togglePageTab({
        type: 'NetworkliquidityState',
        value: String(networkArray[0]),
      })
      this.toChainId = networkArray[0]
      this.updatePoolNetworkOrTokenConfig([
        {
          type: 'NetworkArray',
          value: networkArray,
        },
        {
          type: 'toChainAddress',
          value: toChainAddress,
        },
      ])

      // 获取最新代币列表
      this.getAllTokenArray(null)
      // 获取 当前网络下 的流动池信息
      this.getCurNetworkliquidityData()
    },
    getAllTokenArray(val) {
      if (val !== null) {
        this.toChainId = val.localID
      }
      this.tokenInfoArray = []
      this.poolNetworkOrTokenConfig.makerInfoList.filter((makerInfo) => {
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
      this.updatePoolNetworkOrTokenConfig([
        {
          type: 'tokenInfoArray',
          value: this.tokenInfoArray,
        },
        {
          type: 'toChainId',
          value: this.toChainId,
        },
      ])
    },
    async getLiquidityData(tokenName, toChainId) {
      let signer = this.web3.provider.getSigner()
      let customProvider = new ethers.providers.StaticJsonRpcProvider(
        process.env[this.$env.localProvider[toChainId]]
      )
      const dTokenInstance = getDTokenContractInstance(
        tokenName,
        toChainId,
        customProvider
      )
      // if (toChainId == 22) {
      //   const options = {
      //     filter: {
      //       txindex: 1,
      //       chainId: 5,
      //     },
      //     fromBlock: '0',
      //   }
      //   const source = getSourceContract(22)
      //   const events = await source.getPastEvents('newTransfer', options)
      //   console.log('events.length ==', events.length)
      //   console.log('tx =', events[0].returnValues.hashOnion)
      // }

      const balanceAmount = await dTokenInstance.balanceOf(signer.getAddress())
      const filledAmount = await dTokenInstance.totalBorrows()
      const apy = await this.getSupplyRatePerBlock(dTokenInstance)
      var chainData = {
        chainName: util.chainName(
          toChainId,
          this.$env.localChainID_netChainID[toChainId]
        ),
        localID: toChainId,
        tokenName: await dTokenInstance.symbol(),
        amount: ethers.utils.formatEther(balanceAmount),
        apr: apy,
        filledAmount: ethers.utils.formatEther(filledAmount),
      }
      return chainData
    },
    async getCurNetworkliquidityData() {
      try {
        let promiseList = []
        for (
          let index = 0,
            tokenArray = Object.keys(this.$env.dTokenAddress),
            tokenArrayLength = tokenArray.length,
            networkLength = this.poolNetworkOrTokenConfig.NetworkArray.length;
          index < tokenArrayLength;
          index++
        ) {
          for (let i = 0; i < networkLength; i++) {
            const tokenName = tokenArray[index]
            const item = this.poolNetworkOrTokenConfig.NetworkArray[i]
            promiseList.push(() => this.getLiquidityData(tokenName, item))
          }
        }
        let res = await Promise.all(promiseList.map((fun) => fun()))
        this.updateLiquidityData(res)
      } catch (error) {
        console.log(error, 'error')
        util.showMessage('Failed to get data', 'error')
      }
    },
    async getSupplyRatePerBlock(dTokenInstance) {
      const blocksPerYear = 2102400
      const divParam = ethers.utils.parseEther('1')
      let calculationApy = 1.11
      try {
        calculationApy = await dTokenInstance.supplyRatePerBlock()
        calculationApy = ((calculationApy * blocksPerYear) / divParam) * 100
      } catch (error) {
        console.log(error)
      }
      return calculationApy
    },
    async reduceLiquidity(item) {
      let signer = this.web3.provider.getSigner()
      if (
        ethers.BigNumber.from(ethers.utils.parseEther(item.liquidity)).isZero()
      ) {
        util.showMessage(
          'Your account balance of 0 for ' + item.tokenName,
          'warning'
        )
        return
      }
      await util.ensureMetamaskNetwork(
        this.$env.localChainID_netChainID[item.localID]
      )
      const account = await signer.getAddress()
      const dTokenInstance = getDTokenContractInstance(
        item.tokenName,
        item.localID,
        signer
      )
      let overrides = {
        from: account,
        gasLimit: 1000000,
      }
      try {
        this.updateLiquidityDataStatus({
          type: 'reduceLoading',
          localID: item.localID,
          tokenName: item.tokenName,
        })
        let tx = await dTokenInstance.redeem(
          ethers.utils.parseEther(item.amount),
          overrides
        )
        this.$notify.success({
          title: tx.hash,
          duration: 3000,
        })

        await tx.wait()
        util.showMessage('reduceLiquidity Success', 'success')

        this.getCurNetworkliquidityData()
      } catch (error) {
        console.log(error)
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      } finally {
        this.updateLiquidityDataStatus({
          type: 'reduceLoading',
          localID: item.localID,
          tokenName: item.tokenName,
        })
      }
    },
    showChainName(localChainID, netChainID) {
      return util.chainName(localChainID, netChainID)
    },
    showAddLiquidityDialog(info) {
      this.destChainInfo = {
        localID: info.localID,
        tokenName: info.tokenName,
      }
      this.setDialogVisible({
        type: 'addLiquidityDialogVisible',
        value: true,
      })
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
  margin: 2.8rem 8.5rem 2.1rem 8.5rem;
  .network-button {
    display: flex;
    .options-item {
      display: flex;
      // width: 8.3rem;
      height: 3.2rem;
      padding: 0.6rem 1rem;
      border-radius: 2rem;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 1.4rem;
      line-height: 2rem;
      align-items: center;
      margin-right: 1rem;
      text-align: center;
      letter-spacing: -0.01em;

      &.selected {
        color: #ffffff;
        background: #df2e2d;
        // font-weight: 700;
      }
    }
  }

  .option-button {
    width: 29rem;
    height: 5rem;
    background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
    box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
    border-radius: 4rem;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    line-height: 2rem;

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
      box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
    }
  }
}
.pool-overview {
  width: 95rem;
  height: 28rem;
  padding: 2.5rem 4rem;
  border-radius: 2rem;
  margin: 0rem 8.5rem 3rem;
  .line-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3rem;
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
      width: 45%;
      .token-name {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 2rem;
        line-height: 2.4rem;

        /* identical to box height, or 120% */
        display: flex;
        align-items: center;
        letter-spacing: -0.01em;
        margin-left: 1.1rem;
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
      height: 2rem;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 2rem;

      /* identical to box height, or 167% */
      display: flex;
      align-items: center;
      letter-spacing: -0.01em;
    }
    .content-value {
      height: 2.4rem;
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 1.8rem;
      line-height: 2.4rem;

      /* identical to box height, or 133% */
      display: flex;
      align-items: center;
      text-align: right;
      letter-spacing: -0.01em;

      /* #333333深色文字 */
    }
    .content-button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0.8rem 2.4rem;
      gap: 1rem;
      height: 4rem;
      border-radius: 2rem;
      box-shadow: inset 0rem -0.3rem 0rem rgba(0, 0, 0, 0.16);

      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 1.6rem;
      line-height: 2.4rem;

      /* identical to box height, or 150% */
      display: flex;
      align-items: center;
      text-align: center;
      letter-spacing: -0.01em;

      color: #ffffff;
      &.add {
        width: 17.25%;
        background: #084c61;
        &:not(:disabled):hover {
          background: #053442;
        }
      }
      &.addLoading {
        background: #053442;
      }
      &.reduce {
        width: 20.1%;
        background: rgba(51, 51, 51, 0.4);
        margin-left: 1.4rem;
        &:not(:disabled):hover {
          background: rgba(26, 26, 26, 0.4);
        }
      }
      &.reduceLoading {
        background: rgba(26, 26, 26, 0.4);
      }
    }
  }
}
</style>
