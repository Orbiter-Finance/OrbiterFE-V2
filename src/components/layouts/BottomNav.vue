<template>
<div class="bottom-nav">
  <div class="links">
    <div class="links-content">
      <span v-for="item in orbiterInfoData" :key="item.title" class="links-item">
        <!-- <o-tooltip placement="top">
          <template v-slot:titleDesc>
            <span>{{item.title}}</span>
          </template>
        </o-tooltip> -->
        <SvgIconThemed @click.native="JumpToMedia(item.value)" :iconName="item.icon" :lightOpacity="0.8" :darkOpacity="0.6" class="links-icon" />
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
          icon: 'book',
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
.bottom-nav {
  padding-bottom: 12px;
  margin-top: 36px;
  .links {
    display: flex;
    justify-content: center;
    align-content: center;
    // margin-bottom: 10px;
    .links-content {
      // height: 16.6px;
      .links-item {
        margin-right: 25px;
        .links-icon {
          width: 25px; 
          height: 25px;
          opacity: 0.4;
          cursor: pointer;
        }
        .links-icon:hover {
          opacity: 1;
        }
      }
      .links-item:last-child {
        margin-right: 0px;
      }
    }
  }
  .terms {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
  }
  .terms:hover {
    text-decoration: underline;
  }
}
</style>
