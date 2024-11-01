<template>
  <div
    class="header-links-box"
    :style="`flex-direction: ${verical ? 'column' : 'row'};`"
  >
    <template v-for="(nav, idx) in navs">
      <div
        :key="nav.name"
        @click="route2(nav)"
        :class="[
          'nav-item',
          'center',
          {
            selected:
              (!isMobile || (isMobile && !nav.children)) &&
              $route.path === nav.href,
            'nav-item-border-bottom': !(
              nav.children && nav.children.length > 0
            ),
            'nav-item-border-top':
              idx > 0 &&
              navs[idx - 1].children &&
              navs[idx - 1].children.length > 0,
          },
        ]"
      >
        {{ nav.name }}
      
        <SvgIconThemed v-if="!verical && !isMobile && nav.children == 0" />
        <img class="halloween-icon bounce" v-if="nav.id === 'Prizes'"
                  :src="require('../../assets/activity/ng-icon.jpg')"
                />
      </div>
      <template v-if="isMobile && nav.children && nav.children.length">
        <div
          v-for="snav in nav.children"
          :key="nav.name + '_' + snav.name"
          @click="subnavClick(nav, snav)"
          :class="[
            'nav-item-sub',
            'center',
            {
              selected:
                $route.path === snav.phref && curPageTabState === snav.name,
            },
          ]"
        >
          - {{ snav.name }}
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { SvgIconThemed } from '../'
import {
  isMobile,
  curPageTabState,
  setPageTab,
  transferDataState,
  setActDialogVisible
} from '../../composition/hooks'
import HeaderPrizesTimeOut from "./HeaderPrizesTimeOut.vue"
export default {
  name: 'HeaderLinks',
  components: { SvgIconThemed,HeaderPrizesTimeOut },
  props: {
    verical: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    curPageTabState() {
      return curPageTabState.value
    },
    navs(){
      return [
        {
          name: this.$t('L2 Bridge'),
          href: '/',
          children: [
            {
              name: this.$t('Sender'),
              phref: '/',
            },
            {
              name: this.$t('Maker'),
              phref: '/',
            },
          ],
        },
        // {
        //   name: 'L2 Data',
        //   href: '/data',
        // },
        {
          name: this.$t('Explore'),
          href: '/statistics',
        },
        {
          name: this.$t('Prizes'),
          id:"Prizes",
          href: '',
        },
        // {
        //   name: 'About us',
        //   href: '/home',
        // },
        // {
        //   name: 'More',
        //   children: []
        // },
      ]
    }
  },
  data() {

    return {

    }
  },
  
  methods: {
    route2(tar) {
      if (tar.name.toLocaleLowerCase() === 'prizes'.toLocaleLowerCase()) {
        this.$gtag.event('PATH_TO_PRIZES', {
          event_category: 'PATH_TO_PRIZES',
          event_label: 'to prizes',
        })
        setActDialogVisible(false)
        window.open("https://bridge.orbiter.finance/prizes")
      }
      const dealerId = transferDataState.dealerId
      const path = tar.href
      const routeObj = dealerId ? { path, query: { dealerId } } : { path }
      this.$route.path !== path && this.$router.push(routeObj)
      isMobile && this.$emit('closeDrawer')
    },
    subnavClick(nav, snav) {
      this.route2(nav)
      setPageTab(snav.name)
    },
  },
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
    padding-top: 12px;
    position: relative;
    display: inline-flex;
    position: relative;
    top: 0;
    left: 0;
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
  .nav-item-sub {
    // height: 50px;
    position: relative;
    display: inline-flex;
    font-family: 'Inter Regular';
    line-height: 24px;
    margin-bottom: 12px;
    padding-bottom: 16px;
  }
  .nav-item {
    padding-top: 0;
  }
  .nav-item-sub.selected::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 6px;
    background: #df2e2d;
    bottom: 0px;
    left: calc(50% - 20px);
    border-radius: 11px;
  }
}
.halloween-icon{
  width:35px;margin-left: 1px;
  animation: shine 2s ease infinite;
  opacity: 0.8;
}

@keyframes bounce {
  from,
  20%,
  53%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -20px, 0) scaleY(1.1);
  }

  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -10px, 0) scaleY(1.05);
  }

  80% {
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, -4px, 0) scaleY(1.02);
  }
}

.bounce {
  animation-name: bounce;
  transform-origin: center bottom;
}


.app {
  .header-links-box {
    height: 40px;
    .nav-item {
      height: 24px;
      margin-right: 39px;
      cursor: pointer;
      white-space: nowrap;
    }
    .nav-item:last-child {
      margin-right: 0;
    }
    .nav-item.selected::after {
      bottom: -20px;
    }
  }
}
</style>
