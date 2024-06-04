<template>
  <div class="account-quests">
    <div class="title">🛸 Quests</div>
    <div class="task-card">
      <div
        class="task-card-item"
        v-for="item in actDataList"
        :key="item.id"
      ></div>
    </div>
  </div>
</template>

<script>
import { transferDataState } from '../../../composition/hooks'

export default {
  name: 'AccountQuests',
  computed: {
    actDataList() {
      const list = transferDataState.actDataList || []
      console.log('list', list)
      return list.map((item) => ({
        ...item,
        label: {
          icon: '',
          ...(item?.label || {}),
        },
      }))
    },
  },
}
</script>

<style lang="scss" scoped>
.account-quests {
  width: 100%;
  color: #222;
  .title {
    width: 100%;
    padding: 16px 16px 0;
    border-bottom: 1px dashed #999;
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0px;
  }

  .task-card {
    width: 100%;
    padding: 0 16px;
    .task-card-item {
      margin-top: 8px;
      padding: 12px;
      border-bottom: 8px solid rgb(245, 245, 245);
      border-radius: 12px;
      background: rgb(245, 245, 245);
    }
  }
}
</style>
