<template>
    <div class="comm-box-header">
        <SvgIconThemed
            v-if="back"
            @click.native="back"
            iconName="back"
            class="header-left"
            size="sm"
            :lightOpacity="0.8"
        />
        <slot class="header-content"></slot>
        <SvgIconThemed
            v-if="close"
            @click.native="close"
            iconName="close"
            class="header-right"
            size="sm"
            :lightOpacity="0.8"
        />
    </div>
</template>

<script>
import { SvgIconThemed } from './'

export default {
    name: 'CommBoxHeader',
    components: { SvgIconThemed },
    props: {
        back: {
            type: Function,
            required: false,
        },
        close: {
            type: Function,
            required: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.comm-box-header {
    height: 60px;
    line-height: 60px;
    padding: 0 25px;
    text-align: center;
    overflow: hidden;
    font-weight: 700;
    font-size: 16px;
    font-family: 'Inter Bold';
    .header-left {
        float: left;
    }
    .header-right {
        float: right;
    }
    .header-left,
    .header-right {
        cursor: pointer;
        margin-top: 22px;
    }
}
</style>
