<template>
    <div class="loading" :style="{ width: width, height: height }">
        <i
            class="fade-item fade-item1"
            :style="{
                '--loadingColor': loadingColor,
            }"
        >
        </i>
        <i
            class="fade-item fade-item2"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
        <i
            class="fade-item fade-item3"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
        <i
            class="fade-item fade-item4"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
        <i
            class="fade-item fade-item5"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
        <i
            class="fade-item fade-item6"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
        <i
            class="fade-item fade-item7"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
        <i
            class="fade-item fade-item8"
            :style="{
                '--loadingColor': loadingColor,
            }"
        ></i>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        width: {
            type: String,
            default: '2rem',
        },
        height: {
            type: String,
            default: '2rem',
        },
        loadingColor: { type: String, default: '#e85e24' },
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
<style lang="scss" scoped>
.loading {
    position: relative;
    background-color: transparent;
}
// .loading .loading-box {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   // border-radius: 4px;
// }
.loading .fade-item {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    width: calc(100% - 0.1rem);
    height: calc(100% - 0.1rem);
    margin: 0.1rem 0px 0px 0.1rem;
}
.loading .fade-item:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 0.1rem;
    height: 25%;
    background-color: var(--loadingColor);
    border-radius: 0.2rem;
    -webkit-border-radius: 0.2rem;
}
.loading .fade-item2 {
    transform: rotate(45deg);
}
.loading .fade-item3 {
    transform: rotate(90deg);
}
.loading .fade-item4 {
    transform: rotate(135deg);
}
.loading .fade-item5 {
    transform: rotate(180deg);
}
.loading .fade-item6 {
    transform: rotate(225deg);
}
.loading .fade-item7 {
    transform: rotate(270deg);
}
.loading .fade-item8 {
    transform: rotate(315deg);
}

.loading .fade-item:before {
    animation: fadeDelay 0.8s infinite ease-in-out both;
}
.loading .fade-item2:before {
    animation-delay: -0.7s;
}
.loading .fade-item3:before {
    animation-delay: -0.6s;
}
.loading .fade-item4:before {
    animation-delay: -0.5s;
}
.loading .fade-item5:before {
    animation-delay: -0.4s;
}
.loading .fade-item6:before {
    animation-delay: -0.3s;
}
.loading .fade-item7:before {
    animation-delay: -0.2s;
}
.loading .fade-item8:before {
    animation-delay: -0.1s;
}

@keyframes fadeDelay {
    0%,
    39%,
    100% {
        opacity: 0.2;
    }
    40% {
        opacity: 1;
    }
}
@-webkit-keyframes fadeDelay {
    0%,
    39%,
    100% {
        opacity: 0.2;
    }
    40% {
        opacity: 1;
    }
}
</style>
