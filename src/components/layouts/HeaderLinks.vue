<template>
<div class="header-links-box" :style="`flex-direction: ${verical ? 'column' : 'row'};`">
  <div v-for="nav in navs" :key="nav.name" @click="route2(nav)" :class="['nav-item', 'center', { selected: $route.path === nav.href }]">
    {{nav.name}}
    <SvgIconThemed v-if="!isMobile && nav.children" />
  </div>
</div>
</template>

<script>
import { SvgIconThemed  } from '../'
import { isMobile } from '../../composition/hooks'

export default {
  name: 'HeaderLinks',
  components: { SvgIconThemed },
  props: {
    verical: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  computed: {
    isMobile() { return isMobile.value }
  },
  data() {
    return {
      navs: [
        {
          name: 'L2 Bridge',
          href: '/',
        },
        {
          name: 'L2 Data',
          href: '/data',
        },
        {
          name: 'More',
          children: []
        },
      ]
    }
  },
  methods: {
    route2(tar) {
      const path = tar.href
      this.$route.path !== path && this.$router.push({ path, })
      isMobile && this.$emit('closeDrawer')
    },
  }
}
</script>

<style lang="scss" scoped>
.header-links-box {
  display: flex;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  .nav-item {
    height: 60px;
    position: relative;
    display: inline-flex;
  }
  .nav-item.selected::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 6px;
    background: #df2e2d;
    bottom: 8px;
    left: calc(50% - 20px);
    border-radius: 11px;
  }
}
.app-mobile {
  .nav-item {
    border-bottom: 1px solid rgba(51, 51, 51, 0.2);
  }
}
.app {
  .header-links-box {
    height: 40px;
    .nav-item {
      height: 24px;
      margin-right: 39px;
      cursor: pointer;
    }
    .nav-item:last-child {
      margin-right: 0;
    }
    .nav-item.selected::after {
      bottom: -10px;
    }
  }
}
</style>
