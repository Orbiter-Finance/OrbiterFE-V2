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
      this.togglePageTab({type:'TabState',value:tab})

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
  width: 342px;
  height: 40px;
  border-radius: 40px;
  .tab-btn-item {
    display: inline-block;
    width: 33%;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    height: 100%;
    line-height: 40px;
    border-radius: 40px;
    cursor: pointer;
  }
  .tab-btn-item.selected {
    background: #df2e2d;
    color: #ffffff;
    box-shadow: inset 0px -6px 0px rgba(0, 0, 0, 0.16);
  }
}
.app-mobile {
  .toggle-btn-box {
    width: 180px;
  }
}
</style>
