<template>
    <svg-icon
        :class="showedCls"
        :style="styles"
        :iconName="showedIconName"
        :color="color"
    ></svg-icon>
</template>

<script>
export default {
    name: 'SvgIconThemed',
    props: {
        iconName: {
            type: String,
            required: false,
            default: 'arrow_down',
        },
        icon: {
            type: String,
            required: false,
        },
        size: {
            type: String,
            required: false,
            default: 'lg', // xs lg sm
        },
        lightOpacity: {
            type: Number,
            required: false,
            default: 0.4,
        },
        darkOpacity: {
            type: Number,
            required: false,
            default: 0.4,
        },
    },
    computed: {
        styles() {
            const styles = {}
            if (this.$attrs.width) {
                styles.width = this.$attrs.width
            }
            if (this.$attrs.height) {
                styles.height = this.$attrs.height
            }
            return styles
        },
        showedCls() {
            return `svg-icon-${this.size}`
        },
        showedIconName() {
            return typeof this.icon === 'string'
                ? `${this.$store.state.themeMode}-${this.icon}`
                : this.iconName
        },
        isLightMode() {
            return this.$store.state.themeMode === 'light'
        },
        color() {
            return this.isLightMode
                ? `rgba(51, 51, 51, ${this.lightOpacity})`
                : `rgba(255, 255, 255, ${this.darkOpacity})`
        },
    },
}
</script>

<style scoped lang="scss">
.svg-icon-xs {
    width: 40px;
    height: 40px;
}
.svg-icon-lg {
    width: 20px;
    height: 20px;
}
.svg-icon-sm {
    width: 16px;
    height: 16px;
}
</style>
