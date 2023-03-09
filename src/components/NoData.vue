<template>
    <div class="no-data-box">
        <div class="box-wrap">
            <SvgIconThemed icon="nodata" size="xs" />
            <div class="title"><slot>No Data</slot></div>
        </div>
    </div>
</template>

<script>
import { SvgIconThemed } from './'
export default {
    name: 'NoData',
    components: { SvgIconThemed },
}
</script>

<style lang="scss" scoped>
.no-data-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .box-wrap {
        width: 160px;
        height: 76px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .title {
            margin-top: 12px;
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
        }
    }
}
</style>
