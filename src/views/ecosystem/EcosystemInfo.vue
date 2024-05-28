<template>
  <div id="ecosystem-info-container" class="ecosystem-info-container">
    <EcosystemInfoDetails></EcosystemInfoDetails>
    <div class="task-box">
    <EcosystemInfoTask></EcosystemInfoTask>
    </div>
  </div>
</template>

<script>
import EcosystemInfoDetails from './components/Details.vue'
import EcosystemInfoTask from './components/Task.vue'

export default {
  name: 'EcosystemInfo',
  components: {
    EcosystemInfoDetails,
    EcosystemInfoTask
  },
}
</script>

<style scoped lang="scss">
.ecosystem-info-container {
  width: 100%;
  .task-box {
    width: 100%;
    margin-top: 24px;
  }
}

</style>
