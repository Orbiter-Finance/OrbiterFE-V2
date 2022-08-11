<template>
  <div class="toggle-btn-box">
    <!-- 0:sender 1:maker 2:pool -->
    <span
      @click="toggleTab"
      :class="['tab-btn-item', { selected: curPage.TabState === 'Sender' }]"
      >Sender</span
    >
    <span
      @click="toggleTab('Maker')"
      :class="['tab-btn-item', { selected: curPage.TabState === 'Maker' }]"
      >Maker</span
    >
    <span
      @click="toggleTab('Pool')"
      :class="['tab-btn-item', { selected: curPage.TabState === 'Pool' }]"
      >Pool</span
    >
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ToggleBtn',
  computed: {
    ...mapState(['curPage', 'isMobile']),
  },
  methods: {
    ...mapMutations(['togglePageTab']),
    toggleTab(target) {
      const tab = (typeof target === 'string' && target) || 'Sender'
      this.togglePageTab({ type: 'TabState', value: tab })

      // 待处理
      if (this.isMobile) {
        const last = JSON.parse(
          localStorage.getItem('last_page_before_history') || '{}'
        )
        this.$route.path != last.path && this.$router.push(last)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.toggle-btn-box {
  width: 34.2rem;
  height: 4rem;
  border-radius: 4rem;
  .tab-btn-item {
    display: inline-block;
    width: 33%;
    text-align: center;
    font-weight: 700;
    font-size: 1.6rem;
    height: 100%;
    line-height: 4rem;
    border-radius: 4rem;
    cursor: pointer;
  }
  .tab-btn-item.selected {
    background: #df2e2d;
    color: #ffffff;
    box-shadow: inset 0rem -0.6rem 0rem rgba(0, 0, 0, 0.16);
  }
}
.app-mobile {
  .toggle-btn-box {
    width: 18rem;
  }
}
</style>
