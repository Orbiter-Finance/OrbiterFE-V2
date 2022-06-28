<template>
  <o-box-content class="selectChainBody" style="width: 34.5rem">
    <div @click.stop="stopPenetrate" class="selectChainContent">
      <div class="topItem">
        <span>Select a Chain</span>
        <div @click="closerButton">
          <svg-icon
            style="width: 1.5rem; height: 1.5rem"
            iconName="close"
          ></svg-icon>
        </div>
      </div>
      <div style="width: 100%; position: relative">
        <input
          type="text"
          v-model="keyword"
          class="input"
          @input="checkKeyWord()"
          :placeholder="`input search text`"
        />
        <svg-icon
          @click="search"
          class="searchIcon"
          iconName="search"
        ></svg-icon>
      </div>

      <div
        v-for="(item, index) in newChainData"
        :key="item.chain"
        @click="getChainInfo(item, index)"
        class="contentItem"
      >
        <svg-icon
          class="logo"
          style="margin-right: 1.5rem"
          :iconName="item.icon"
        ></svg-icon>
        <span>{{ item.chain }}</span>
        <loading
          v-if="loadingIndex == index"
          style="left: 1rem; top: 0rem"
          width="1.5rem"
          height="1.5rem"
        ></loading>
      </div>
    </div>
  </o-box-content>
</template>

<script>
import Web3 from 'web3'
import { connectStarkNetWallet } from '../../../util/constants/starknet/helper'
import { DydxHelper } from '../../../util/dydx/dydx_helper'
import { IMXHelper } from '../../../util/immutablex/imx_helper'
import util from '../../../util/util'
import Loading from '../../loading/loading.vue'

export default {
  name: 'SelectChain',
  components: { Loading },
  props: {
    ChainData: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {
      keyword: '',
      loadingIndex: -1,
    }
  },
  computed: {
    transeferChainData: function () {
      var newArray = []
      for (let index = 0; index < this.ChainData.length; index++) {
        const item = this.ChainData[index]
        let iconName = 'tokenLogo'
        if (item === 2 || item === 22) {
          iconName = 'arblogo'
        }
        if (item === 3 || item === 33) {
          iconName = 'zklogo'
        }
        if (item === 4 || item === 44) {
          iconName = 'sknlogo'
        }
        if (item === 6 || item === 66) {
          iconName = 'pglogo'
        }
        if (item === 7 || item === 77) {
          iconName = 'oplogo'
        }
        if (item === 8 || item === 88) {
          iconName = 'imxlogo'
        }
        if (item === 9 || item === 99) {
          iconName = 'loopringlogo'
        }
        if (item === 10 || item === 510) {
          iconName = 'metislogo'
        }
        if (item === 11 || item === 511) {
          iconName = 'dydxlogo'
        }
        if (item === 12 || item === 512) {
          iconName = 'zkspacelogo'
        }
        if (item === 13 || item === 513) {
          iconName = 'bobalogo'
        }
        var chainData = {
          icon: iconName,
          chain: util.chainName(item, this.$env.localChainID_netChainID[item]),
          localID: item,
        }
        newArray.push(chainData)
      }
      const chainOrderIds = [
        1, 5, 3, 33, 2, 22, 6, 66, 7, 77, 9, 99, 8, 88, 10, 510, 4, 44, 11, 511,
        12, 512, 13, 513,
      ]
      return this.orderChainIds(chainOrderIds, newArray)
    },
    newChainData: function () {
      if (!this.keyword || this.keyword === '') {
        return this.transeferChainData
      }
      return this.transeferChainData.filter(
        (item) =>
          item.chain.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1
      )
    },
  },
  watch: {},
  mounted() {},
  methods: {
    orderChainIds: function (chainOrderIds, theArray) {
      theArray.sort((chainInfo, nextChainInfo) => {
        return (
          chainOrderIds.indexOf(chainInfo.localID) -
          chainOrderIds.indexOf(nextChainInfo.localID)
        )
      })
      return theArray
    },
    closerButton() {
      this.loadingIndex = -1
      this.$emit('closeSelect')
    },
    async getChainInfo(e, index) {
      // When chain use stark system
      if (this.isStarkSystem(e.localID)) {
        try {
          // starknet
          if (e.localID == 4 || e.localID == 44) {
            const { starkIsConnected, starkNetAddress } =
              this.$store.state.web3.starkNet
            if (!starkIsConnected && !starkNetAddress) {
              await connectStarkNetWallet()
              if (
                !this.$store.state.web3.starkNet.starkIsConnected &&
                !this.$store.state.web3.starkNet.starkNetAddress
              ) {
                return
              }
            }
          }

          // immutableX
          if (e.localID == 8 || e.localID == 88) {
            this.loadingIndex = index
            const { coinbase } = this.$store.state.web3
            const imxHelper = new IMXHelper(e.localID)
            await imxHelper.ensureUser(coinbase)
          }

          // dydx
          if (e.localID == 11 || e.localID == 511) {
            this.loadingIndex = index
            const { coinbase } = this.$store.state.web3
            const dydxHelper = new DydxHelper(
              e.localID,
              new Web3(window.ethereum),
              'MetaMask'
            )
            await dydxHelper.getDydxClient(coinbase)
          }

          this.loadingIndex = -1
        } catch (err) {
          this.$notify.error({
            title: err.message,
            duration: 3000,
          })

          this.loadingIndex = -1
          return
        }
      }

      this.$emit('getChainInfo', e)
      this.closerButton()
    },
    stopPenetrate(e) {
      e.stopPropagation
    },
    search() {},
    checkKeyWord() {},
    isStarkSystem(chainId) {
      return [4, 44, 8, 88, 11, 511].indexOf(chainId) > -1
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.selectChainBody {
  background-color: #fff;
  margin: 4.2rem auto;
  height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  height: calc(
    var(--vh, 1vh) * 100 - 8.4rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  overflow-y: scroll;

  .selectChainContent {
    margin: 1rem 1.5rem;
    position: relative;

    .topItem {
      width: 100%;
      height: 2rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2rem;
      color: var(--default-black);
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;
      margin-bottom: 1.5rem;
    }

    .input {
      position: relative;
      border-width: 0.15rem 0.2rem 0.3rem 0.2rem;
      border-color: black;
      border-style: solid;
      border-radius: 2rem;
      margin-bottom: 2rem;
      height: 4rem;
      width: 100%;
      outline: none;
      color: var(--default-black);
      font-size: 1.4rem;
      padding: 0 4rem 0 2rem;
    }

    input::placeholder {
      color: #adadb0;
      font-size: 1.4rem;
    }

    .searchIcon {
      position: absolute;
      right: 1.2rem;
      top: 0.8rem;
      width: 2.4rem;
      height: 2.4rem;
    }

    .contentItem {
      width: 100%;
      font-size: 1.4rem;
      line-height: 2rem;
      color: var(--default-black);
      margin: 0 auto 2.4rem auto;
      align-items: center;
      display: flex;
      position: relative;

      .logo {
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 50%;
        background: rgba($color: #000000, $alpha: 0.05);
        padding: 0.2rem;
      }

      .right {
        text-align: right;
        position: absolute;
        right: 0.5rem;
      }
    }
  }
}

// .ant-input-affix-wrapper >>> .ant-input {
//   background-color: transparent;
//   border: 0;
// }

::v-deep .ant-input {
  background-color: transparent;
  border: 0;
  outline: none;
  color: var(--default-black);
  font-size: 1.4rem;
  height: 100%;
}

::v-deep .ant-input-affix-wrapper {
  border: none;
  background: transparent;
  outline: none;
  box-shadow: none;
}
</style>
