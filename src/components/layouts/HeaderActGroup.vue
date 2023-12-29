<template>
  <div class="act-quests-container">
    <div class="act-quests-group">
      <div class="act-quests-title-group">
        <div class="act-quests-title">Extra Rewards 🎁</div>
        <div v-if="!!countTime" class="act-quests-count-down">
          <div class="text-wrapper_1_46">
            <span class="text_1_69">{{ countDownDate }}</span>
          </div>
          <div class="act-time-inv">:</div>
          <div class="text-wrapper_1_46">
            <span class="text_1_69">{{ countDownHour }}</span>
          </div>
          <div class="act-time-inv">:</div>
          <div class="text-wrapper_1_46">
            <span class="text_1_69">{{ countDownMin }}</span>
          </div>
          <div class="act-time-inv">:</div>
          <div class="text-wrapper_1_46">
            <span class="text_1_69">{{ countDownSecond }}</span>
          </div>
        </div>
      </div>
      <template v-for="(item, index) in dataList">
        <div :key="index">
          <div
            v-if="item.status === 0"
            class="box_1"
            @click="openUrl('https://www.layer220.io/', item.status)"
          >
            <div class="text-wrapper_1 flex-row">
              <span class="text_1">{{ item.points }}</span>
              <span class="text_2">O-Points</span>
            </div>
            <div class="border-dashed"></div>
            <div class="act_quests_group_right">
              <div class="text_3" v-html="item.description"></div>
              <div
                style="
                  margin-top: 10px;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div class="box_flex_1">
                  <div
                    v-for="tag in item.tags"
                    class="text-wrapper_17 flex-col"
                  >
                    <span class="text_27">{{ tag.description }}</span>
                  </div>
                  <div class="text-wrapper_18">
                    <span class="text_28" v-if="!!item.progress">{{
                      item.progress
                        ? `${item.progress.current}/${item.progress.total}`
                        : '0/0'
                    }}</span>
                    <span v-else class="text_28">Undone</span>
                  </div>
                </div>
                <div class="box_go"></div>
              </div>
            </div>
          </div>
          <div v-else class="box_2">
            <div class="text-wrapper_1 flex-row">
              <span class="text_1">{{ item.points }}</span>
              <span class="text_2">O-Points</span>
            </div>
            <div class="border-dashed"></div>
            <div class="act_quests_group_right">
              <div class="text_3" v-html="item.description"></div>
              <div
                style="
                  margin-top: 10px;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div class="box_flex_1">
                  <div
                    v-for="tag in item.tags"
                    class="text-wrapper_17 flex-col"
                  >
                    <span class="text_27">{{ tag.description }}</span>
                  </div>
                  <div class="text-wrapper_18">
                    <span v-if="!!item.progress" class="text_28">Done</span>
                    <span v-else class="text_28">Undone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderActGroup',
  props: {
    dataList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      countTime: false,
      countDownSecond: '00',
      countDownMin: '00',
      countDownHour: '00',
      countDownDate: '00',
    }
  },
  computed: {
    isLightMode() {
      return this.$store.state.themeMode === 'light'
    },
  },

  methods: {
    countDown() {
      console.log('dataList', this.dataList)
      const endTime = this.dataList[0].endTime || 0

      const diffSecond = Math.floor((+new Date(endTime) - +new Date()) / 1000)

      if (diffSecond < 0 || !endTime) {
        this.countTime = []
        return
      }

      const countDownSecond = this.fillDouble(diffSecond % 60)

      const countDownMin = this.fillDouble(
        Math.floor((diffSecond % (60 * 60)) / 60)
      )
      const countDownHour = this.fillDouble(
        Math.floor((diffSecond % (60 * 60 * 24)) / (60 * 60))
      )
      const countDownDate = this.fillDouble(
        Math.floor((diffSecond % (60 * 60 * 24 * 365)) / (60 * 60 * 24))
      )

      this.countDownDate = countDownDate
      this.countDownHour = countDownHour
      this.countDownMin = countDownMin
      this.countDownSecond = countDownSecond

      this.countTime = true
    },
    fillDouble(num) {
      if (String(num).length === 1) {
        return '0' + String(num)
      }
      return String(num)
    },
    openUrl(url, status) {
      if (!Number(status)) {
        window.open(url, '_blank')
      }
    },
  },
  mounted() {
    setInterval(() => {
      this.countDown()
    }, 1000)
  },
}
</script>
<style lang="scss" scoped>
.act-quests-container {

    width: 100%;
    padding: 0 16px;

  .act-quests-group {
    width: 100%;
    background: url('../../assets/activity/quests_bg.png') no-repeat;
    background-size: 100% 100%;
    padding: 12px 16px 16px;
    box-sizing: border-box;
    border-radius: 0 0 12px 12px;

    .act-quests-title-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .act-quests-title {
        font-family: OpenSansRoman-Regular;
        font-size: 14px;
        color: #ffffff;
      }
      .act-quests-count-down {
        display: flex;
        flex: 1;
        justify-content: flex-end;
        color: #ffffff;
        align-items: center;

        .act-time-inv {
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .text-wrapper_1_46 {
          background-color: rgba(238, 238, 238, 1);
          border-radius: 5px;
          height: 20px;
          margin-left: 1px;
          width: 20px;
          display: flex;
          justify-content: center;
          align-content: center;
          .text_1_69 {
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: OpenSansRoman-ExtraBold;
            text-align: center;
            white-space: nowrap;
            zoom: 0.91;
            line-height: 20px;
          }
        }
      }
    }

    .box_1 {
      display: flex;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      border: 1px solid rgba(34, 34, 34, 1);
      margin-top: 12px;
      height: 88px;
      cursor: pointer;

      .text-wrapper_1 {
        width: 58px;
        height: 64px;
        background: url('../../assets/activity/wrapper_bg_1.png') -2px 0px no-repeat;
        background-size: 60px 66px;
        margin: 12px;
        padding-top: 5px;
        box-shadow: -2px 2px 0px 0px #000000;
        border-radius: 8px;
        border: 1px solid #222222;
        display: flex;
        flex-direction: column;
        text-align: center;
        .text_1 {
          width: 100%;
          height: 33px;
          color: #000000;
          font-size: 24px;
          font-family: OpenSansRoman-Bold;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 33px;
        }

        .text_2 {
          width: 100%;
          height: 17px;
          overflow-wrap: break-word;
          color: #000000;
          font-size: 12px;
          font-family: OpenSansRoman-SemiBold;
          text-align: center;
          white-space: nowrap;
          line-height: 17px;
        }
      }

      .border-dashed {
        border-right: 1px dashed #000;
        width: 1px;
        height: 80px;
        margin: 4px 0;
        font-weight: 700;
      }

      .act_quests_group_right {
        flex: 1;
        padding: 12px;
        font-size: 12px;
        font-family: OpenSansRoman-SemiBold;

        .text_3 {
          width: 96%;
          height: 34px;
          overflow-wrap: break-word;
          color: rgba(34, 34, 34, 1);
          font-size: 13px;
          font-family: OpenSansRoman-Bold;
          text-align: left;
          line-height: 18px;
        }

        .box_flex_1 {
          display: flex;
          justify-content: start;
          align-content: center;
          flex: 1;
          .text-wrapper_17 {
            height: 20px;
            background: url('../../assets/activity/fee_tag_undone_1.png') 100%
              no-repeat;
            background-size: 100% 100%;

            .text_27 {
              height: 17px;
              overflow-wrap: break-word;
              color: rgba(255, 255, 255, 1);
              font-size: 12px;
              font-family: OpenSansRoman-Bold;
              text-align: left;
              white-space: nowrap;
              line-height: 17px;
              margin: 1px 8px;
              zoom: 0.87;
            }
          }

          .text-wrapper_18 {
            padding: 0 8px;
            height: 20px;
            background: url('../../assets/activity/light_tag_undone.png') 100%
              no-repeat;
            background-size: 100% 100%;
            margin-left: 2px;
            /*width: 35px;*/

            .text_28 {
              width: 35px;
              height: 17px;
              overflow-wrap: break-word;
              color: rgba(34, 34, 34, 1);
              font-size: 12px;
              font-family: OpenSansRoman-SemiBold;
              text-align: left;
              white-space: nowrap;
              line-height: 17px;
            }
          }
        }
        .box_go {
          width: 32px;
          height: 20px;
          background: url('../../assets/activity/go.png') 100% no-repeat;
          background-size: 100% 100%;
          margin-left: 2px;
        }
      }

      .text-wrapper_3 {
        background: url('../../assets/activity/wrapper_3.png') 100% no-repeat;
        border-radius: 8px;
        position: relative;
        width: 58px;
        height: 64px;
        background-size: 60px 66px;
        margin: 12px 0 0 12px;
        padding-top: 5px;

        .text_6 {
          width: 14px;
          height: 33px;
          font-size: 24px;
          font-family: OpenSansRoman-Bold;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 33px;
          color: rgba(153, 153, 153, 1);
        }

        .text_7 {
          position: absolute;
          left: 4px;
          top: 36px;
          width: 21px;
          height: 17px;
          overflow-wrap: break-word;
          font-size: 12px;
          font-family: OpenSansRoman-SemiBold;
          text-align: center;
          white-space: nowrap;
          line-height: 17px;
          color: rgba(153, 153, 153, 1);
        }
      }

      .border-dashed_2 {
        position: absolute;
        border-top: 1px dashed #eeeeee;
        transform: rotate(90deg);
        width: 76px;
        left: 44px;
        top: 44px;
        font-weight: 700;
      }

      .text_8 {
        width: 90%;
        height: 34px;
        overflow-wrap: break-word;
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
        font-family: OpenSansRoman-SemiBold;
        text-align: left;
        line-height: 17px;
      }

      .text_29 {
        width: 76px;
        height: 17px;
        overflow-wrap: break-word;
        color: rgba(134, 136, 150, 1);
        font-size: 12px;
        font-family: OpenSansRoman-Bold;
        font-weight: 700;
        text-align: left;
        white-space: nowrap;
        line-height: 17px;
        margin: 1px 8px;
      }

      .text-wrapper_4 {
        height: 20px;
        background: url('../../assets/activity/light_tag_done.png') 100%
          no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
        width: 47px;

        .text_9 {
          width: 31px;
          height: 17px;
          overflow-wrap: break-word;
          color: rgba(153, 153, 153, 1);
          font-size: 12px;
          font-family: OpenSansRoman-Regular;
          text-align: left;
          white-space: nowrap;
          line-height: 17px;
        }
      }
    }

    .box_2 {
      display: flex;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 8px;
      border: 1px solid rgb(238, 238, 238);
      margin-top: 12px;
      height: 88px;

      .text-wrapper_1 {
        width: 58px;
        height: 64px;
        background: url('../../assets/activity/wrapper_3.png') -2px 0px no-repeat;
        background-size: 60px 66px;
        margin: 12px;
        padding-top: 5px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        text-align: center;
        .text_1 {
          width: 100%;
          height: 33px;
          color: rgb(153, 153, 153);
          font-size: 24px;
          font-family: OpenSansRoman-Bold;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 33px;
        }

        .text_2 {
          width: 100%;
          height: 17px;
          overflow-wrap: break-word;
          color: rgb(153, 153, 153);
          font-size: 12px;
          font-family: OpenSansRoman-SemiBold;
          text-align: center;
          white-space: nowrap;
          line-height: 17px;
        }
      }

      .border-dashed {
        border-right: 1px dashed rgb(153, 153, 153);
        width: 1px;
        height: 80px;
        margin: 4px 0;
        font-weight: 700;
      }

      .act_quests_group_right {
        flex: 1;
        margin: 12px;
        font-size: 12px;
        font-family: OpenSansRoman-SemiBold;

        .text_3 {
          width: 96%;
          height: 34px;
          overflow-wrap: break-word;
          color: rgb(153, 153, 153);
          font-size: 13px;
          font-family: OpenSansRoman-Bold;
          text-align: left;
          line-height: 18px;
        }

        .box_flex_1 {
          display: flex;
          justify-content: start;
          align-content: center;
          flex: 1;
          .text-wrapper_17 {
            height: 20px;
            background: url('../../assets/activity/fee_light_tag_done.png') 100%
              no-repeat;
            background-size: 100% 100%;

            .text_27 {
              height: 17px;
              overflow-wrap: break-word;
              color: rgb(134, 136, 150);
              font-size: 12px;
              font-family: OpenSansRoman-Bold;
              text-align: left;
              white-space: nowrap;
              line-height: 17px;
              margin: 1px 8px;
            }
          }

          .text-wrapper_18 {
            padding: 0 8px;
            height: 20px;
            background: url('../../assets/activity/light_tag_undone.png') 100%
              no-repeat;
            background-size: 100% 100%;
            margin-left: 2px;
            /*width: 35px;*/

            .text_28 {
              width: 35px;
              height: 17px;
              overflow-wrap: break-word;
              color: rgb(153, 153, 153);
              font-size: 12px;
              font-family: OpenSansRoman-SemiBold;
              text-align: left;
              white-space: nowrap;
              line-height: 17px;
            }
          }
        }
        .box_go {
          width: 32px;
          height: 20px;
          background: url('../../assets/activity/go.png') 100% no-repeat;
          background-size: 100% 100%;
          margin-left: 2px;
        }
      }

      .text-wrapper_3 {
        background: url('../../assets/activity/wrapper_3.png') 100% no-repeat;
        border-radius: 8px;
        position: relative;
        width: 58px;
        height: 64px;
        background-size: 60px 66px;
        margin: 12px 0 0 12px;
        padding-top: 5px;

        .text_6 {
          width: 14px;
          height: 33px;
          font-size: 24px;
          font-family: OpenSansRoman-Bold;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 33px;
          color: rgba(153, 153, 153, 1);
        }

        .text_7 {
          position: absolute;
          left: 4px;
          top: 36px;
          width: 21px;
          height: 17px;
          overflow-wrap: break-word;
          font-size: 12px;
          font-family: OpenSansRoman-SemiBold;
          text-align: center;
          white-space: nowrap;
          line-height: 17px;
          color: rgba(153, 153, 153, 1);
        }
      }

      .border-dashed_2 {
        position: absolute;
        border-top: 1px dashed #eeeeee;
        transform: rotate(90deg);
        width: 76px;
        left: 44px;
        top: 44px;
        font-weight: 700;
      }

      .text_8 {
        width: 90%;
        height: 34px;
        overflow-wrap: break-word;
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
        font-family: OpenSansRoman-SemiBold;
        text-align: left;
        line-height: 17px;
      }

      .text_29 {
        width: 76px;
        height: 17px;
        overflow-wrap: break-word;
        color: rgba(134, 136, 150, 1);
        font-size: 12px;
        font-family: OpenSansRoman-Bold;
        font-weight: 700;
        text-align: left;
        white-space: nowrap;
        line-height: 17px;
        margin: 1px 8px;
      }

      .text-wrapper_4 {
        height: 20px;
        background: url('../../assets/activity/light_tag_done.png') 100%
          no-repeat;
        background-size: 100% 100%;
        margin-left: 2px;
        width: 47px;

        .text_9 {
          width: 31px;
          height: 17px;
          overflow-wrap: break-word;
          color: rgba(153, 153, 153, 1);
          font-size: 12px;
          font-family: OpenSansRoman-Regular;
          text-align: left;
          white-space: nowrap;
          line-height: 17px;
        }
      }
    }
  }
}

.dark-theme {
  .act-quests-container {
    .act-quests-group {
      .box_1 {
        background-color: rgba(71, 74, 111, 1);
        border: 1px solid rgba(255, 255, 255, 0.2);

        .text_3 {
          color: rgba(255, 255, 255, 0.8)
        }

      }
    }
  }
}
</style>
