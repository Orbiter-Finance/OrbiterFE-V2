<template>
  <div class="makerUnLoginContent">
    <o-box-content class="makerUnLoginTop" style="width: 34.5rem">
      <span style="font-weight: bolder; margin-bottom: 2rem">About Maker</span>
      <span style="font-size: 1.6rem; margin-bottom: 2rem"
        >Orbiter's Maker provides liquidity for Layer 2 and benefits from
        it.</span
      >
      <div @click="clickLearnMore" style="align-self: flex-end">
        <span class="dColor s14 wbolder" style="cursor: default"
          >LEARN MORE</span
        >
        <!-- <svg-icon style="margin-left:0.8rem;width:1.5rem;height:1.5rem"
                  iconName="help"></svg-icon> -->
      </div>
    </o-box-content>
    <o-box-content class="makerUnLoginBottom" style="width: 34.5rem">
      <span class="w600">COMING SOON</span>
      <!-- <o-button width="29.5rem"
                height="4rem"
                style="margin-top:2.5rem"
                @click="connectWallet">
        <span class="wbold s16">CONNECT A WALLET</span>
      </o-button> -->
    </o-box-content>
  </div>
</template>

<script>
import Middle from '../../util/middle/middle'

export default {
  name: 'unloginMaker',
  props: {},
  data() {
    return {}
  },
  components: {},
  watch: {},
  mounted() {},
  methods: {
    clickLearnMore() {
      window.open('https://docs.orbiter.finance/', '_blank')
    },
    connectWallet() {
      Middle.$emit('connectWallet', true)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.makerUnLoginContent {
  margin: 0 auto 4.2rem auto;
  max-height: calc(
    100vh - 4.2rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  max-height: calc(
    var(--vh, 1vh) * 100 - 4.2rem - var(--top-nav-height) -
      var(--bottom-nav-height)
  );
  overflow-y: scroll;
  .makerUnLoginTop {
    padding: 2rem;
    margin: 4.2rem auto 3rem;
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .makerUnLoginBottom {
    margin: 0 auto;
    padding: 2rem;
    // margin: 0 auto;
  }
}
</style>
