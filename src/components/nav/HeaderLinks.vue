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
                $route.path === snav.phref && curPage.TabState === snav.name,
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
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HeaderLinks',
  components: { SvgIconThemed },
  props: {
    verical: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapState(['isMobile', 'curPage']),
  },
  data() {
    return {
      navs: [
        {
          name: 'L2 Bridge',
          href: '/',
          children: [
            {
              name: 'Sender',
              phref: '/',
            },
            {
              name: 'Maker',
              phref: '/',
            },
          ],
        },
        // {
        //   name: 'More',
        //   children: [],
        // },
      ],
    }
  },
  methods: {
    ...mapMutations(['togglePageTab']),
    route2(tar) {
      const path = tar.href
      this.$route.path !== path && this.$router.push({ path })
      this.isMobile && this.$emit('closeDrawer')
    },
    subnavClick(nav, snav) {
      this.route2(nav)
      this.togglePageTab({ type: 'TabState', value: snav.name })
    },
  },
}
</script>

<style lang="scss" scoped>
.header-links-box {
  display: flex;
  font-weight: 700;
  font-size: 1.6rem;
  line-height: 2.4rem;
  .nav-item {
    height: 6rem;
    position: relative;
    display: inline-flex;
  }
  .nav-item.selected::after {
    content: '';
    position: absolute;
    width: 4rem;
    height: 0.6rem;
    background: #df2e2d;
    bottom: 0.8rem;
    left: calc(50% - 2rem);
    border-radius: 1.1rem;
  }
}
.app-mobile {
  .nav-item-sub {
    // height: 5rem;
    position: relative;
    display: inline-flex;
    font-family: 'Inter Regular';
    line-height: 2.4rem;
    margin-bottom: 1.2rem;
    padding-bottom: 1.6rem;
  }
  .nav-item-sub.selected::after {
    content: '';
    position: absolute;
    width: 4rem;
    height: 0.6rem;
    background: #df2e2d;
    bottom: 0rem;
    left: calc(50% - 2rem);
    border-radius: 1.1rem;
  }
}
.app {
  .header-links-box {
    height: 4rem;
    .nav-item {
      height: 2.4rem;
      margin-right: 3.9rem;
      cursor: pointer;
    }
    .nav-item:last-child {
      margin-right: 0;
    }
    .nav-item.selected::after {
      bottom: -1rem;
    }
  }
}
</style>
