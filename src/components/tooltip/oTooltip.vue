<template>
    <a-tooltip
        :placement="placement"
        arrow-point-at-center
        overlayClassName="ob_tooltip"
    >
        <template v-slot:title>
            <slot name="titleDesc"></slot>
            <!-- <svg-icon class=tooltip
                iconName='tooltip'></svg-icon> -->
            <img class="tooltip" src="../../assets/tooltip.png" alt="" />
        </template>
        <slot></slot>
    </a-tooltip>
</template>

<script>
export default {
    name: 'o-tooltip',
    props: {
        placement: {
            type: String,
            default: 'left',
        },
    },
    data() {
        return {}
    },
    mounted() {},
    watch: {},
    methods: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.ob_tooltip {
    .tooltip {
        width: 4rem;
        height: 3.4rem;
        position: absolute;
        top: -3.4rem;
        left: 2rem;
        background-color: transparent;
    }
    .ant-tooltip-inner {
        color: var(--default-black);
        border-width: 0.2rem 0.3rem 0.4rem;
        border-color: var(--default-black);
        border-style: solid;
        background-color: #fff8d4 !important;
        padding: 1rem 1.5rem;
    }
    .ant-tooltip-arrow::before {
        background-color: var(--default-black) !important;
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
