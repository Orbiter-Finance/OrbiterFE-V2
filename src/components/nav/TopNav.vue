<template>
  <div class="topNav">
    <div v-if="!isWeb" class="nav-logo" @click="dosome()">
      <svg-icon
        :style="navIcons.logoStyle"
        :iconName="navIcons.logo"
      ></svg-icon>
    </div>

    <div v-else class="nav-logo-web" :style="!isStarknet?`top: 1.6rem;left: 2.2rem;`:''" @click="dosome()">
      <img v-if="isStarknet" src="../../assets/v2/starknet-logo.png" style="width:190px;height:80px;" />
      <svg-icon
        v-else
        :style="navIcons.logo_webStyle"
        :iconName="navIcons.logo_web"
      ></svg-icon>
    </div>
    <a-radio-group v-model="selected" defaultValue="sender" buttonStyle="solid">
      <a-radio-button value="sender"> Sender </a-radio-button>
      <a-radio-button value="maker"> Maker </a-radio-button>
    </a-radio-group>
    <div class="nav-tips" v-if="isRinkeby">
      <p>
        🛸 Welcome to Orbiter Rinkeby Version! if you want to select Starknet
        Goerli, you should notice the following :
      </p>
      <p>
        If this is your first time using Starknet Goerli to complete
        cross-rollup transfers by Orbiter, you will need to finish the following
        steps, and the whole process takes 25-30 minutes.
        <br />
        1. Call MateMask signature to get the private key and public key of the
        Starknet account
        <br />
        2. Deploy the account contract using the private key and public key
        (takes about 10 minutes) to get the address of the Starknet account
        <br />
        3. Save Ethereum addresses and Starknet addresses to account mapping
        contracts (takes about 5 minutes)
        <br />
        4. Wait for the above steps to finish, then you can start transferring
        to Starknet account (takes about 10 minutes)
      </p>
      <p>
        After the above steps, it only takes 10 minutes when you choose Starknet
        Goerli to complete cross-rollup transfers by Orbiter.
      </p>
      ⚠️ Orbiter doesn't collect or record the private key and public key of
      your StarkNet account. Feel free to test! The private key and public key
      of your StarkNet account will be stored in your browser's cache.
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
  props: {},
  data() {
    return {
      selected: 'sender',
    }
  },
  mounted() {},
  computed: {
    isWeb() {
      if (this.$store.state.innerWH.innerWidth > 550) {
        return true
      }
      return false
    },
    isLogin() {
      return (
        this.$store.state.web3.isInstallMeta &&
        this.$store.state.web3.isInjected &&
        this.$store.state.web3.localLogin
      )
    },
    refererUpper() {
      // Don't use [$route.query.referer], because it will delay
      const { href } = window.location
      const match = href.match(/referer=(\w*)/i)
      if (match?.[1]) {
        return match[1].toUpperCase()
      }
      return ''
    },
    isRinkeby() {
      const { href } = window.location
      return /rinkeby\.orbiter/i.test(href)
    },
    isStarknet() {
      return this.refererUpper === 'STARKNET'
    },
    navIcons() {
      const icons = {
        logo: 'orbiterLogo',
        logoStyle: { width: '4.8rem', height: '4.8rem' },
        logo_web: 'orbiterLogo_web',
        logo_webStyle: { width: '16rem', height: '3.1rem' },
      }
      if (this.isRinkeby) {
        icons.logo_web = 'orbiterLogo_web--rinkeby'
      }
      switch (this.refererUpper) {
        case 'ZKSYNC':
          icons.logo = 'orbiterAsZksyncLogo'
          icons.logoStyle = {
            width: '10.45rem',
            height: '3.7rem',
            margin: '0.5rem 0 0 -0.4rem',
          }

          icons.logo_web = 'orbiterAsZksyncLogo_web'
          icons.logo_webStyle = {
            width: '17.4rem',
            height: '3.7rem',
            marginTop: '0.3rem',
          }
          break
      }
      return icons
    },
  },
  watch: {
    $route: function (to, from) {
      if (to.path === from.path) {
        return
      }
      if (to.path === '/maker' && this.selected !== 'maker') {
        this.selected = 'maker'
      }
      if (
        (to.path === '/' || to.path === '/sender') &&
        this.selected !== 'sender'
      ) {
        this.selected = 'sender'
      }
    },
    selected: function () {
      if (this.selected === 'sender') {
        if (this.$route.path !== '/') {
          this.$router.push({
            path: '/',
            query: this.$route.query,
          })
        }
      } else {
        if (this.$route.path !== '/maker') {
          this.$router.push({
            path: '/maker',
            query: this.$route.query,
          })
        }
      }
    },
  },
  methods: {
    dosome() {
      if (this.refererUpper) {
        window.open(window.location.origin)
      } else {
        window.location.replace(window.location.origin)
      }
    },
    unlogin() {
      this.$store.commit('updateIsInstallMeta', false)
      this.$store.commit('updateIsInjected', false)
    },
    login() {
      this.$store.commit('updateIsInstallMeta', true)
      this.$store.commit('updateIsInjected', true)
    },
    toHistory() {},
    clickHoriz() {},
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.topNav {
  width: 100%;
  max-width: 128rem;
  margin: 0 auto;
  height: var(--top-nav-height);
  position: relative;
  top: 0;
  z-index: 1;
  background-color: transparent;
  display: flex;
  .nav-logo {
    top: 1.6rem;
    left: 2.2rem;
    position: absolute;
  }
  .nav-logo-web {
    position: absolute;
  }
  .ant-radio-group {
    background: #ffede0;
    border-radius: 2rem;
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 17rem;
    height: 3.2rem;
    font-size: 1.4rem;
    text-align: center;
    border-width: 0.15rem 0.15rem 0.25rem 0.15rem;
    border-color: black;
    border-style: solid;
    box-sizing: content-box;
    display: flex;
    box-shadow: 0 1rem 1rem -0.5rem rgba(248, 95, 83, 0.3);
  }
  .ant-radio-button-wrapper {
    border-radius: 2rem;
    content: none;
    padding: 0;
    margin-top: -0.05rem;
    margin-left: -0.05rem;
    width: 8.6rem;
    height: 3.4rem;
    line-height: 3.4rem;
    border: 0;
    box-sizing: border-box;
  }
  .ant-radio-button-wrapper-checked {
    border-width: 0 0.15rem 0.2rem 0.1rem;
    border-color: var(--default-black);
    border-style: solid;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    content: none;
  }
  .ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    background: #f85f53;
    border-width: 0 0.15rem 0.2rem 0.1rem;
    border-color: var(--default-black);
    border-style: solid;
  }

  .nav-tips {
    position: absolute;
    top: 8rem;
    right: 2rem;
    width: 30rem;
    font-size: 10px;
    text-align: left;
  }
  @media (max-width: 900px) {
    .nav-tips {
      display: none;
    }
  }
  @media (max-width: 1000px) {
    .nav-tips {
      width: 25rem;
    }
  }
}
</style>
