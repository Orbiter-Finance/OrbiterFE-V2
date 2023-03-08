<template>
    <div
        class="comm-dialog-box"
        :style="{ display: showCommDialog ? 'block' : 'none' }"
    >
        <div
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
        },
    },
}
</script>

<style scoped>
.comm-dialog-box {
}

.CommDialogContent {
    position: fixed;
    width: 400px;
    bottom: 30px;
    right: 30px;
    transition: all 0.3s ease;
    transform: translateY(100%);
    z-index: 3000;
}

.CommDialogContentShow {
    transform: translateY(0);
}
</style>
