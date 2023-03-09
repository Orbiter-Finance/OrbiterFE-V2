<template>
    <div ref="ctx" class="ob-select-box" @click="showSelectDialog">
        <slot class="prfix" name="prefix">
            <template v-if="selectedItem.icon">
                <img
                    v-if="selectedItem.iconType === 'img'"
                    :src="selectedItem.icon"
                    class="select-item-icon"
                    alt=""
                />
                <svg-icon
                    v-else
                    class="select-item-icon"
                    :iconName="selectedItem.icon"
                ></svg-icon>
            </template>
        </slot>
        <span class="selected-label">{{
            (dataList.find((v) => v.value == value) || {}).label || ''
        }}</span>
        <SvgIconThemed />
        <div
            ref="dialog"
            v-if="!isMobile"
            class="dialog"
            :style="{ display: dialogVisible ? 'block' : 'none' }"
        >
            <div
                v-for="item in dataList"
                @click="selectItem(item)"
                :key="item.value"
                :class="['select-item', { selected: item.value == value }]"
            >
                <template v-if="item.icon">
                    <img
                        v-if="item.iconType === 'img'"
                        :src="item.icon"
                        class="select-item-icon"
                        alt=""
                    />
                    <svg-icon
                        v-else
                        class="select-item-icon"
                        :iconName="item.icon"
                    ></svg-icon>
                </template>
                <span>{{ item.label }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { isMobile } from '../composition/hooks'
import { SvgIconThemed } from './'

export default {
    name: 'ObSelect',
    components: { SvgIconThemed },
    props: {
        datas: {
            type: Array,
            required: true,
        },
        value: {
            type: String | Number,
            required: true,
        },
    },
    data() {
        return {
            dialogVisible: false,
        }
    },
    computed: {
        dataList() {
            return this.datas.map((v) => {
                return {
                    ...v,
                    icon: v.icon || 'tokenLogo',
                    label: v.token,
                    value: v.token,
                    iconType: 'img',
                }
            })
        },
        selectedItem() {
            return this.dataList.find((v) => v.value == this.value) || {}
        },
        isMobile() {
            return isMobile.value
        },
    },
    methods: {
        showSelectDialog() {
            if (!this.isMobile) {
                this.dialogVisible = true
            } else {
                this.$emit('show')
            }
        },
        selectItem(item) {
            // ???? not work
            // this.dialogVisible = false
            // this.$nextTick(() => {
            //   this.dialogVisible = false
            // })
            setTimeout(() => {
                this.dialogVisible = false
            }, 0)
            this.$emit('input', item.value)
        },
        handlerDialogOutsideClick(e) {
            if (this.dialogVisible) {
                const dialog = this.$refs.dialog
                const ctx = this.$refs.ctx
                let cur = e.target
                let hasFind = false
                while (cur && !hasFind) {
                    if (cur === dialog || cur === ctx) {
                        hasFind = true
                    }
                    cur = cur.parentElement
                }
                !hasFind && (this.dialogVisible = false)
            }
        },
    },
    mounted() {
        !this.isMobile &&
            document.addEventListener('click', this.handlerDialogOutsideClick)
    },
    unmounted() {
        !this.isMobile &&
            document.removeEventListener(
                'click',
                this.handlerDialogOutsideClick
            )
    },
}
</script>

<style scoped lang="scss">
.ob-select-box {
    border-radius: 12px;
    width: 101px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    .prefix,
    .suffix,
    .select-item-icon {
        width: 20px;
        height: 20px;
    }
    .selected-label {
        margin: 0 4px;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
    }
    .dialog {
        position: absolute;
        left: 0;
        top: 40px;
        border-radius: 12px;
        min-width: 200px;
        padding: 10px 0;
        z-index: 100;
        .select-item {
            height: 40px;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding-left: 18px;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            .select-item-icon {
                margin-right: 4px;
            }
        }
    }
}
</style>
