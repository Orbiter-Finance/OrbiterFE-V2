<template>
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
            class="lottery-dialog-card"
            :class="`${
              isShow
                ? !isConfirm
                  ? 'lottery-dialog-card-animation'
                  : !!(key % 2)
                  ? 'lottery-dialog-card-confirm-animation'
                  : 'lottery-dialog-card-confirm-animation-next'
                : ''
            }`"
          >
            <div class="lottery-dialog-card-face">
              <div class="lottery-card-points">+{{ pointsNum }}</div>
              <div class="lottery-card-points-rule">
                Revealing cards to unlock <br />
                <span>O-Points(1-20)</span> is achievable by
                <span>bridging 3 TXs.</span>
              </div>
            </div>
            <div class="lottery-dialog-card-back"></div>
          </div>
        </div>

        <div class="lottery-dialog-confirm-group">
          <div
            v-if="!disabled"
            @click.self="handleConfirm"
            class="lottery-dialog-confirm-count"
          >
            {{ !!total ? 'Continue' : 'Confirmed' }}
          </div>
        </div>

        <div
          :key="'bg-1' + key"
          class="lottery-bg-1-animation"
          :class="
            isShow
              ? key > 0 && !!isConfirm
                ? 'lottery-bg-animation-next'
                : ''
              : ''
          "
        ></div>
        <div
          :key="'bg-2' + key"
          class="lottery-bg-2-animation"
          :class="
            isShow
              ? key > 0 && !!isConfirm
                ? 'lottery-bg-animation-next'
                : ''
              : ''
          "
        ></div>
        <div
          :key="'bg-3' + key"
          class="lottery-bg-3-animation"
          :class="
            isShow
              ? key > 0 && !!isConfirm
                ? 'lottery-bg-animation-next'
                : ''
              : ''
          "
        ></div>
      </div>
      <div class="lottery-dialog-close-group">
        <div
          @click.self="handleHidden"
          v-if="!disabled"
          class="lottery-dialog-close"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  actDialogVisible,
  isStarkNetDialog,
  web3State,
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
} from '../../composition/hooks'
import util from '../../util/util'

import {
  requestLotteryCard,
  requestLotteryCardDraw,
  requestPointSystem,
} from '../../common/openApiAx'

import { compatibleGlobalWalletConf } from '../../composition/walletsResponsiveData'

export default {
  name: 'HeaderLotteryCardDialog',
  data() {
    return {
      isConfirm: false,
      isPending: false,
      disabled: false,
      key: 0,
    }
  },
  computed: {
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
      return lotteryCardTotal.value
    },
    isShow() {
      return lotteryCardModalShow.value
    },
    isMobile() {
      return isMobile.value
    },
    currentWalletAddress() {
      if (!!isStarkNetDialog.value) {
        return web3State.starkNet.starkNetAddress
      }
      return web3State.coinbase
    },
    selectWalletDialogVisible() {
      return actDialogVisible.value
    },
    walletAddress() {
      return [
        compatibleGlobalWalletConf.value.walletPayload.walletAddress,
        web3State.starkNet.starkNetAddress,
        ...[],
      ]
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
  methods: {
    handleHidden() {
      setLotteryCardModalShow(false)
      this.isConfirm = false
      this.key = 0
    },
    handleRefresh() {
      this.key += 1
    },
    getAddress() {
      let addressGroup = {
        isAddress: false,
        address: '',
      }
      const [web3Address, starkNetAddress] = this.walletAddress
      const address = !!isStarkNetDialog.value ? starkNetAddress : web3Address
      const isStarknet = !!isStarkNetDialog.value
      if (!address || util.getAccountAddressError(address || '', isStarknet)) {
        return addressGroup
      }
      return {
        ...addressGroup,
        isAddress: true,
        address,
      }
    },
    async handleConfirm() {
      if (!this.disabled) {
        if (Number(this.total) > 0) {
          this.disabled = true
          await this.getLotteryCardDataDraw(true)

          await this.getLotteryCardData()
        } else {
          this.handleHidden()
        }
      }
    },

    async getLotteryCardDataDraw(isRefresh) {
      const { data } = await requestLotteryCardDraw(
        'user/card/draw',
        {
          address: this.currentWalletAddress?.toLocaleLowerCase(),
        }
      )

      if (!!isRefresh) {
        this.handleRefresh()
        if (!this.isConfirm) {
          this.isConfirm = true
        }
      }
      const point = data?.points || 0
      this.disabled = false

      if (Number(point)) {
        setActAddPoint(String(point))

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
      }
    },
    async getLotteryCardData() {
      const {
        data: { cardsCount = 0, progress },
        code,
      } = await requestLotteryCard('user/cards', {
        address: this.currentWalletAddress?.toLocaleLowerCase(),
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
@keyframes lottery-bg-empty {
  0% {
    display: none;
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    display: none;
    transform: scale(0);
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

@keyframes card-hidden-next {
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
    display: none;
  }
  9.99% {
    display: none;
    opacity: 0;
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
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes lottery-bg-2-animation {
  0% {
    transform: scale(0);
    opacity: 1;
    display: none;
  }
  66.6% {
    transform: scale(0);
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
    transform: scale(0) rotate(0);
    opacity: 1;
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

.lottery-card-group-dialog {
  color: #ffffff;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1200;
  -webkit-transform: translate3d(-50%, -50%, 1px);
  -moz-transform: translate3d(-50%, -50%, 1px);
  -o-transform: translate3d(-50%, -50%, 1px);
  transform: translate3d(-50%, -50%, 1px);

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
          z-index: 4;
          justify-content: center;
          transform-origin: 50% 50% 0;
          transform-style:preserve-3d;

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
          z-index: 2;
          font-weight: 800;
          cursor: pointer;
          animation: fade-in 4s forwards;
          -webkit-animation: fade-in 4s forwards;
        }
      }
    }

    .lottery-dialog-close-group {
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: center;
      align-content: center;
      margin-top: 42px;
      .lottery-dialog-close {
        width: 32px;
        height: 100%;
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

  .lottery-dialog-card-confirm-animation-next {
    animation: card-hidden-next 3.5s forwards;
    -webkit-animation: card-hidden-next 3.5s forwards;
  }

  .lottery-bg-1-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-1.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-1-animation 3s forwards;
    -webkit-animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-1-animation 3s forwards;
  }

  .lottery-bg-animation-next {
  }
  .lottery-bg-2-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-2-animation 3s forwards;
    -webkit-animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-2-animation 3s forwards;
  }

  .lottery-bg-3-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: url('../../assets/activity/header_lottery_card/lottery-bg-3.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-3-animation 3s forwards;
    -webkit-animation: lottery-bg-empty 0.525s forwards,
      lottery-bg-3-animation 3s forwards;
  }
}
</style>
