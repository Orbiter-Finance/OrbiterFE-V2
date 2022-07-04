<template>
  <div class="makerLoginContent">
    <!-- <div id="report"
         style="width: 1000px;height: 400px;"></div> -->

    <!-- <o-box-content class="makerLoginTop"
                   style="width:34.5rem">
      <div class="dataContent">
        <div style="margin-left:0.4rem">
          <div style="margin-bottom:1.5rem">
            <span class="s14 nColor6">ART | Top 36%</span>
            <o-tooltip placement="bottom">
              <template v-slot:titleDesc>
                <span v-html="toolTipDesc"></span>
              </template>
              <svg-icon style="margin-left:0.8rem;width:1.5rem;height:1.5rem"
                        iconName="help"></svg-icon>
            </o-tooltip>
          </div>
          <div class="wbolder">
            00:00:45
          </div>
        </div>
        <div style="text-align:right;margin-right:2.9rem">
          <div style="margin-bottom:1.5rem">
            <span class="s14 nColor6">Total Revenue</span>
          </div>
          <div class="wbolder">
            $123123
          </div>
        </div>
      </div>
      <div style="border-top:0.2rem dashed var(--default-black)"></div>
      <div class="s14 nColor6"
           style="margin-top:2rem">Daily Earnings</div>
      <div class="charts"
           id="report"
           style="width:29.5rem;height:6.5rem">This is bar graph</div>
    </o-box-content> -->
    <o-box-content
      class="makerLoginBottom"
      style="width: 34.5rem; margin: 50px auto"
    >
      <span class="wbolder" style="margin-left: 1.5rem">My Liquidity</span>
      <div
        style="
          margin-top: 1.5rem;
          height: 0.2rem;
          backgroundcolor: var(--default-black);
        "
      ></div>

      <div
        v-for="(item, index) in liquidityData"
        :key="index"
        class="itemContent"
      >
        <div class="s12 wlighter nColor7" style="margin-bottom: 1.5rem">
          {{ item.chainName }}
        </div>
        <div style="display: flex; margin-bottom: 1.5rem">
          <span>{{ item.tokenName }}</span>
          <span class="dColor" style="margin-left: 1.2rem">{{
            item.amount
          }}</span>
          <div class="removeContent tcenter s12" @click="redeemLiquidity(item)">
            <span v-if="!item.redeemLoading"> Redeem </span>
            <loading
              v-else
              style="margin: auto"
              loadingColor="rgb(254, 126, 110)"
              width="2rem"
              height="2rem"
            ></loading>
          </div>
        </div>
        <div class="removeSep"></div>
      </div>
      <o-button
        width="29.5rem"
        height="4rem"
        style="margin-top: 2.5rem"
        @click="addnewLiquidity"
      >
        <span class="wbold s16">ADD NEW LIQUIDITY</span>
      </o-button>
    </o-box-content>
  </div>
</template>

<script>
import echarts from 'echarts'
import { ethers } from 'ethers'
import util from '../../util/util'
import { getDTokenContractABI } from '../../util/constants/contract/getContract'
import { mapMutations, mapState } from 'vuex'
const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
const singer = provider.getSigner()
export default {
  name: 'loginMaker',
  props: { dTokenAddresses: Object, makerInfoList: Array },
  data() {
    return {
      charts: '',
      source: [
        ['1.31', 450],
        ['2.1', 330],
        ['2.2', 230],
        ['2.3', 300],
        ['2.4', 145],
        ['2.5', 0],
        ['2.6', 100],
        ['2.7', 160],
        ['2.8', 120],
        ['2.9', 180],
      ],
      toChainArray: [],
      toolTipDesc:
        'Average reaction time is your pingjun jiedan sudu. meige dingdan xiangying sudu:<br />① t ≤ 1min, huode 100% jiangli;<br />② 1min < t ≤ 10min, huode xx% jiangli;<br />③ 10min < t, meiyou jiangli qie huode $xx chengfa.',
    }
  },
  computed: {
    ...mapState(['liquidityData']),
  },
  components: {},
  watch: {},
  mounted() {
    // this.$nextTick(function () {
    // this.draw('report')
    // });
    this.toChainArray = []
    this.makerInfoList.filter((makerInfo) => {
      if (this.toChainArray.indexOf(makerInfo.c2ID) === -1) {
        this.toChainArray.push(makerInfo.c2ID)
      }
      if (this.toChainArray.indexOf(makerInfo.c1ID) === -1) {
        this.toChainArray.push(makerInfo.c1ID)
      }
    })
    this.getLquidityData()
  },
  methods: {
    ...mapMutations(['updateLiquidityData']),
    addnewLiquidity() {
      this.$emit('stateChanged', '2')
    },
    async redeemLiquidity(item) {
      if (
        ethers.BigNumber.from(ethers.utils.parseEther(item.amount)).isZero()
      ) {
        util.showMessage(
          'Your account balance of 0 for ' + item.tokenName,
          'warning'
        )
        return
      }
      item.redeemLoading = true
      await util.ensureMetamaskNetwork(
        this.$env.localChainID_netChainID[item.localID]
      )
      const account = await singer.getAddress()
      const dTokenInstance = new ethers.Contract(
        this.dTokenAddresses[item.localID],
        getDTokenContractABI(),
        singer
      )
      let overrides = {
        from: account,
        gasLimit: 1000000,
      }
      try {
        let tx = await dTokenInstance.redeem(
          ethers.utils.parseEther(item.amount),
          overrides
        )
        this.$notify.success({
          title: tx.hash,
          duration: 3000,
        })
        await tx.wait()
        util.showMessage('RedeemLiquidity Success', 'success')
        this.getLquidityData()
      } catch (error) {
        console.log(error)
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      } finally {
        item.redeemLoading = false
      }
    },

    draw(id) {
      this.charts = echarts.init(document.getElementById(id))
      function remFontSize(rem) {
        var fontSize = document.documentElement.style.fontSize
        return Math.floor(rem * fontSize.replace('px', ''))
      }
      var myCharts = this.charts
      myCharts.setOption({
        legend: {},
        dataset: {
          source: this.source,
        },
        xAxis: {
          type: 'category',
          show: false,
          axisLine: {
            lineStyle: {
              show: false,
            },
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          show: false,
          splitLine: {
            show: false,
          },
        },
        grid: {
          x: '0%', //x offset
          y: '15%', // y offset
          width: '100%', // width
          height: '65%', // height
        },
        series: {
          type: 'bar',
          barCategoryGap: '15%',
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              distance: 0,
              formatter: function (params) {
                var value = params.data[1]
                return '$' + value
              },
              show: true,
              position: 'top',
              textStyle: {
                fontWeight: 'bolder',
                fontSize: remFontSize(1.2),
                color: '#18191f',
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#FB7355',
            },
          },
          emphasis: {
            itemStyle: {
              borderColor: '#000',
              borderWidth: remFontSize(0.1),
            },
          },
        },
      })
      myCharts.on('click', function (params) {
        myCharts.dispatchAction({
          type: 'highlight',
          seriesIndex: params.dataIndex,
          dataIndex: params.dataIndex,
        })
        //params.seriesIndex
      })
    },

    async getLquidityData() {
      var newArray = []
      for (let index = 0; index < this.toChainArray.length; index++) {
        const item = this.toChainArray[index]
        let customProvider = new ethers.providers.JsonRpcProvider(
          util.correspondingProvider(item)
        )
        const dTokenInstance = new ethers.Contract(
          this.dTokenAddresses[item],
          getDTokenContractABI(),
          customProvider
        )
        const balanceAmount = await dTokenInstance.balanceOf(
          singer.getAddress()
        )
        var chainData = {
          chainName: util.chainName(
            item,
            this.$env.localChainID_netChainID[item]
          ),
          localID: item,
          tokenName: await dTokenInstance.symbol(),
          amount: ethers.utils.formatEther(balanceAmount),
          redeemLoading: false,
        }
        newArray.push(chainData)
      }
      this.updateLiquidityData(newArray)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.makerLoginContent {
  margin: 0 auto 4.2rem auto;
  max-height: calc(
    100vh - 4.2rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  max-height: calc(
    var(--vh, 1vh) * 100 - 4.2rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  overflow-y: scroll;
  .makerLoginTop {
    // padding: 2rem;
    margin: 4.2rem auto 3rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    .dataContent {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .charts {
      margin: 1rem auto 0;
    }
  }
  .makerLoginBottom {
    margin: 0 auto;
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    .itemContent {
      margin-top: 2rem;
      .removeContent {
        box-sizing: content-box;
        width: 9rem;
        height: 2.6rem;
        line-height: 2.6rem;
        border-width: 0.1rem 0.2rem 0.3rem 0.2rem;
        border-radius: 2rem;
        border-color: black;
        border-style: solid;
        background: radial-gradient(#ffece6, #fff0d6);
        margin: 0 0.5rem 0 auto;
      }
      .removeSep {
        box-sizing: border-box;
        background-color: #ffece6;
        height: 0.2rem;

        border-top: 0.2rem dashed rgba(24, 25, 31, 0.2);
      }
    }
  }
}
</style>
