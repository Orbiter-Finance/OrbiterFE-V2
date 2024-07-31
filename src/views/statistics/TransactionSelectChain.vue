<template>
  <div>
    <div></div>
    <div class="select-chain">
      <div @click.stop="selectChainCall(item)" v-for="item in chainList" :class="`${selectChain === item.chainId ? 'chain-item-active' : ''} chain-item`" :key="item.chainId">
        <svg-icon
          class="chain-icon"
          v-if="item.chainId"
          :iconName="item.chainId"
        ></svg-icon>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../../components/SvgIcon/SvgIcon.vue'
import config from '../../config'

const chain = config.chain

export default {
  components: { SvgIcon },
  name: 'TransactionSelectChain',
  props: {
    selectChain: String,
    selectChainFunc: Function
  },
  computed: {
    chainList() {
      const list = chain.map((item) => {
        return {
          chainId: item.chainId,
          name: item.name,
        }
      })

      return [{ chainId: '', name: 'All Chains' }].concat(list)
    },
  },
  methods: {
    selectChainCall(item) {
      if(item.chainId === this.selectChain) return
      this.$emit("selectChainFunc", item.chainId)
    }
  }
}
</script>

<style scoped lang="scss">
.select-chain {
  position: absolute;
  top: 20px;
  right: 0;
  width: 188px;
  height: 288px;
  max-height: 288px;
  border-radius: 8px;
  background: rgb(255, 255, 255);
  overflow: auto;
  border: 1px solid rgb(230, 230, 230);
  z-index: 20;
  .chain-item {
    width: 100%;
    height: 36px;
    padding: 0 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0%;
    color: #1A1A1A;
    font-family: GeneralSans-Regular;
    .chain-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .chain-item-active {
    font-weight: 500;
    font-family: GeneralSans-Medium;
    background: #f5f5f5;
  }
  .chain-item:hover {
    background: #f5f5f5;
  }
}
</style>
