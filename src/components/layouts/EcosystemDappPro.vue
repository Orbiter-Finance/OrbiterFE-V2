<template>
  <div class="ecosystem-dapp-pro-com">
    <div
      ref="ecosystem_dapp_pro_ref"
      class="ecosystem-dapp-pro-content"
      :style="contentStyle"
    >
      <div class="title">
        <span class="text">Ecosystem DApp </span>
        <svg
          v-show="!isMobile"
          class="expand"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 16 16"
          fill="none"
          @click="triggle(!showCard)"
        >
          <desc>Created with Pixso.</desc>
          <defs />
          <rect
            rx="4.000000"
            width="16.000000"
            height="16.000000"
            fill="#EEEEEE"
            fill-opacity="0"
          />
          <rect
            x="0.500000"
            y="0.500000"
            rx="4.000000"
            width="15.000000"
            height="15.000000"
            stroke="#EEEEEE"
            stroke-opacity="0"
            stroke-width="1.000000"
          />
          <path
            d="M10.77 4.69L10.77 4.72L10.97 5L5.02 5L5.22 4.72L5.22 4.69C5.05 4.57 4.82 4.6 4.7 4.77C4.57 4.94 4.6 5.17 4.77 5.3L4.8 5.29L5.01 5.01L8 7.25L10.98 5.01L11.19 5.29L11.22 5.3C11.39 5.17 11.42 4.94 11.3 4.77C11.17 4.6 10.94 4.57 10.77 4.69Z"
            fill="#D8D8D8"
            fill-opacity="0"
            fill-rule="evenodd"
          />
          <path
            d="M5 5L8 7.25L11 5"
            stroke="#222222"
            stroke-opacity="1.000000"
            stroke-width="0.750000"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <path
            d="M10.77 8.44L10.77 8.47L10.97 8.75L5.02 8.75L5.22 8.47L5.22 8.44C5.05 8.32 4.82 8.35 4.7 8.52C4.57 8.69 4.6 8.92 4.77 9.05L4.8 9.04L5.01 8.76L8 11L10.98 8.76L11.19 9.04L11.22 9.05C11.39 8.92 11.42 8.69 11.3 8.52C11.17 8.35 10.94 8.32 10.77 8.44Z"
            fill="#D8D8D8"
            fill-opacity="0"
            fill-rule="evenodd"
          />
          <path
            d="M5 8.75L8 11L11 8.75"
            stroke="#222222"
            stroke-opacity="1.000000"
            stroke-width="0.750000"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <el-carousel :interval="6000" trigger="click" height="272px">
        <el-carousel-item>
        <EcosystemDapp
          :holders="totalUser"
          :isTags="true"
          :isHolders="true"
          :ratio="ratio"
          :showCard="showCard"
          :banner="'astra2.png'"
          :tag="'Cross-chain Game'"
          :tagStyle="'background: linear-gradient(174.86deg, rgb(234, 255, 188) 20.221%,rgb(219, 239, 45) 62.868%);'"
          :description="'🎉 OKX Cryptopedia Event is Now Live! 🚀 Claim 0.3% of the total $STAR supply on OKX!  🚀Earn 2x O-Points'"
          :isProgress="false"
          :name="'0xastra'"
          :url="'https://0xastra.xyz/'"
        />
      </el-carousel-item>
        <el-carousel-item>
          <EcosystemDapp
            :holders="bullishsTotal"
            :isTags="true"
            :isHolders="true"
            :ratio="ratio"
            :showCard="showCard"
            :banner="'bitlayer-points.png'"
            :tag="'Cross-chain Game'"
            :tagStyle="'background: linear-gradient(to right, #ACCCFF ,#F590FF);'"
            :description="'Earn 9 rewards per Tx. Also, grab 200 $BitlayerPoints at the Race Center.'"
            :isProgress="false"
            :name="'BitlayerPoints'"
            :url="'https://www.bullishs.io?task=orbiter_new_user_rewards'"
          />
        </el-carousel-item>
      
      
        <!-- <el-carousel-item>
        <EcosystemLikidDappPro
        :showCard="showCard"
        ></EcosystemLikidDappPro>
      </el-carousel-item> -->
     
      <!-- <el-carousel-item>
        <EcosystemDapp
          :holders="0"
          :isTags="true"
          :isHolders="false"
          :ratio="xMintRatio"
          :showCard="showCard"
          :banner="'x-mint.png'"
          :tag="'Omni-chain NFT'"
          :tagStyle="'background: linear-gradient(178.05deg, rgb(186, 250, 107) 11.723%,rgb(117, 212, 34) 53.312%);'"
          :description="`Mint your ORBGUY NFT to win great prizes.`"
          :isProgress="true"
          :name="'xmint'"
          :url="'https://xmint.pro/'"
          :btnLabel="'Mint'"
        />
      </el-carousel-item> -->

    
        <el-carousel-item>
          <EcosystemDapp
            :holders="holders"
            :isTags="true"
            :isHolders="true"
            :ratio="ratio"
            :showCard="showCard"
            :banner="'banner.gif'"
            :tag="'Fair Launch'"
            :tagStyle="'background: linear-gradient( 169deg, rgb(248, 218, 211) 7.353%,  rgb(220, 84, 161) 60.561%);'"
            :description="`Transfer ≥ <span class='orbiter_global_ecosystem_dapp_condition_pink'>6TXs</span> to Taiko to grab  <span class='orbiter_global_ecosystem_dapp_condition_pink'>$PINK</span>.`"
            :isProgress="true"
            :tooltipLabel="'Receive an airdrop share for every 6 TXs To Taiko. Stops once the total amount (2,888,888 TXs) reaches.'"
            :name="'TaiKo'"
            :url="'https://www.pinketh.xyz/'"
          />
        </el-carousel-item>
        
      </el-carousel>
    </div>
  </div>
</template>
<script>
import getUTCTime from '../../util/time'
import { decimalNum } from '../../util/decimalNum'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { isMobile } from '../../composition/hooks'
import util from '../../util/util'
import EcosystemDapp from './EcosystemDapp.vue'
// import EcosystemLikidDappPro from './EcosystemLikidDappPro.vue'

let timer
let timer1

export default {
  name: 'EcosystemDappPro',
  components: {
    EcosystemDapp,
    // EcosystemLikidDappPro
  },
  data() {
    return {
      holders: 0,
      totalUser: 0,
      ratio: 0,
      total: '2888888',
      isEnd: false,
      show: true,
      timeStr: '2024/5/23 16:00:00',
      timeList: [],
      bullishsTotal: 0,
      xMintRatio: 0,
      xMintTotal: "10000",
    }
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    showCard() {
      return this.isMobile || this.show
    },
    contentStyle() {
      let style = ''
      style += this.showCard ? 'height: 310px;' : 'height: 50px;'
      style += this.isMobile ? 'position: relative;' : 'position: absolute;'
      return style
    },
  },
  methods: {
    decimalNumC(num, decimal, delimiter) {
      return decimalNum(num, decimal, delimiter)
    },
    openUrl() {
      const url = 'https://www.pinketh.xyz/'
      this.$gtag.event('TaiKo', {
        event_category: 'TaiKo',
        event_label: url,
      })
      window.open(url, '_blank')
    },
    async getData3() {
      const res = await fetch('https://www.bullishs.io/api/users/count')
      const data = await res.json()
      this.bullishsTotal = data?.data || 0
    },
    async getData2() {
      const res = await fetch('https://api.0xastra.xyz/user/data', {
        headers: {
          apikey: '6dffe1c9-9855-4460-a46f-4f1fc48b8283',
        },
      })
      const data = await res.json()
      this.totalUser = data?.data?.totalUser || '0'
    },
    async getData() {
      const res = await fetch(
        'https://api.orbiter.finance/taiko-pink/address/tx_count',
        {}
      )
      const {
        result: { txCount = '0', addressCount = '0' },
      } = await res.json()
      const amount = !isNaN(Number(txCount)) ? String(txCount) : '0'
      const holders = !isNaN(Number(addressCount)) ? String(addressCount) : '0'
      this.holders = holders
      const ratio = ethers.utils
        .parseEther(amount)
        .mul(ethers.utils.parseEther('100'))
        .div(ethers.utils.parseEther(this.total))
      this.ratio = ethers.utils.formatEther(ratio)
    },
    triggle(status) {
      this.show = status
    },
    getUTCTime1(str) {
      let d1 = new Date(str)
      let d2 = new Date(
        d1.getUTCFullYear(),
        d1.getUTCMonth(),
        d1.getUTCDate(),
        d1.getUTCHours(),
        d1.getUTCMinutes(),
        d1.getUTCSeconds()
      )
      return Date.parse(d2)
    },
    async getXmintData() {
      const web3 = new Web3(
        new Web3.providers.HttpProvider('https://rpc.vizing.com')
      )
      const raw = web3.eth.abi.encodeFunctionSignature('currentTokenId()')
      const res = await web3.eth.call({
        to: '0x5915de7a42bba2332d643c0ef8f024a5ebb46631',
        data: raw,
      })
      const result = web3.eth.abi.decodeParameters(['uint256'], res || '')
      const amount = result[0]
      const ratio = ethers.utils
        .parseEther(amount)
        .mul('100')
        .div(this.xMintTotal)
      this.xMintRatio = ethers.utils.formatEther(ratio)
    }
  },
  // mounted() {
  //   timer1 = setInterval(() => {
  //     const t = this.getUTCTime1(this.timeStr)
  //     const timeS = Math.floor((t - getUTCTime()) / 1000)
  //     let time = timeS
  //     if (timeS <= 0) {
  //       clearInterval(timer1)
  //       this.timeList = [
  //         {
  //           value: '00',
  //           symbol: 'D',
  //         },
  //         {
  //           value: '00',
  //           symbol: 'H',
  //         },
  //         {
  //           value: '00',
  //           symbol: 'M',
  //         },
  //         {
  //           value: '00',
  //           symbol: 'S',
  //         },
  //       ]
  //       return
  //     }
  //     let d = Math.floor(time / 3600 / 24)
  //     time -= d * 3600 * 24
  //     d = d < 0 ? 0 : d
  //     d = d < 10 ? '0' + d : d
  //     let h = Math.floor(time / 3600)
  //     time -= h * 3600
  //     h = h < 0 ? 0 : h
  //     h = h < 10 ? '0' + h : h
  //     let m = Math.floor(time / 60)
  //     time -= m * 60
  //     m = m < 0 ? 0 : m
  //     m = m < 10 ? '0' + m : m
  //     const s = time < 10 ? '0' + time : time

  //     this.timeList = [
  //       {
  //         value: d,
  //         symbol: 'D',
  //       },
  //       {
  //         value: h,
  //         symbol: 'H',
  //       },
  //       {
  //         value: m,
  //         symbol: 'M',
  //       },
  //       {
  //         value: s,
  //         symbol: 'S',
  //       },
  //     ]
  //   }, 1000)
  // },
  created() {
    this.getData()
    this.getData2()
    this.getData3()
    this.getXmintData()
    // const _self = this
    // if(!this.isMobile) {
    //   setTimeout(() => {
    //     _self.triggle(false)
    //   }, 5000)
    // }
  },
}
</script>
<style lang="scss" scoped>
@keyframes shine {
  to {
    // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
    background-position: right -40px top 0;
  }
}

.ecosystem-dapp-pro-com {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  height: 50px;
  z-index: 10;
  .ecosystem-dapp-pro-content {
    width: 100%;
    padding: 16px 12px;
    box-sizing: border-box;
    will-change: height;
    transition: all 0.5s linear;
    bottom: 0;
    left: 0;
    box-shadow: rgba(0, 0, 0, 0.11) 0px 0px 10px 0px;
    background-color: #fff;
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        font-family: Kodchasan-Bold;
        font-size: 16px;
        font-weight: bold;
        color: #222222;
        line-height: 22px;
      }
      .expand {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: rgb(238, 238, 238);
        cursor: pointer;
      }
    }
  }
}

.dark-theme {
  .ecosystem-dapp-pro-com {
    .ecosystem-dapp-pro-content {
      background-color: #373951;
      .text {
        color: #f5f5f5;
      }
    }
  }
}
</style>
