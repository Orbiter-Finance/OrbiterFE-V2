<template>
  <div class="lottery-card-group">
    <div class="lottery-card-content">
      <o-tooltip placement="top">
        <template v-slot:titleDesc>
          <div class="lottery-tooltip">
            <div>Your chances of flopping: {{ total }}</div>
            <div class="lottery-tooltip-bottom">
              Bridging ({{ progress.currentProgress }}/{{ progress.max }}) TX
              Get Flip
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
      </o-tooltip>
      <div v-if="total > 1" class="lottery-badge">
        <span>{{ total > 99 ? '99+' : total }}</span>
      </div>
      <div
        :style="{ display: isShow ? 'flex' : 'none' }"
        class="lottery-card-group-dialog"
      >
        <div class="lottery-dialog-card-container">
          <div class="lottery-dialog-card-centent">
            <div class="lottery-dialog-top-group">
              <div class="lottery-dialog-top-count">
                Your chances of flopping: {{ total }}
              </div>
            </div>

            <div class="lottery-dialog-card-group">
              <div
                :key="key"
                class="lottery-dialog-card"
                :class="`${
                  isShow
                    ? !isConfirm
                      ? 'lottery-dialog-card-animation'
                      : 'lottery-dialog-card-confirm-animation'
                    : ''
                }`"
              >
                <div class="lottery-dialog-card-face">
                  <div class="lottery-card-points">+{{ pointsNum }}</div>
                  <div class="lottery-card-points-rule">
                    Revealing cards to unlock <br /> <span>O-Points(1-20)</span> is
                    achievable by
                    <span>bridging 3 TXs.</span>
                  </div>
                </div>
                <div class="lottery-dialog-card-back"></div>
              </div>
            </div>

            <div class="lottery-dialog-confirm-group">
              <div
                @click.self="handleConfirm"
                class="lottery-dialog-confirm-count"
              >
                {{ !!total ? 'Continue' : 'Confirmed' }}
              </div>
            </div>

            <div class="lottery-bg-1-animation"></div>
            <div class="lottery-bg-2-animation"></div>
            <div class="lottery-bg-3-animation"></div>
          </div>
          <div class="lottery-dialog-close-group">
            <div @click.self="handleHidden" class="lottery-dialog-close"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  actDialogVisible,
  isStarkNetDialog,
  web3State,
  setActPoint,
  actAddPoint,
  actBasePoint,
  actTotalActivityPoint
} from '../../composition/hooks'

import {
  requestLotteryCard,
  requestLotteryCardDraw,
} from '../../common/openApiAx'

export default {
  name: 'HeaderLotteryCard',
  data() {
    return {
      total: 0,
      isShow: false,
      isConfirm: false,
      isPending: false,
      pointsNum: 0,
      key: 0,
      progress: {
        currentProgress: 0,
        max: 3,
      },
    }
  },
  computed: {
    currentWalletAddress() {
      if (!!isStarkNetDialog.value) {
        return web3State.starkNet.starkNetAddress
      }
      return web3State.coinbase
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
    mergeStatus() {
      return ({
        address: this.currentWalletAddress,
        dialog: this.selectWalletDialogVisible
      })
    }
  },
  watch: {
    mergeStatus(item1, item2) {

      if (item1.dialog && ((item1.address !== item2.address) || (item1.dialog !== item2.dialog))) {
        this.getLotteryCardData()
      }
    }
  },
  methods: {
    async handleShow() {
      if (!!this.total) {
        await this.getLotteryCardDataDraw()
        this.isShow = true
        await this.getLotteryCardData()
      }
    },
    handleHidden() {
      this.isShow = false
      this.isConfirm = false
      this.key=0
    },
    addKey() {
      this.key += 1
    },
    async handleConfirm() {
      if (this.total) {
        this.isConfirm = true
        await this.getLotteryCardDataDraw()

        if(!!this.key) {
          this.addKey()
        }
        await this.getLotteryCardData()
      } else {
        this.handleHidden()
      }
    },
    async getLotteryCardData() {
      const {
        data: { cardsCount = 0, progress },
        code,
        msg,
      } = await requestLotteryCard('/points_system/user/cards', {
        address: this.currentWalletAddress.toLocaleLowerCase(),
      })

      if (Number(code) === 0) {
        this.total = cardsCount
        this.progress = {
          ...this.progress,
          ...progress,
        }
      }
    },
    async getLotteryCardDataDraw() {
      const { data } = await requestLotteryCardDraw(
        '/points_system/user/card/draw',
        {
          address: this.currentWalletAddress.toLocaleLowerCase(),
        }
      )

  setActPoint({
    total: Number(actAddPoint) + Number(data.points || 0),
    basePoints: actBasePoint,
    totalActivityPoints: actTotalActivityPoint
  })

  
      this.pointsNum = data.points || 0
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
@keyframes card-show {
  0% {
    transform: rotateY(0deg) scale(0);
    display: none;
  }
  14.9% {
    transform: rotateY(0deg) scale(0.2);
    display: none;
  }
  15% {
    display: flex;
    transform: rotateY(0deg) scale(0.2);
  }
  50% {
    transform: rotateY(180deg) scale(1.2);
  }
  60% {
    transform: rotateY(180deg) scale(1);
  }
  100% {
    transform: rotateY(180deg) scale(1);
  }
}

@keyframes card-hidden {
  0% {
    display: flex;
    transform: rotateY(180deg) scale(1);
  }
  12% {
    transform: rotateY(0deg) scale(0.2);
  }
  15% {
    display: none;
    transform: rotateY(0deg) scale(0);
  }
  27.74% {
    transform: rotateY(0deg) scale(0.2);
    display: none;
  }
  27.75% {
    display: flex;
    transform: rotateY(0deg) scale(0.2);
  }
  57.5% {
    transform: rotateY(180deg) scale(1.2);
  }
  66% {
    transform: rotateY(180deg) scale(1);
  }
  100% {
    transform: rotateY(180deg) scale(1);
  }
}

@keyframes lottery-bg-1-animation {
  0% {
    display: block;
    opacity: 1;
    transform: scale(0.2);
  }
  10% {
    display: block;
    opacity: 1;
    transform: scale(0.2);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes lottery-bg-2-animation {
  0% {
    scale: 0;
    display: none;
  }
  66.6% {
    scale: 0;
    display: none;
  }
  66.7% {
    display: block;
    transform: scale(0.2);
  }
  80% {
    transform: scale(1.2);
  }
  90% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes lottery-bg-3-animation {
  0% {
    transform: scale(0);
    display: none;
  }
  66.6% {
    transform: scale(0);
    display: none;
  }
  66.7% {
    display: block;
    transform: rotate(0) scale(0.4);
  }
  95% {
    opacity: 1;
    transform: rotate(40deg) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: rotate(40deg);
  }
}

@keyframes fade-in {
  0%,
  60% {
    opacity: 0;
  }
  75%,
  100% {
    opacity: 1;
  }
}

.lottery-tooltip {
  font-size: 12px;
  line-height: 17px;
  margin-left: -20px;
  font-family: OpenSansRoman-Bold;
  color: #222222;
  .lottery-tooltip-bottom {
    margin-top: 8px;
    font-family: OpenSansRoman-Regular;
  }
}

.lottery-card-group {
  display: flex;
  justify-content: center;
  align-content: center;
  position: relative;
  top: 0;
  left: 0;
  z-index: 101;
  width: 20px;
  height: 100%;
  margin-left: 12px;
  line-height: normal;

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

.lottery-card-group-dialog {
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;

  .lottery-dialog-card-container {
    .lottery-dialog-card-centent {
      width: 456px;
      height: 456px;
      position: relative;
      top: 0;
      left: 0;

      .lottery-dialog-top-group {
        width: 100%;
        height: 40px;
        margin-bottom: 8px;
        display: flex;
        justify-content: center;
        align-content: center;
        animation: fade-in 4s forwards;
        -webkit-animation: fade-in 4s forwards;

        .lottery-dialog-top-count {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
          height: 100%;
          background: #000000;
          border-radius: 4px;
          font-size: 14px;
          line-height: 19px;
          font-family: OpenSansRoman-Regular;
          font-weight: 600;
        }
      }

      .lottery-dialog-card-group {
        width: 100%;
        display: flex;
        justify-content: center;
        height: calc(100% - 120px);
        .lottery-dialog-card {
          width: 52%;
          height: 100%;
          position: relative;
          justify-content: center;
          transform-origin: 50% 50% 0;
          transform-style: preserve-3d;
          .lottery-dialog-card-face {
            width: 100%;
            height: 100%;
            position: absolute;
            transform: rotateY(180deg);
            backface-visibility: hidden;
            background-image: url('../../assets/activity/header_lottery_card/card-info.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            display: flex;
            flex-direction: column;

            .lottery-card-points {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 120px;
              height: 120px;
              background-image: url('../../assets/activity/header_lottery_card/points.png');
              background-repeat: no-repeat;
              background-position: center;
              background-size: contain;
              margin: 29% auto auto;
              font-size: 32px;
              font-family: OpenSansRoman-ExtraBold;
              line-height: 43px;
              text-shadow: 2px 2px 0px #000000;
            }

            .lottery-card-points-rule {
              width: 75%;
              text-align: center;
              font-family: OpenSansRoman-Regular;
              margin: auto auto 34px;
              font-size: 13px;
              line-height: 18px;
              word-wrap: normal;
              white-space: break-spaces;
              color: #666666;
              & > span {
                font-family: OpenSansRoman-SemiBold;
                color: #222222;
              }
            }
          }
          .lottery-dialog-card-back {
            width: 100%;
            height: 100%;
            position: absolute;
            backface-visibility: hidden;
            background-image: url('../../assets/activity/header_lottery_card/card-bg.png');
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }
        }
      }

      .lottery-dialog-confirm-group {
        width: 100%;
        height: 52px;
        margin-top: 36px;
        display: flex;
        justify-content: center;
        align-content: center;
        animation: fade-in 4s forwards;
        -webkit-animation: fade-in 4s forwards;

        .lottery-dialog-confirm-count {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40%;
          height: 100%;
          font-family: OpenSansRoman-ExtraBold;
          background-image: url('../../assets/activity/header_lottery_card/confirm.png');
          background-repeat: no-repeat;
          font-size: 18px;
          line-height: 24px;
          background-position: center;
          background-size: contain;
          font-weight: 800;
          cursor: pointer;
        }
      }
    }

    .lottery-dialog-close-group {
      width: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      margin-top: 42px;
      .lottery-dialog-close {
        width: 32px;
        height: 32px;
        background-image: url('../../assets/activity/header_lottery_card/close.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        animation: fade-in 4s forwards;
        -webkit-animation: fade-in 4s forwards;
        cursor: pointer;
      }
    }
  }

  .lottery-dialog-card-animation {
    animation: card-show 3s forwards;
    -webkit-animation: card-show 3s forwards;
  }

  .lottery-dialog-card-confirm-animation {
    animation: card-hidden 3.5s forwards;
    -webkit-animation: card-hidden 3.5s forwards;
  }

  .lottery-bg-1-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-1.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-1-animation 3s forwards;
    -webkit-animation: lottery-bg-1-animation 3s forwards;
  }
  .lottery-bg-2-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-2-animation 3s forwards;
    -webkit-animation: lottery-bg-2-animation 3s forwards;
  }
  .lottery-bg-3-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -3;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-3.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-3-animation 3s forwards;
    -webkit-animation: lottery-bg-3-animation 3s forwards;
  }
}
</style>
