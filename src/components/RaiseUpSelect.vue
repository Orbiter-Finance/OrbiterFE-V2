<template>
    <div
        ref="box"
        class="raiseup-select-box"
        :style="{ display: visible ? 'block' : 'none' }"
    >
        <div class="raiseup-select-box-wrapper">
            <div ref="items" class="items">
                <div
                    v-for="item in showedDatas"
                    :key="item.value"
                    @click="itemClick(item)"
                    :class="['item', { selected: isSelected(item) }]"
                >
                    <template v-if="item.icon">
                        <img
                            v-if="item.iconType === 'img'"
                            :src="item.icon"
                            class="item-icon"
                            alt=""
                        />
                        <svg-icon
                            v-else
                            class="item-icon"
                            :iconName="item.icon"
                        ></svg-icon>
                    </template>
                    <span class="item-label">{{ item.label }}</span>
                </div>
            </div>
            <div ref="cancel" @click="cancel" class="cancel">cancel</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RaiseUpSelect',
    props: {
        iconType: {
            type: String,
            required: false,
            default() {
                return 'img'
            },
        },
        visible: {
            type: Boolean,
            required: true,
        },
        datas: {
            type: Array,
            required: true,
        },
        value: {
            type: String | Number,
            required: false,
        },
        keyMaps: {
            type: Object,
            required: false,
            default() {
                return {
                    value: 'value',
                    label: 'label',
                }
            },
        },
    },
    computed: {
        showedDatas() {
            return this.datas.map((v) => ({
                ...v,
                value: v[this.keyMaps.value],
                label: v[this.keyMaps.label],
                iconType: v.iconType || this.iconType,
            }))
        },
    },
    methods: {
        isSelected(item) {
            return item[this.keyMaps.value] == this.value
        },
        itemClick(item) {
            this.$emit('input', item[this.keyMaps.value])
            this.cancel()
        },
        cancel() {
            this.$emit('hiden')
        },
        handlerDialogOutsideClick(e) {
            if (this.visible) {
                const box = this.$refs.box
                let cur = e.target
                let hasFind = false
                while (cur && !hasFind) {
                    if (cur === box) {
                        hasFind = true
                    }
                    cur = cur.parentElement
                }
                hasFind && this.cancel()
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.handlerDialogOutsideClick)
    },
    unmounted() {
        document.removeEventListener('click', this.handlerDialogOutsideClick)
    },
}
</script>

<style scoped lang="scss">
.raiseup-select-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    .raiseup-select-box-wrapper {
        position: absolute;
        bottom: 9px;
        left: 0;
        padding: 0 15px;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        width: 100%;
        background: transparent;
        .items {
            box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.16);
            border-radius: 12px;
            padding: 10px 0;
            .item {
                height: 40px;
                line-height: 40px;
                text-align: left;
                padding: 0 18px;
                display: flex;
                align-items: center;
                .item-icon {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 6px;
                }
            }
        }
        .cancel {
            box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.16);
            border-radius: 12px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            margin-top: 8px;
        }
    }
}
</style>
