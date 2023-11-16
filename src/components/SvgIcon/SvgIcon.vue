<template>
    <svg class="svg">
        <use :xlink:href="`#icon-${iconName || '1'}`" />
    </svg>
</template>

<script>
export default {
    props: {
        iconName: {
            type: String | Number,
            require: true,
        },
    },
}
</script>
<style lang="scss">
.svg {
    outline: none;
    fill: currentColor;
}
</style>
