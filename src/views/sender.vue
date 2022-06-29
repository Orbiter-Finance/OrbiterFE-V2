<template>
  <div class="senderContent">
    <keep-alive>
      <Transfer v-if="status === '1' && !showDetail" v-on:stateChanged="changeState" />
    </keep-alive>
    <Confirm v-if="status === '2' && !showDetail" v-on:stateChanged="changeState" />
    <Proceed v-if="status === '3' && !showDetail" v-on:stateChanged="changeState" />
    <Detail v-if="showDetail" :detailData="detailData" v-on:stateChanged="changeState" />
  </div>
</template>

<script>
import Transfer from '../components/sender/transfer'
import Confirm from '../components/sender/confirm'
import Proceed from '../components/sender/proceed'
import Detail from '../components/sender/detail'
import Bus from '../util/middle/middle'

export default {
  name: 'Sender',
  components: {
    Transfer,
    Confirm,
    Proceed,
    Detail
  },
  data() {
    return {
      status: '1', // 1 2.confirm 3.proceed
      showDetail: false,
      detailData: null
    }
  },
  mounted() {
    Bus.$on('showDetail', state => {
      if (state) {
        this.showDetail = true
        this.detailData = state
      }
    })
  },
  methods: {
    changeState(e) {
      if (['1', '2', '3'].indexOf(e) < 0) {
        this.showDetail = false
      } else {
        this.status = e;
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
