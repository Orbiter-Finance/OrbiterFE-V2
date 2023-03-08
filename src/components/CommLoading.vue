<template>
    <loading
        class="loading"
        :loadingColor="
            isLightMode ? 'rgba(51, 51, 51, 0.8)' : 'rgba(255, 255, 255, 0.6)'
        "
        :width="$attrs.width || '1.2rem'"
        :height="$attrs.height || '1.2rem'"
    ></loading>
</template>

<script>
import Loading from './loading/loading.vue'

export default {
    name: 'CommLoading',
    components: { Loading },
    computed: {
        isLightMode() {
            return this.$store.state.themeMode === 'light'
        },
    },
}
</script>

<style scoped lang="scss">
.loading {
    display: inline-block;
}
</style>
