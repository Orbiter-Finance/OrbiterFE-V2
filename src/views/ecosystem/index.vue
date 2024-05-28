<template>
  <div id="ecosystem-container" class="ecosystem-container">
    <div class="ecosystem-content">
      <div class="info">
        <EcosystemInfo></EcosystemInfo>
      </div>
      <div class="reward">
        <div class="reward-content">
          <EcosystemReward></EcosystemReward>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EcosystemInfo from './EcosystemInfo.vue'
import EcosystemReward from './EcosystemReward.vue'

export default {
  name: 'Ecosystem',
  components: {
    EcosystemInfo,
    EcosystemReward,
  },
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

    .reward {
      .reward-content {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      width: 280px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

@media (max-width: 1080px) {
  #ecosystem-container.ecosystem-container {
    .ecosystem-content {
      display: block;

      .info {
        margin-right: 0px;
      }

      .reward {
        margin-top: 32px;
        width: 100%;
        .reward-content {
          width: 100%;
          max-width: 520px;
        }
      }
    }
  }
}

@media (max-width: 720px) {
  #ecosystem-container.ecosystem-container {
    .ecosystem-content {
      padding: 16px;
      border-radius: 20px;
    }
  }
}
</style>
