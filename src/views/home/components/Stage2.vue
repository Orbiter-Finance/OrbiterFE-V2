<template>
  <div
    class="stage-bg fade-content"
    :style="!isHomePageMobile && { 'background-image': `url(${stageBg}` }"
  >
    <div class="stage2-wrap">
      <div class="stage2-content">
        <div class="title">
          <img :src="stageTitleImg" />
        </div>
        <div
          class="info"
          :style="isHomePageMobile && { 'background-image': `url(${stageBg}` }"
        >
          zk Prover: <br />zK Aggregated Middle Layer
        </div>
        <div class="desc">
          Advancing true interoperability and scabability of Ethereum by
          utilizing ZK SNARKs Recursion technology
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isHomePageMobile } from '../../../composition/hooks'
export default {
  props: {
    stageTitleImg: {
      type: String,
      default: '',
    },
    stageBg: {
      type: String,
      default: '',
    },
  },
  computed: {
    isHomePageMobile () {
      return isHomePageMobile.value
    },
  },
}
</script>

<style scoped lang="scss">
.stage-bg {
  width: 100%;
  margin: 0 auto;
  opacity: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: #222;
}
.stage2-wrap {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  height: 680px;
  text-align: left;
  padding: 122px 0 120px 0;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.title {
  width: 358px;
  height: 87px;
  font-family: 'Kodchasan-SemiBold';
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.info {
  margin-top: 16px;
  line-height: 1;
  font-size: 80px;
  font-family: 'Kodchasan-Regular';
  font-weight: 400;
  color: #ffffff;
}

.desc {
  margin-top: 53px;
  max-width: 72%;
  font-size: 20px;
  font-family: OpenSans-Regular, OpenSans;
  font-weight: 400;
  color: #ffffff;
}
@media (max-width: 1240px) {
  .stage-bg {
    padding: 24px 12px 90px 12px;
    .stage2-wrap {
      padding: 0;
      height: auto;
      .stage2-content {
        width: 100%;
        height: auto;
        .title {
          width: 217px;
          height: 48px;
          padding-left: 0;
        }
        .info {
          font-size: 40px;
          font-weight: bold;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          padding-top: 12px;
          box-sizing: border-box;
          line-height: 52px;
        }
        .desc {
          width: 86%;
          font-size: 14px;
          margin-top: 12px;
        }
      }
    }
  }
}
</style>
