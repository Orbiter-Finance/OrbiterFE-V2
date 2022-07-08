<template>
<a-tooltip :placement="placement"
            arrow-point-at-center
            :overlayClassName="$store.state.themeMode + '-comm_tooltip'">
  <template slot="title">
    <div class="tooltip-title">
      <SvgIconThemed class="icon" style="margin-right:8px;margin-top: 2px;" size="xs" width="16px" height="16px" icon="info" />
      <slot name="titleDesc"></slot>
    </div>
  </template>
  <slot></slot>
</a-tooltip>
</template>

<script>
import { SvgIconThemed } from './'
export default {
  name: 'CommTooltip',
  components: { SvgIconThemed },
  props: {
    placement: {
      type: String,
      default: 'left'
    }
  },
}
</script>

<style lang="scss">
.light-comm_tooltip, .dark-comm_tooltip {
  .tooltip-title {
    word-break: keep-all;
    padding-left: 26px;
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .tooltip {
    width: 4rem;
    height: 3.4rem;
    position: absolute;
    top: -3.4rem;
    left: 2rem;
  }
  .ant-tooltip-inner {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    padding: 20px;
    border-radius: 12px;
  }
}
.light-comm_tooltip {
  .ant-tooltip-inner {
    color: rgba(51, 51, 51, 0.8);
    background: #FFF !important;
  }
  .ant-tooltip-arrow::before {
    background: #FFF !important;
  }
}
.dark-comm_tooltip {
  .ant-tooltip-inner {
    color: rgba(255, 255, 255, 0.8);
    background: #3f4159 !important;
  }
  .ant-tooltip-arrow::before {
    background: #3f4159 !important;
  }
}

.ant-tooltip-placement-bottomLeft,
.ant-tooltip-placement-bottomRight,
.ant-tooltip-placement-bottom {
  .tooltip {
    top: calc(-3.4rem + 8px);
  }
}

.ant-tooltip-placement-bottomLeft {
  .tooltip {
    left: auto;
    right: 2rem;
  }
}
</style>
