<template>
<div class="bottom-nav">
  <div class="links">
    <div class="links-content">
      <span v-for="item in orbiterInfoData" :key="item.title" class="links-item">
        <SvgIconThemed @click.native="JumpToMedia(item.value)" :icon="item.icon" class="links-icon" />
      </span>
    </div>
  </div>
  <div class="terms">
    <span @click="openTerms">Terms of Use</span>
  </div>
</div>
</template>

<script>
import { SvgIconThemed } from '../'

export default {
  name: 'BottomNav',
  components: { SvgIconThemed },
  data() {
    return {
      orbiterInfoData: [
        {
          icon: 'docs',
          title: 'Docs ',
          value: 'https://docs.orbiter.finance/',
        },
        {
          icon: 'github',
          title: 'Github ',
          value: 'https://github.com/Orbiter-Finance',
        },
        {
          icon: 'twitter',
          title: 'Twitter  ',
          value: 'https://twitter.com/Orbiter_Finance',
        },
        {
          icon: 'medium',
          title: 'Medium',
          value: 'https://orbiter-finance.medium.com/',
        },
        {
          icon: 'discord',
          title: 'Discord',
          value: 'https://discord.gg/hJJvXP7C73',
        },
      ]
    }
  },
  methods: {
    JumpToMedia(e) {
      window.open(e, '_blank')
    },
    openTerms() {
      window.open(
        'https://get.orbiter.finance/Orbiter_Finance_Terms_of_Use.pdf',
        '_blank'
      )
    },
  }
}
</script>

<style scoped lang="scss">
.app {
  .bottom-nav {
    margin-top: 3.6rem;
    padding-bottom: 1.2rem;
  }
}
.app-mobile {
  .bottom-nav {
    margin-top: 2rem;
    padding-bottom: 2.4rem;
  }
}
.bottom-nav {
  .links {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 2.4rem;
    margin-bottom: .8rem;
    .links-content {
      .links-item {
        margin-right: 2.5rem;
        width: 2.4rem;
        height: 2.4rem;
        display: inline-block;
        .links-icon {
          width: 2.4rem; 
          height: 2.4rem;
          cursor: pointer;
        }
        .links-icon:hover {
          opacity: 0.8;
        }
      }
      .links-item:last-child {
        margin-right: 0rem;
      }
    }
  }
  .terms {
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 2rem;
    cursor: pointer;
    opacity: 0.6;
    font-family: 'Inter Regular';
  }
  .terms:hover {
    text-decoration: underline;
    opacity: 0.8;
  }
}
</style>
