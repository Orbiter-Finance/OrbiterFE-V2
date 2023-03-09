<template>
    <svg-icon
        :iconName="logoName(id)"
        style="width: 1.6rem; height: 1.6rem"
    ></svg-icon>
</template>

<script>
export default {
    name: 'ChainLogoIcon',
    props: {
        id: [String, Number],
    },
    methods: {
        logoName(chainID) {
            if (this.$env.chainIcon[chainID]) {
                return this.$env.chainIcon[chainID]
            }
            return 'ethlogo'
        },
    },
}
</script>
