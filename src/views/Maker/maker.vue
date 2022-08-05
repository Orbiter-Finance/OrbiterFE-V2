<template>
  <div class="makerContent">
    <unloginMaker v-if="!isLogin" />
    <loginMaker
      :dTokenAddresses="dTokenAddresses"
      :makerInfoList="makerInfoList"
      @stateChanged="changeState"
      v-if="isLogin && status === '1'"
    />

    <AddLiquidity
      :dTokenAddresses="dTokenAddresses"
      :makerInfoList="makerInfoList"
      @stateChanged="changeState"
      v-if="isLogin && status === '2'"
    />
  </div>
</template>

<script>
import makerInfo from '../../core/routes/makerInfo'
import AddLiquidity from '../../components/maker/addLiquidity.vue'
import loginMaker from '../../components/maker/loginMaker.vue'
import unloginMaker from '../../components/maker/unloginMaker.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Maker',
  props: {},
  components: {
    unloginMaker,
    loginMaker,
    AddLiquidity,
  },
  data() {
    return {
      status: '1',
      dTokenAddresses: {
        5: '0xA78Eb19720C6043B118FfBf48Ee5CCb019983e60', // Rinkeby
        22: '0xF2164c10FA18A5e1795410871374BF7b34Fdc268', // ARB(Rinkeby)
        77: '0x76D7d615fAa7A37fB0123f7C8724534e1D387c42', // OP(Kovan)
      },
      makerInfoList: [],
    }
  },
  computed: {
    ...mapGetters(['isLogin']),
  },
  async mounted() {
    const getMakerInfoFromGraphReq = {
      maker: '0',
    }
    const response = await makerInfo.getMakerInfoFromGraph(
      getMakerInfoFromGraphReq,
      true
    )
    if (response.code === 0) {
      this.makerInfoList = response.data
    }
  },
  methods: {
    changeState(e) {
      if (this.status !== e) {
        this.status = e
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
