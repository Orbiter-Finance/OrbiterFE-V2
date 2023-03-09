<template>
  <div class="select-rollups-wrapper">
    <el-select v-if="isMobile || onlySelect" v-model="current" no-data-text="No Items">
      <el-option v-for="item in rollups" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <div class="rollups" v-else>
      <div class="rollup" v-for="item in rollups" :key="item.value" :class="{ active: value === item.value }"
        @click="onItemClick(item)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { isMobile } from '../../composition/hooks'

const rollups = [
  { label: 'Arbitrum', value: 'arbitrum' },
  { label: 'Optimism', value: 'optimism' },
  { label: 'zkSync', value: 'zksync' },
  { label: 'Arbitrum Nova', value: "arbitrumnova" }
]
export default {
  props: {
    customRollups: {
      type: Array,
    },
    value: {
      require: true,
    },
    onlySelect: {
      default: false,
    },
  },
  computed: {
    isMobile() {
      return isMobile.value
    },
    rollups() {
      if (Array.isArray(this.customRollups)) {
        return this.customRollups
      }
      return rollups
    },
    current: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('rollup-change', value)
      },
    },
  },
  methods: {
    onItemClick(item) {
      if (this.value === item.value) {
        return
      }
      this.$emit('rollup-change', item.value)
    },
  },
}
</script>

<style lang="scss">
.select-rollups-wrapper {
  display: flex;
  align-items: center;

  .rollups {
    display: flex;
    align-items: center;

    .rollup {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 83px;
      height: 32px;
      padding: 0 12px;
      background: #f5f5f5;
      border-radius: 20px;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #333333;
      margin-right: 10px;
      font-family: 'Inter Regular';
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      &.active {
        font-family: 'Inter Bold';
        font-weight: 700;
        color: #ffffff;
        background: #df2e2d;
      }
    }
  }

  .el-select {
    width: 100%;

    .el-input {
      .el-input__inner {
        background: #f5f5f5;
        border-radius: 12px;
        height: 32px;
        line-height: 32px;
        border-color: transparent !important;
        padding-left: 10px;
      }
    }

    .el-input__icon {
      height: 32px;
      line-height: 32px;
      color: rgba(51, 51, 51, 0.4);
    }
  }
}

.el-select-dropdown {
  background: #ffffff;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
  border: 0;

  .el-select-dropdown__item {
    font-family: 'Inter Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: rgba(51, 51, 51, 0.8);
  }

  .selected {
    color: rgba(51, 51, 51, 0.8);
    background: #f5f5f5;
  }

  .el-select-dropdown__item.hover {
    background: #f5f5f5;
  }
}

.dark-body,
.dark-theme {
  .select-rollups-wrapper {
    .rollups {
      .rollup {
        background: #3f415b;
        color: #fff;

        &.active {
          color: #ffffff;
          background: #df2e2d;
        }
      }
    }

    .el-select {
      .el-input {
        .el-input__inner {
          background: #3f415b;
          color: rgba(255, 255, 255, 0.6);
        }
      }

      .el-input__icon {
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }
}

.dark-body {
  .el-select-dropdown {
    background: #3f415b;
    box-shadow: 0px 8px 50px rgba(0, 0, 0, 0.5);

    .el-select-dropdown__item {
      color: rgba(255, 255, 255, 0.6);
    }

    .selected {
      color: rgba(255, 255, 255, 0.6);
      background: #373951;
    }

    .el-select-dropdown__item.hover:not(.selected) {
      background: #3f415b;
    }
  }
}
</style>
