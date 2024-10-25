<template>
  <div class="lottery-card-group">
    <div class="lottery-card-content">
      <CommCardTooltip
        :visible="visible"
        :trigger="isMobile ? 'click' : 'hover'"
        placement="top"
      >
        <template v-slot:titleDesc>
          <div class="lottery-tooltip">
            <div>{{ $t("Your chances of flopping") }}: {{ total }}</div>
            <div class="lottery-tooltip-bottom">
              {{ $t("Bridging TX Get Flip", [`${currentProgress}/${max}`]) }}
            </div>
          </div>
        </template>
        <img
          @click="handleShow"
          :class="!!total ? 'lottery-img-hover' : 'lottery-img'"
          :src="
            require('../../assets/activity/header_lottery_card/' +
              `${!!total ? 'card' : 'card_disable'}` +
              '.png')
          "
        />
      </CommCardTooltip>
      <div v-if="total > 1" class="lottery-badge">
        <span>{{ total > 99 ? '99+' : total }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  actDialogVisible,
  actTotalPoint,
  setActPoint,
  setActAddPoint,
  setActAddPointVisible,
  isMobile,
  lotteryPointsNum,
  lotteryCardTotal,
  lotteryCardModalShow,
  lotteryCardCurrentProgress,
  lotteryCardProgressMax,
  setLotteryCardTotal,
  setLotteryCardModalShow,
  setLotteryPointsNum,
  setLotteryCardProgress,
  setActPointFetchStatus,
  actConnectWalletInfo
} from '../../composition/hooks'

import {
  requestLotteryCard,
  requestLotteryCardDraw,
  requestPointSystem,
} from '../../common/openApiAx'

import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'
import CommCardTooltip from '../CommCardTooltip.vue'

let timer

export default {
  name: 'HeaderLotteryCard',
  components: {
    CommCardTooltip,
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    connectWalletInfo(){
      return actConnectWalletInfo.value
    },
    currentProgress() {
      return lotteryCardCurrentProgress.value
    },
    max() {
      return lotteryCardProgressMax.value
    },
    pointsNum() {
      return lotteryPointsNum.value
    },
    total() {
      return Number(lotteryCardTotal.value)
    },
    isShow() {
      return lotteryCardModalShow.value
    },
    isMobile() {
      return isMobile.value
    },
    currentWalletAddress() {
      return this.connectWalletInfo?.address || ""
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
    mergeStatus() {
      return {
        address: this.currentWalletAddress,
        dialog: this.selectWalletDialogVisible,
      }
    },
    actTotalPointValue() {
      return actTotalPoint.value
    },
  },
  watch: {
    mergeStatus(item1, item2) {
      if (
        item1.dialog &&
        (item1.address !== item2.address || item1.dialog !== item2.dialog)
      ) {
        this.getLotteryCardData()
      }
    },
    selectWalletDialogVisible(status) {
      if (!status) {
        setLotteryCardTotal(0)
        setLotteryCardProgress({
          lotteryCardCurrentProgress: 0,
          lotteryCardProgressMax: 3,
        })
      }
    },
  },
  methods: {
    async handleShow() {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        if (!this.visible && this.isMobile) {
          this.visible = true
        } else {
          this.visible = false
          if (!!this.total) {
              await this.getLotteryCardDataDraw()
              await this.getLotteryCardData()
          }
        }
      }, 500);

    },
    getAddress() {
      const isAddress = !!this.connectWalletInfo?.isConnect
      const address = this.connectWalletInfo?.address
      let addressGroup = {
        isAddress,
        address,
        group: this.fromGroup
      }
      return addressGroup
    },

    async getLotteryCardDataDraw() {
      try {
        const { data } = await requestLotteryCardDraw('user/card/draw', {
          address: this.currentWalletAddress
        })
        const point = data?.points || ''

        if (Number(point)) {
          setActAddPoint(String(point))
          setLotteryCardModalShow(true)

          setTimeout(() => {
            setLotteryPointsNum(point)
            setActAddPointVisible(true)
            setTimeout(() => {
              setActAddPointVisible(false)
            }, 3000)
          }, 1000)
          setTimeout(async () => {
            await this.getWalletAddressPoint()
          }, 0)
        } else {
          this.$notify.error({
            title: this.$t('Failed to draw card O-Points'),
            duration: 3000,
          })
        }
      } catch (error) {
        this.$notify.error({
          title: this.$t('Failed to draw card O-Points'),
          duration: 3000,
        })
      }
    },
    async getLotteryCardData() {
      const {
        data: { cardsCount = 0, progress },
        code,
      } = await requestLotteryCard('user/cards', {
        address: this.currentWalletAddress
      })

      if (Number(code) === 0) {
        setLotteryCardTotal(cardsCount)
        setLotteryCardProgress({
          lotteryCardCurrentProgress: progress.currentProgress || 0,
          lotteryCardProgressMax: progress.max || 0,
        })
      }
    },
    async getWalletAddressPoint() {
      const { isAddress, address } = this.getAddress()

      if (isAddress) {
        setActPointFetchStatus()
        const pointRes = await requestPointSystem('v2/user/points', {
          address,
        })
        setActPoint(pointRes.data)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes card-rotate {
  0%,
  84%,
  88%,
  92%,
  96%,
  100% {
    transform: rotate(0);
  }
  86%,
  94% {
    transform: rotate(-15deg);
  }
  90%,
  98% {
    transform: rotate(15deg);
  }
}

.lottery-tooltip {
  font-size: 12px;
  line-height: 17px;
  margin-left: -20px;
  font-family: GeneralSans-Bold;
  .lottery-tooltip-bottom {
    margin-top: 8px;
    font-family: GeneralSans-Regular;
  }
}

.lottery-card-group {
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  margin-left: 12px;
  line-height: 38px;

  .lottery-card-content {
    height: 30px;

    .lottery-img {
      width: 100%;
      height: 100%;
    }

    .lottery-img-hover {
      width: 100%;
      cursor: pointer;
      animation: card-rotate 4s infinite;
      -webkit-animation: card-rotate 4s infinite;
      &:hover {
        border: 1px solid #c4382b;
      }
    }

    .lottery-badge {
      display: flex;
      justify-content: center;
      align-content: center;
      width: 22px;
      height: 12px;
      position: absolute;
      bottom: 0;
      right: 0;
      background-image: url('../../assets/activity/header_lottery_card/badge.png');
      background-repeat: no-repeat;
      font-size: 12px;
      transform: translateX(50%);
      background-position: center;
      background-size: contain;
      & > span {
        font-size: 12px;
        zoom: 0.87;
        line-height: 13px;
      }
    }
  }
}
</style>
