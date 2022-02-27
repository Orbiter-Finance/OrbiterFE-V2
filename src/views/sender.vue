<template>
  <div class="senderContent">
    <keep-alive>
      <Transfer
        v-on:stateChanged="changeState"
        v-if="status === '1' && !showDetail"
      />
    </keep-alive>
    <Confirm
      v-on:stateChanged="changeState"
      v-if="status === '2' && !showDetail"
    />
    <Proceed
      v-on:stateChanged="changeState"
      v-if="status === '3' && !showDetail"
    />
    <Detail
      :detailData="detailData"
      v-on:stateChanged="changeState"
      v-if="showDetail"
    />
    <div class="grant">
      <span>
        欢迎使用Pizza 🍕 Bridge，这是一个去中心化的L222 bridge，<br />
        来自Vitalik的Idea:<a
          href="https://gitcoin.co/issue/gitcoinco/skunkworks/253/100027342"
          >Grant项目</a
        ><br />
        <a href="https://github.com/0xbbPizza/L2Bridge-GitcoinBounty"
          >THE CODE 🌊 Contract and README🏄</a
        ><br />
        <a href="https://github.com/0xbbPizza/OrbiterFE-V2"
          >frontend(power by eric)</a
        ><br />
        这是这个项目的telegram群: 可以从这找到我name: 0xbbPizza</span
      >
    </div>
  </div>
</template>

<script>
import Transfer from '../components/sender/transfer'
import Confirm from '../components/sender/confirm'
import Proceed from '../components/sender/proceed'
import Detail from '../components/sender/detail'
import Middle from '../util/middle/middle'

export default {
  name: 'Sender',
  props: {},
  components: {
    Transfer,
    Confirm,
    Proceed,
    Detail,
  },
  data() {
    return {
      status: '1', // 1 2.confirm 3.proceed
      showDetail: false,
      detailData: null,
    }
  },
  watch: {},
  mounted() {
    Middle.$on('showDetail', (state) => {
      if (state) {
        this.showDetail = true
        this.detailData = state
      }
    })
  },
  computed: {},
  methods: {
    changeState(e) {
      if (e !== '1' && e !== '2' && e !== '3') {
        this.showDetail = false
      } else {
        if (this.status !== e) {
          this.status = e
        }
      }
    },
    dosome() {
      window.open('https://www.google.com', '_blank')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@media screen and (max-width: 5000px) {
  .senderContent {
    .grant {
      font-size: 10px;
    }
  }
}

@media screen and (min-width: 5000px) {
  .senderContent {
    display: flex;
    justify-content: space-between;
    padding: 8.8% 0 0 0;
    margin: 0 auto;
    width: 100%;
    max-width: 128rem;
    .left {
      margin-left: 6.7%;
    }
    .right {
      margin-right: 6.7%;
    }
  }
}
</style>
