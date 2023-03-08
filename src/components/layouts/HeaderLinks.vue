<template>
    <div
        class="header-links-box"
        :style="`flex-direction: ${verical ? 'column' : 'row'};`"
    >
        <template v-for="(nav, idx) in navs">
            <div
                :key="nav.name"
                @click="route2(nav)"
                :class="[
                    'nav-item',
                    'center',
                    {
                        selected:
                            (!isMobile || (isMobile && !nav.children)) &&
                            $route.path === nav.href,
                        'nav-item-border-bottom': !(
                            nav.children && nav.children.length > 0
                        ),
                        'nav-item-border-top':
                            idx > 0 &&
                            navs[idx - 1].children &&
                            navs[idx - 1].children.length > 0,
                    },
                ]"
            >
                {{ nav.name }}
                <SvgIconThemed
                    v-if="!verical && !isMobile && nav.children == 0"
                />
            </div>
            <template v-if="isMobile && nav.children && nav.children.length">
                <div
                    v-for="snav in nav.children"
                    :key="nav.name + '_' + snav.name"
                    @click="subnavClick(nav, snav)"
                    :class="[
                        'nav-item-sub',
                        'center',
                        {
                            selected:
                                $route.path === snav.phref &&
                                curPageTabState === snav.name,
                        },
                    ]"
                >
                    - {{ snav.name }}
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import { SvgIconThemed } from '../'
import { isMobile, curPageTabState, setPageTab } from '../../composition/hooks'

export default {
    name: 'HeaderLinks',
    components: { SvgIconThemed },
    props: {
        verical: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    computed: {
        isMobile() {
            return isMobile.value
        },
        curPageTabState() {
            return curPageTabState.value
        },
    },
    data() {
        return {
            navs: [
                {
                    name: 'L2 Bridge',
                    href: '/',
                    children: [
                        {
                            name: 'Sender',
                            phref: '/',
                        },
                        {
                            name: 'Maker',
                            phref: '/',
                        },
                    ],
                },
                {
                    name: 'L2 Data',
                    href: '/data',
                },
                // {
                //   name: 'More',
                //   children: []
                // },
            ],
        }
    },
    methods: {
        route2(tar) {
            const path = tar.href
            this.$route.path !== path && this.$router.push({ path })
            isMobile && this.$emit('closeDrawer')
        },
        subnavClick(nav, snav) {
            this.route2(nav)
            setPageTab(snav.name)
        },
    },
}
</script>

<style lang="scss" scoped>
.header-links-box {
    display: flex;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    .nav-item {
        height: 60px;
        position: relative;
        display: inline-flex;
    }
    .nav-item.selected::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 6px;
        background: #df2e2d;
        bottom: 8px;
        left: calc(50% - 20px);
        border-radius: 11px;
    }
}
.app-mobile {
    .nav-item-sub {
        // height: 50px;
        position: relative;
        display: inline-flex;
        font-family: 'Inter Regular';
        line-height: 24px;
        margin-bottom: 12px;
        padding-bottom: 16px;
    }
    .nav-item-sub.selected::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 6px;
        background: #df2e2d;
        bottom: 0px;
        left: calc(50% - 20px);
        border-radius: 11px;
    }
}
.app {
    .header-links-box {
        height: 40px;
        .nav-item {
            height: 24px;
            margin-right: 39px;
            cursor: pointer;
        }
        .nav-item:last-child {
            margin-right: 0;
        }
        .nav-item.selected::after {
            bottom: -10px;
        }
    }
}
</style>
