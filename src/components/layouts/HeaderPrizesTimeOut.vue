<template>
  <div class="time-out">
    <div class="time-content">$65,000</div>
  </div>
</template>

<script>

export default {
  name: 'HeaderPrizesTimeOut',
}
</script>

<style scoped lang="scss">
.time-out {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -12px;
  justify-content: flex-end;
  align-items: center;
  .time-content {
    background-color: #FF4F4F;
    font-size: 12px;
    border-radius: 999px;
    padding: 0px 8px;
    zoom: 0.87;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    //color: #0a1313;
    color: #FFFFFF;
  }
  
}
</style>
