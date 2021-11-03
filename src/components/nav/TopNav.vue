<template>
  <div class="topNav">
    <svg-icon v-if="!isWeb"
              class="nav-logo"
              iconName="orbiterLogo"></svg-icon>
    <svg-icon v-else
              class="nav-logo-web"
              iconName="orbiterLogo_web"></svg-icon>
    <a-radio-group v-model="selected"
                   defaultValue="sender"
                   buttonStyle="solid">
      <a-radio-button value="sender">
        Sender
      </a-radio-button>
      <a-radio-button value="maker">
        Maker
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
  props: {
  },
  data() {
    return {
      selected: 'sender'
    }
  },
  mounted() {

  },
  computed: {
    isWeb() {
      if (this.$store.state.innerWH.innerWidth > 550) {
        return true
      }
      return false
    },
    isLogin() {
      return this.$store.state.web3.isInstallMeta && this.$store.state.web3.isInjected && this.$store.state.web3.localLogin
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.path === from.path) {
        return
      }
      if (to.path === '/maker' && this.selected !== 'maker') {
        this.selected = 'maker'
      }
      if ((to.path === '/' || to.path === '/sender') && this.selected !== 'sender') {
        this.selected = 'sender'
      }
    },
    'selected': function () {
      if (this.selected === 'sender') {
        if (this.$route.path !== '/') {
          this.$router.push({
            path: `/`
          })
        }
      } else {
        if (this.$route.path !== '/maker') {
          this.$router.push({
            path: `/maker`
          })
        }
      }
    },
  },
  methods: {
    unlogin() {
      this.$store.commit('updateIsInstallMeta', false)
      this.$store.commit('updateIsInjected', false)
    },
    login() {
      this.$store.commit('updateIsInstallMeta', true)
      this.$store.commit('updateIsInjected', true)
    },
    toHistory() {
    },
    clickHoriz() {
    }
  }
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
    width: 4.8rem;
    height: 4.8rem;
    position: absolute;
  }
  .nav-logo-web {
    top: 1.6rem;
    left: 2.2rem;
    width: 16rem;
    height: 4.8rem;
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
}
</style>
