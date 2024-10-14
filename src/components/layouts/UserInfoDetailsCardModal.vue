<template>
  <div
    id="user-info-card-modal"
    class="user-info-card-modal"
    @click="close"
    :style="`display: ${userInfoDetailsCardModalShow ? 'flex' : 'none'}`"
  >
    <div class="card-content">
      <div class="card-title">
        <div class="label">{{ $t("Details") }}</div>
        <div @click="close">
          <svg-icon iconName="close" class="close"></svg-icon>
        </div>
      </div>
      <div class="card-info">
        <div class="label">{{ $t("Total O-Points") }}</div>
        <div class="amount">{{ totalPoint }}</div>
        <div class="opints-content">
          <div class="options-default base-options-group">
            <div class="options-label">
              <div class="option-title">{{ $t("Basic points") }}</div>
              <o-tooltip>
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span>
                      {{ $t("Basic contribution rewards for using Orbiter Finance for bridge transactions") }}
                    </span>
                    <a
                      class="points_more"
                      href="https://docs.orbiter.finance/o-points#basic-points-and-exchange-standards"
                      target="_blank"
                      >{{ $t("More") }}</a
                    >
                  </div>
                </template>
                <img
                  class="thumbnail_1_3"
                  :src="require('../../assets/activity/tip_ico.png')"
                />
              </o-tooltip>
            </div>
            <div class="option-amount">{{ actBasePoint }}</div>
          </div>
          <div class="options-default activity-options-group">
            <div class="options-label">
              <div class="option-title">{{ $t("Activity points") }}</div>
              <o-tooltip>
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span
                      >{{ $t("Task rewards for participating in Orbiter Finance-related activities") }}</span
                    >
                    <a
                      class="points_more"
                      href="https://docs.orbiter.finance/o-points#activity-points-and-exchange-standards"
                      target="_blank"
                      >{{ $t("More") }}</a
                    >
                  </div>
                </template>
                <img
                  class="thumbnail_1_3"
                  :src="require('../../assets/activity/tip_ico.png')"
                />
              </o-tooltip>
            </div>
            <div class="option-amount">{{ actTotalActivityPoint }}</div>
          </div>
          <div class="options-default ecosystem-options-group">
            <div class="options-label">
              <div class="option-title">{{ $t("Ecosystem Points")}}</div>
              <o-tooltip>
                <template v-slot:titleDesc>
                  <div style="margin-left: -20px">
                    <span>
                      {{ $t("Rewards for interacting with orbiter's ecosystem dapp based on orbiter cross-rollup protocols") }}
                    </span>
                    <!-- <a class="points_more" href="https://docs.orbiter.finance/o-points#basic-points-and-exchange-standards" target="_blank">{{ $t("More") }}</a> -->
                  </div>
                </template>
                <img
                  class="thumbnail_1_3"
                  :src="require('../../assets/activity/tip_ico.png')"
                />
              </o-tooltip>
            </div>
            <div class="option-amount">{{ actEcosystemPoints }}</div>
          </div>
        </div>
      </div>

      <div class="nft-label">{{$t("Held Orbiter NFT")}}</div>

      <div class="nft-card">
        <div
          v-for="(item, index) in nftList"
          :key="index"
          class="nft-card-item"
          :style="`background: url(${require('../../assets/activity/nft/' +
            item.img)});background-size: 100% 100%;border:${item.border};opacity:${item.holder ? '1' : '0.4'};`"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  setUserInfoDetailsCardModalShow,
  userInfoDetailsCardModalShow,
  actNftList,
  actTotalPoint,
  actBasePoint,
  actEcosystemPoints,
  actTotalActivityPoint,
} from '../../composition/hooks'
import SvgIcon from '../SvgIcon/SvgIcon.vue'
export default {
  name: 'UserInfoDetailsCardModal',
  computed: {
    userInfoDetailsCardModalShow() {
      return userInfoDetailsCardModalShow.value
    },
    nftList() {
      const nftImageList = [
        {
          img: '0x4a0E7cf70E2816De8e6c30f67968575d17925A55.png',
          border: '0 none',
        },
        {
          img: '0x5B9b40c26f6FBD053840A212A0627C55db8ea28c.png',
          border: '0 none',
        },
        {
          img: '0x83Ed3B8a9DCA0A3d40A9be9F7aeE0E58F7918c4C.png',
          border: '0 none',
        },
        {
          img: '0xBC2B5d07E8658D74176E3044Fd60B38d08f926A4.png',
          border: '0 none',
        },
        {
          img: '0xe20847F3C593296613Df763afE7eA039D8398E78.png',
          border: '0 none',
        },
        {
          img: '0x98f2bf4408fae2b6acb7f875efd7c587b593615c.png',
          border: '2.5px solid rgba(0, 0, 0, 1)',
        },
      ]
      const list = actNftList.value

      return nftImageList.map((item) => {

        return {
          ...item,
          img: item.img.toLocaleLowerCase(),
          holder: list.some((option)=> option.img.toLocaleLowerCase() === item.img.toLocaleLowerCase() )
        }
      })
    },
    totalPoint() {
      return actTotalPoint.value
    },
    actBasePoint() {
      return actBasePoint.value
    },
    actEcosystemPoints() {
      return actEcosystemPoints.value
    },
    actTotalActivityPoint() {
      return actTotalActivityPoint.value
    },
  },
  methods: {
    clickCard(event) {
      event.stopPropagation()
      event.preventDefault()
    },
    close() {
      setUserInfoDetailsCardModalShow(false)
    },
  },
}
</script>

<style lang="scss" scoped>
.user-info-card-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;

  .card-content {
    width: 100%;
    max-width: 440px;
    border-radius: 20px;
    background: rgb(255, 255, 255);
    padding: 24px;

    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        font-size: 18px;
        font-weight: 700;
        line-height: 25px;
        letter-spacing: 0px;
      }

      .close {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }

    .card-info {
      margin-top: 12px;
      width: 100%;
      padding: 20px 0 0;
      background-image: url(../../assets/activity/details-card-bg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      border-radius: 16px;
      .label {
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        line-height: 19px;
        color: rgba(255, 255, 255, 0.6);
        padding: 0 20px;
      }

      .amount {
        width: 100%;
        text-align: left;
        color: #fff;
        font-size: 34px;
        font-weight: 800;
        line-height: 46px;
        letter-spacing: 0px;
        margin-top: 8px;
        padding: 0 20px;
      }

      .opints-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        border-top: 1px solid #666666;
        padding: 8px 20px 20px;
        background-color: #000;
        border-radius: 0 0 16px 16px;

        .options-default {
          flex: 1;
          text-align: left;
          color: #fff;
          .options-label {
            display: flex;
            justify-content: start;
            align-items: center;
            white-space: nowrap;

            .option-title {
              font-size: 12px;
              font-weight: 400;
              line-height: 16px;
              letter-spacing: 0px;
              margin-right: 6px;
              opacity: 0.6;
            }
          }

          .option-amount {
            margin-top: 4px;
            font-size: 16px;
            font-weight: 700;
            line-height: 22px;
            letter-spacing: 0px;
          }
        }
      }
    }

    .nft-label {
      width: 100%;
      margin-top: 20px;
      text-align: left;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0px;
    }

    .nft-card {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .nft-card-item {
        width: 30%;
        margin-top: 12px;
        border-radius: 5px;
        padding: 18% 0;
      }
    }
  }

  .thumbnail_1_3 {
    width: 16px;
    height: 16px;
  }
}
</style>
