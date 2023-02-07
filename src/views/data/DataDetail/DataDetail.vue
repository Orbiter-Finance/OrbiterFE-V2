<template>
  <div class="transactions-detail">
    <div class="nav">
      <span class="back" v-show="!isMobile" @click="back"> </span>
      <div class="tabs">
        <div
          class="tab"
          v-for="(item, i) in tabs"
          :key="i"
          :class="{ active: currentTab === item.value }"
          @click="onTabChnage(item.value)"
        >
          {{ item.name }}
        </div>
      </div>

      <div v-if="!isMobile" class="contact">
        <div class="btn active" @click="openTwitter">
          Contact Us
        </div>
      </div>
    </div>
    <component v-bind:is="currentTab"></component>
  </div>
</template>

<script>
import Rollups from './Rollups'
import Dapps from './Dapps.vue'
import Contracts from './Contracts.vue'
import { isMobile } from '../../../composition/hooks'

const tabs = [
  {
    name: 'Rollups Data',
    value: 'Rollups',
  },
  {
    name: 'L2 Dapps Data',
    value: 'Dapps',
  },
  {
    name: 'New Contracts',
    value: 'Contracts',
  },
]

export default {
  data() {
    return {
      tabs,
      currentTab: tabs[0].value,
    }
  },
  components: {
    Rollups,
    Dapps,
    Contracts,
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
  },
  mounted() {
    let nav = this.$route.query.nav;
    if (nav instanceof Array) {
      nav = nav[0];
    }
    this.currentTab = nav ? nav : tabs[0].value
  },
  methods: {
    back(){
      // this.$router.back()
      this.$router.push({
        path: '/data',
        query: { rollup_tab: 'arbitrum' },
      })
    },
    onTabChnage(value) {
      this.currentTab = value
      this.$router.replace({
        path: this.$route.path,
        query: { nav: value },
      })
    },
    openTwitter() {
      window.open('https://twitter.com/OrbiterResearch', '_blank');
    }
  },
}
</script>

<style lang="scss">
  .contact {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    padding-right: 20px;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 40px;
      border-radius: 20px;
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      color: rgba(51, 51, 51, 0.8);
      cursor: pointer;
      &.active {
        background: #df2e2d;
        box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
        border-radius: 20px;
        color: #ffffff;
      }
    }
  }
.transactions-detail {
  max-width: 1120px;
  margin: 0 auto;
  .nav {
    display: flex;
    align-items: center;
    .back {
      height: 40px;
      width: 40px;
      margin-right: 40px;
      cursor: pointer;
      background-image: url('../../../assets/data/back.png');
      background-size: 100% 100%;
    }
    .tabs {
      display: flex;
      align-items: center;
      height: 40px;
      background: #ffffff;
      border-radius: 20px;
      .tab {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 40px;
        border-radius: 20px;
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        color: rgba(51, 51, 51, 0.8);
        cursor: pointer;
        &.active {
          background: #df2e2d;
          box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
          border-radius: 20px;
          color: #ffffff;
        }
      }
    }
  }
  @media (max-width: 820px) {
    .nav {
      justify-content: center;
      .tabs {
        height: 36px;
        .tab {
          height: 36px;
          width: 111px;
          font-weight: 400;
          font-size: 14px;
        }
      }
    }
  }
  .el-table th.el-table__cell > .cell {
    padding: 0;
  }
  .caret-wrapper {
    width: 16px;
  }
  .el-table .cell {
    padding: 0;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border: 0;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    width: 0;
  }
  .el-table .descending .sort-caret.descending {
    border-top-color: #df2e2d;
  }
  .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #df2e2d;
  }
  .el-table::before {
    display: none;
  }
  .el-table__body tr.hover-row > td.el-table__cell {
    background-color: #ffffff;
  }
  .el-table tbody tr:hover > td {
    background-color: #ffffff;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell {
    padding: 6px 0;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    color: #333333;
  }
  .el-table .sort-caret.ascending {
    border-bottom-color: rgba(51, 51, 51, 1);
  }
  .el-table .sort-caret.descending {
    border-top-color: rgba(51, 51, 51, 1);
  }
}
.dark-theme {
  .transactions-detail {
    .nav {
      .back {
        background-image: url('../../../assets/data/back_dark.png');
      }
      .tabs {
        background-color: #373951;
        .tab {
          color: rgba(255, 255, 255, 0.6);
          &.active {
            background: #df2e2d;
            color: #ffffff;
          }
        }
      }
    }
    .el-table,
    .el-table__expanded-cell,
    .el-table th.el-table__cell,
    .el-table tr,
    .el-table__body tr.hover-row > td.el-table__cell,
    .el-table tbody tr:hover > td {
      background-color: #373951;
    }
    .el-table td.el-table__cell {
      color: rgba(255, 255, 255, 0.6);
    }
    .el-table th.el-table__cell {
      color: #fff;
    }
    .el-table .sort-caret.ascending {
      border-bottom-color: #fff;
    }
    .el-table .sort-caret.descending {
      border-top-color: #fff;
    }
    .el-table .descending .sort-caret.descending {
      border-top-color: #df2e2d;
    }
    .el-table .ascending .sort-caret.ascending {
      border-bottom-color: #df2e2d;
    }
    .data {
      color: rgba(255, 255, 255, 0.6);
    }
    .name-column {
      color: #fff;
    }
  }
}
</style>
