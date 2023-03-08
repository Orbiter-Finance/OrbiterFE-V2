<template>
    <div class="gif-loading-box">
        <!-- <div class="gif-loading" :style="gifSize"></div> -->
        <div class="gif-wrap">
            <div class="gif-loading" :style="gifSize"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GifLoading',
    props: {
        size: {
            type: String,
            required: false,
            default: 'md',
        },
    },
    computed: {
        gifSize() {
            const size = this.size === 'lg' ? '60px' : '30px'
            return {
                width: size,
                height: size,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.gif-loading-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .gif-wrap {
        width: 160px;
        height: 160px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .gif-loading {
        background-size: 100%;
    }
}
</style>
