<template>
  <div class="ecosystem-container">
    <div class="ecosystem-content">
        <div class="info">
            <EcosystemInfo></EcosystemInfo>
        </div>
        <div class="reward">
            <EcosystemReward></EcosystemReward>
        </div>
    </div>
  </div>
</template>

<script>

import EcosystemInfo from "./EcosystemInfo.vue"
import EcosystemReward from "./EcosystemReward.vue"

export default {
  name: 'Ecosystem',
  components: {
    EcosystemInfo,
    EcosystemReward
  }
}
</script>

<style scoped lang="scss">
.ecosystem-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .ecosystem-content {
    width: 100%;
    max-width: 960px;
    background-color: var(--light-page-bg);
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: start;
    border-radius: 24px;

    .info {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin-right: 32px;
    }

    .reward{
        width: 280px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  }
}
</style>
