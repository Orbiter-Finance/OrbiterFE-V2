<template>
    <div
        class="comm-dialog-box"
        :style="{ display: showCommDialog ? 'block' : 'none' }"
    >
        <div
            :class="{ CommDialog: showCommDialog }"
            @touchmove.prevent.stop
            @click="maskClick"
        ></div>
        <div
            @click="maskClick"
            :class="[
                'CommDialogContent',
                'center',
                { CommDialogContentShow: showCommDialog },
            ]"
        >
            <slot name="PoperContent" class="stopPenetrate"></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showCommDialog: false,
        }
    },
    methods: {
        showCustom() {
            this.showCommDialog = true
            // document.body.className = "noScroll"
            document.body.classList.add('noScroll')
        },
        maskClick() {
            this.showCommDialog = false
            // document.body.className = "scroll"
        },
    },
}
</script>

<style scoped>
.comm-dialog-box {
    width: 100%;
    height: 100%;
}
.CommDialog {
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
}

.CommDialogContent {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
    transform: translateY(100%);
    z-index: 3000;
}

.CommDialogContentShow {
    transform: translateY(0);
}
</style>
