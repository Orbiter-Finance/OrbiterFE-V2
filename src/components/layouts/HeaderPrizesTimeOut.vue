<template>
  <div class="time-out">
    <div class="time-content">optimism superchain</div>
  </div>
</template>

<script>

export default {
  name: 'HeaderPrizesTimeOut',
}
</script>

<style scoped lang="scss">
.time-out {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .time-content {
    background-color: #FF4F4F;
    font-size: 12px;
    border-radius: 999px;
    padding: 0px 8px;
    scale: 0.8;
    //color: #0a1313;
    color: #FFFFFF;
  }
  
}
</style>
