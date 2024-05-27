<template>
  <div class="ecosystem-info-task">
    <div class="brdge-card">
      <div class="content success" v-if="isBridge">
        <div class="text">Congratulations! You are eligible!</div>
        <img
          class="image"
          :src="require('../../../assets/ecosystem/success.svg')"
        />
      </div>
      <div v-else class="content not">
        <div class="text">
          <img
            class="image"
            :src="require('../../../assets/ecosystem/warn.svg')"
          />
          You are not eligible!
        </div>
        <div class="bridge-btn">Bridge</div>
      </div>
    </div>
    <div class="tsak-card" :class="isBridge ? '' : 'disable'" v-for="item in taskList" :key="item.name">
        <div class="label">
            <img
              class="image"
              :src="require(`../../../assets/ecosystem/${item.name}.svg`)"
            />
            Follow @bullishs_io
          </div>
          <img
          class="more-btn"
          :src="require('../../../assets/ecosystem/task-more.svg')"
        />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcosystemInfoTask',
  data() {
    return {
      isBridge: true,
      taskList: [{
        name: "x"
      }]
    }
  },
}
</script>

<style scoped lang="scss">
.ecosystem-info-task {
  width: 100%;

  .brdge-card {
    width: 100%;

    .content {
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        display: flex;
        justify-content: start;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        line-height: 25px;
        letter-spacing: 0px;
        text-align: left;

        .image {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }

      .bridge-btn {
        border-radius: 24px;
        background: rgb(239, 47, 45);
        color: rgb(255, 255, 255);
        font-size: 12px;
        font-weight: 700;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: left;
        padding: 3px 12px;
        cursor: pointer;
      }
    }

    .not {
      color: rgb(239, 47, 45);
      background: rgba(239, 47, 45, 0.1);
    }

    .success {
      color: rgb(30, 180, 171);
      background: rgba(30, 180, 171, 0.1);
    }
  }

  .tsak-card {
    margin-top: 24px;
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgb(245, 245, 245);
    cursor: pointer;

    .label {
        display: flex;
        justify-content: start;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        line-height: 25px;
        letter-spacing: 0px;
        text-align: left;
        .image {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
    }

    .more-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
    }
  }


  .disable {
    cursor: not-allowed;
    opacity: 0.3;
}
}
</style>
