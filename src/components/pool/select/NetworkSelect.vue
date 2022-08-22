<template>
  <div class="obSelectChainBody">
    <div @click.stop="stopPenetrate" class="selectChainContent">
      <div class="topItem">
        <span>Select a Chain</span>
        <div @click="closerButton" style="position: absolute; top: 0; right: 0">
          <SvgIconThemed
            style="width: 2rem; height: 2rem; cursor: pointer"
            iconName="close"
          />
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
        <SvgIconThemed @click="search" class="searchIcon" icon="search" />
      </div>
    </div>
    <div class="list-content-box ob-scrollbar">
      <div class="list-content">
        <div
          v-for="(item, index) in newChainData"
          :key="item.chain"
          @click="getNetworkInfo(item, index)"
          :class="[
            'contentItem',
            {
              selected:
                selectData === 0
                  ? newChainData[selectData].localID === item.localID
                  : selectData === item.localID,
            },
          ]"
        >
          <svg-icon
            class="logo"
            style="margin-right: 1.5rem"
            :iconName="item.icon"
          ></svg-icon>
          <span>{{ item.chain }}</span>
          <CommLoading
            v-if="loadingIndex == index"
            style="left: 1rem; top: 0rem"
            width="1.5rem"
            height="1.5rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../../util/util'
import { SvgIconThemed } from '../../'

export default {
  name: 'NetworkSelect',
  components: { SvgIconThemed },
  props: {
    ChainData: {
      type: Array,
      default: function () {
        return []
      },
    },
    selectData: {
      type: Number,
      default: 0,
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
      let newArray = []
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
        let chainData = {
          icon: iconName,
          chain: util.chainName(item, this.$env.localChainID_netChainID[item]),
          localID: item,
        }
        newArray.push(chainData)
      }
      return newArray
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
    closerButton() {
      this.$emit('closeSelect')
    },
    getNetworkInfo(e) {
      this.$emit('getNetworkInfo', e)
      this.closerButton()
    },
    stopPenetrate(e) {
      e.stopPropagation
    },
    search() {},
    checkKeyWord() {},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.app {
  .obSelectChainBody {
    width: 32rem;
    height: 37.2rem;
  }
}
.app-mobile {
  .obSelectChainBody {
    width: calc(100% - 3rem);
    max-height: 90vh;
    height: 37.2rem;
  }
}
.obSelectChainBody {
  position: relative;
  margin: 4.2rem auto;
  // height: calc(
  //   100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  // );
  height: calc(
    100% - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  border-radius: 2rem;
  padding: 2rem 0;

  .selectChainContent {
    // margin: 1rem 1.5rem;
    position: relative;
    padding: 0 2rem;

    .topItem {
      width: 100%;
      height: 2rem;
      font-size: 2rem;
      font-weight: bold;
      line-height: 2rem;
      display: flex;
      // justify-content: space-between;
      justify-content: center;
      padding: 0 1rem;
      margin-bottom: 1.8rem;
      position: relative;
    }

    .input {
      position: relative;
      border-radius: 2rem;
      margin-bottom: 1rem;
      height: 4rem;
      width: 100%;
      outline: none;
      font-size: 1.4rem;
      padding: 1rem;
      padding-left: 4.8rem;
      border: none;
    }

    input::placeholder {
      font-size: 1.4rem;
      font-family: 'Inter Regular';
    }

    .searchIcon {
      position: absolute;
      left: 2rem;
      top: 1rem;
    }
  }

  .list-content-box {
    overflow-y: scroll;
    height: calc(100% - 9rem);
  }

  .contentItem {
    width: 100%;
    align-items: center;
    display: flex;
    position: relative;
    padding: 1rem 3rem;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 2.4rem;
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
