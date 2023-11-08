<template>
    <img style="width: 1.6rem; height: 1.6rem" :src="logoName(id)">
</template>

<script>
import util from "../util/util";
export default {
    name: 'ChainLogoIcon',
    props: {
        id: [String, Number],
    },
    methods: {
        logoName(chainID) {
            return util.netWorkLogo(chainID);
        },
    },
}
</script>
