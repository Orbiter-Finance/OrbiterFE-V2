<template>
    <div
        @mouseleave="closeAct"
        class="act header-dialog-box"
        :style="{ display: this.selectWalletDialogVisible ? 'block' : 'none' }"
    >
        <div v-if="isMobile" @click="mobileCloseAct" style="width: 100%;height:100%"></div>
        <div @mouseover="mouseoverDialog" class="block_1">
            <div style="width: 100%;display: flex;height:45px;">
                <span class="text_21">🛸 Quests</span>
                <div style="flex: 1;text-align: right;padding-top: 6px;padding-right:3px">
                    <span class="text_22" @click="openDetail">Details</span>
                </div>
            </div>
            <div :style="`overflow-y: scroll;height:85%;padding-bottom: ${isMobile ? '80px' : '5px'}`" v-loading="listLoading" element-loading-background="rgba(0, 0, 0, 0)" @scroll="itemScroll">
                <template v-for="item in actDataList">
                    <div v-if="item.status === 0" class="box_1">
                        <div class="text-wrapper_1 flex-row">
                            <span class="text_1">{{ item.points }}</span> <span class="text_2">O-Points</span>
                        </div>
                        <div class="border-dashed"></div>
                        <div style="font-size: 12px;font-family: OpenSansRoman-SemiBold;position: absolute;left:100px;top:13px">
                            <div class="text_3">
                                {{ item.description }}
                            </div>
                            <div style="margin-top: 10px;display: flex;flex-direction: row">
                                <div class="text-wrapper_2">
                                    Undone
                                </div>
                                <div class="text_5">
                                    Until&nbsp;{{ formatTime(item.endTime) }}
                                </div>
                            </div>
                        </div>
                        <img
                            :hidden="!isLightMode"
                            class="thumbnail_1"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_up.png')"
                        />
                        <img
                            :hidden="!isLightMode"
                            class="thumbnail_2"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_down.png')"
                        />
                        <img
                            :hidden="isLightMode"
                            class="thumbnail_5"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_up_dark.png')"
                        />
                        <img
                            :hidden="isLightMode"
                            class="thumbnail_6"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_down_dark.png')"
                        />
                    </div>
                    <div v-else class="box_2">
                        <div class="text-wrapper_3 flex-col">
                            <span class="text_6">{{ item.points }}</span> <span class="text_7">O-Points</span>
                        </div>
                        <div class="border-dashed_2"></div>
                        <div style="font-size: 12px;font-family: OpenSansRoman-SemiBold;position: absolute;left:100px;top:13px">
                            <div class="text_8">
                                {{ item.description }}
                            </div>
                            <div style="margin-top: 10px;display: flex;flex-direction: row">
                                <div class="text-wrapper_4">
                                    Done
                                </div>
                                <div class="text_9">
                                    Until&nbsp;{{ formatTime(item.endTime) }}
                                </div>
                            </div>
                        </div>
                        <img
                            :hidden="!isLightMode"
                            class="thumbnail_3"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_up_gray.png')"
                        />
                        <img
                            :hidden="!isLightMode"
                            class="thumbnail_4"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_down_gray.png')"
                        />
                        <img
                            :hidden="isLightMode"
                            class="thumbnail_5"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_up_dark.png')"
                        />
                        <img
                            :hidden="isLightMode"
                            class="thumbnail_6"
                            referrerpolicy="no-referrer"
                            :src="require('../../assets/activity/curve_down_dark.png')"
                        />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  import {
    actDialogHover,
    actDialogVisible, isMobile, setActDialogVisible, setActDialogHover, transferDataState, updateActDataList,
  } from '../../composition/hooks';
  import { requestPointSystem } from "../../common/openApiAx";
  import { compatibleGlobalWalletConf } from "../../composition/walletsResponsiveData";

  export default {
    name: 'HeaderActDialog',
    data() {
      return {
        page: 1,
        pageSize: 10,
        total: 0,
        scrollLastTime: new Date().valueOf(),
        addItemLoading: false,
        listLoading: false,
        isHover: false,
        twitter: null
      };
    },
    computed: {
      isMobile() {
        return isMobile.value;
      },
      isLightMode () {
        return this.$store.state.themeMode === 'light'
      },
      selectWalletDialogVisible() {
        return actDialogVisible.value;
      },
      actDataList() {
        return transferDataState.actDataList;
      },
    },
    methods: {
      itemScroll(e) {
        if (new Date().valueOf() - this.scrollLastTime > 40) {
          const itemH = 88;
          const touchNum = 5;
          this.scrollHei = e.target.scrollTop;
          const scrollNum = this.scrollHei - (this.scrollHei % itemH);
          const len = Math.floor(scrollNum / itemH);
          if (len >= transferDataState.actDataList.length - touchNum && transferDataState.actDataList.length < this.total) {
            this.addItem();
          }
          this.scrollLastTime = new Date().valueOf();
        }
      },
      async addItem() {
        if (!this.addItemLoading) {
          this.addItemLoading = true;
          const nextPage = this.page + 1;
          const actDataList = await this.getActDataList(this.pageSize, nextPage);
          const list = [...transferDataState.actDataList, ...actDataList];
          const obj = {};
          const dataList = list.filter((a) => {
            if (!obj[a.id]) {
              obj[a.id] = 1;
              return true;
            } else {
              return false;
            }
          });
          updateActDataList(dataList);
          this.page = Math.floor(dataList.length / this.pageSize);
          this.addItemLoading = false;
        }
      },
      async getActDataList(pageSize, page) {
        const res = await requestPointSystem('activity/list', {
          address: compatibleGlobalWalletConf.value.walletPayload.walletAddress,
          pageSize,
          page
        });
        this.total = res.data.total;
        const list = res.data.list;
        const dataList = [];
        for (const data of list) {
          this.twitter = data.twitter;
          dataList.push(...data.taskList);
        }
        return dataList;
        // const list = [];
        // for (let i = pageSize * page; i < pageSize * (page + 1); i++) {
        //   list.push({
        //     id: i,
        //     name: `{ i + 1 }`,
        //     desc: '1111111111111111',
        //     status: 1,
        //     points: i + 1,
        //     conditions: {},
        //     time: new Date().valueOf() + 1000 * 60 * 60 * 24 * 180
        //   });
        // }
        // return list;
      },
      openDetail() {
        if (this.twitter) window.open(this.twitter, '_blank');
      },
      mobileCloseAct() {
        if (isMobile.value) {
          setActDialogVisible(false);
        }
      },
      closeAct() {
        setActDialogHover(false);
        setActDialogVisible(false);
      },
      formatTime(time) {
        const arr = String(new Date(time)).split(' ');
        if (arr.length > 3) {
          if (+arr[3] !== new Date().getFullYear()) {
            return `${ arr[1] } ${ arr[2] }th ${ arr[3] }`;
          }
          return `${ arr[1] } ${ arr[2] }th`;
        }
        return `${ new Date(time).getMonth() } ${ new Date(time).getDate() }th`;
      },
      mouseoverDialog() {
        setActDialogHover(true);
      },
    },
    async mounted() {
      setTimeout(() => {
        if (!isMobile.value) {
          let times = localStorage.getItem('act_show_times') || 0;
          if (times < 3) {
            setActDialogVisible(true);
            times++;
            localStorage.setItem('act_show_times', times);
          }
        }
        setTimeout(() => {
          actDialogVisible.value && !actDialogHover.value && setActDialogVisible(false);
        }, 3000);
      }, 500);

      this.listLoading = true;
      try {
        updateActDataList(await this.getActDataList(this.pageSize, this.page));
      } catch (e) {
        console.error('getActDataList error', e);
      } finally {
        this.listLoading = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
    .dark-theme {
        .act {
            .border-dashed {
                border-top: 1px dashed #FFFFFF;
                opacity: 20%;
            }

            .border-dashed_2 {
                border-top: 1px dashed #EEEEEE;
                opacity: 10%;
            }

            .block_1 {
                top: 50px;
                right: 20px;
                border-radius: 12px;
                background-color: rgba(64, 65, 91, 1);
                color: rgba(255, 255, 255, 1);
                position: absolute;
                width: 380px;
                height: 394px;
                margin-top: 24px;
            }

            .text_3 {
                width: 232px;
                height: 34px;
                overflow-wrap: break-word;
                color: rgba(255, 255, 255, 0.8);
                font-size: 12px;
                font-family: OpenSansRoman-SemiBold;
                /*font-weight: NaN;*/
                text-align: left;
                line-height: 17px;
            }

            .text_5 {
                width: 31px;
                height: 17px;
                overflow-wrap: break-word;
                color: rgba(255, 255, 255, 0.8);
                font-size: 12px;
                font-family: OpenSansRoman-SemiBold;
                text-align: left;
                white-space: nowrap;
                line-height: 17px;
                margin: 1px 0 0 12px;
            }

            .text_10 {
                width: 31px;
                height: 17px;
                overflow-wrap: break-word;
                color: rgba(255, 255, 255, 0.4);
                font-size: 12px;
                font-family: OpenSans-Regular;
                text-align: left;
                white-space: nowrap;
                line-height: 17px;
                margin: 1px 0 0 12px;
            }

            .text_21 {
                width: 94px;
                height: 23px;
                overflow-wrap: break-word;
                color: #f5f5f5;
                font-size: 18px;
                font-family: Kodchasan-Bold;
                font-weight: 700;
                text-align: left;
                white-space: nowrap;
                line-height: 23px;
                margin: 12px 0 0 16px;
            }

            .box_1 {
                display:flex;
                background-color: rgba(71, 74, 111, 1);
                border-radius: 8px;
                position: relative;
                width: 348px;
                height: 88px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                margin: 16px 0 0 16px;
            }

            .box_2 {
                display:flex;
                background-color: rgba(54, 57, 81, 1);
                border-radius: 8px;
                position: relative;
                width: 348px;
                height: 88px;
                border: 1px solid rgba(238, 238, 238, 0.1);
                margin: 16px 0 0 16px;
            }

            .text-wrapper_2 {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                height: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                width: 55px;
            }

            .text-wrapper_3 {
                background: rgba(63, 65, 91, 1);
                border-radius: 8px;
                width: 58px;
                height: 64px;
                margin: 12px 0 0 12px;
            }

            .text-wrapper_4 {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                height: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                width: 55px;
            }
        }
    }
    .act {
        .block_1 {
            top: 50px;
            right: 20px;
            border-radius: 12px;
            background-color: #ffffff;
            position: absolute;
            width: 380px;
            height: 394px;
            margin-top: 24px;
        }

        .box_1 {
            display:flex;
            background-color: rgba(255, 255, 255, 1);
            border-radius: 8px;
            position: relative;
            width: 348px;
            height: 88px;
            border: 1px solid rgba(34, 34, 34, 1);
            margin: 16px 0 0 16px;
        }

        .text-wrapper_1 {
            position: relative;
            width: 58px;
            height: 64px;
            background: url('../../assets/activity/wrapper_1.png') -2px 0px no-repeat;
            background-size: 60px 66px;
            margin: 12px 0 0 12px;
            padding-top: 5px;
            background: linear-gradient(316deg, #DA9013 0%, #FFADAD 100%);
            box-shadow: -2px 2px 0px 0px #000000;
            border-radius: 8px;
            border: 1px solid #222222;
        }

        .text_1 {
            width: 14px;
            height: 33px;
            color: rgba(34, 34, 34, 1);
            font-size: 24px;
            font-family: OpenSansRoman-Bold;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
            line-height: 33px;
        }

        .text_2 {
            position: absolute;
            left: 4px;
            top: 36px;
            width: 21px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            text-align: center;
            white-space: nowrap;
            line-height: 17px;
        }

        .border-dashed {
            position: absolute;
            border-top: 1px dashed #000;
            transform: rotate(90deg);
            width: 76px;
            left: 44px;
            top: 44px;
            font-weight: 700;
        }

        .border-dashed_2 {
            position: absolute;
            border-top: 1px dashed #EEEEEE;
            transform: rotate(90deg);
            width: 76px;
            left: 44px;
            top: 44px;
            font-weight: 700;
        }

        .image_1 {
            width: 1px;
            height: 76px;
            /*margin: 6px 0 0 12px;*/
        }

        .group_2 {
            width: 232px;
            height: 62px;
            margin: 14px 22px 0 11px;
        }

        .text_3 {
            width: 232px;
            height: 34px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            /*font-weight: NaN;*/
            text-align: left;
            line-height: 17px;
        }

        .group_3 {
            width: 146px;
            height: 20px;
            margin-top: 8px;
        }

        .text-wrapper_2 {
            height: 20px;
            background: url('../../assets/activity/wrapper_2.png') 100% no-repeat;
            background-size: 100% 100%;
            width: 55px;
            margin-right: 20px;
        }

        .text_4 {
            width: 31px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            /*font-weight: NaN;*/
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin: 1px 0 0 12px;
        }

        .text_5 {
            width: 79px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            /*font-weight: NaN;*/
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin-top: 2px;
        }

        .thumbnail_1 {
            position: absolute;
            left: 76px;
            top: 81px;
            width: 12px;
            height: 6px;
        }

        .thumbnail_2 {
            position: absolute;
            left: 76px;
            top: -1px;
            width: 12px;
            height: 6px;
        }

        .box_2 {
            background-color: rgba(255, 255, 255, 1);
            border-radius: 8px;
            position: relative;
            width: 348px;
            height: 88px;
            border: 1px solid rgba(238, 238, 238, 1);
            margin: 16px 0 0 16px;
        }

        .text-wrapper_3 {
            background: url('../../assets/activity/wrapper_3.png') 100% no-repeat;
            position: relative;
            width: 58px;
            height: 64px;
            background-size: 60px 66px;
            margin: 12px 0 0 12px;
            padding-top: 5px;
        }

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

        .image_2 {
            width: 1px;
            height: 76px;
            margin: 6px 0 0 12px;
        }

        .group_4 {
            width: 232px;
            height: 62px;
            margin: 14px 22px 0 11px;
        }

        .text_8 {
            width: 232px;
            height: 34px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            text-align: left;
            line-height: 17px;
        }

        .box_3 {
            width: 146px;
            height: 20px;
            margin-top: 8px;
        }

        .text-wrapper_4 {
            height: 20px;
            background: url('../../assets/activity/wrapper_4.png') 100% no-repeat;
            background-size: 100% 100%;
            width: 55px;
            color: rgba(153, 153, 153, 1);
        }

        .text_9 {
            width: 31px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin: 1px 0 0 12px;
        }

        .text_10 {
            width: 79px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin-top: 2px;
        }

        .thumbnail_3 {
            position: absolute;
            left: 76px;
            top: 81px;
            width: 12px;
            height: 6px;
        }

        .thumbnail_4 {
            position: absolute;
            left: 76px;
            top: -1px;
            width: 12px;
            height: 6px;
        }

        .box_4 {
            background-color: rgba(255, 255, 255, 1);
            border-radius: 8px;
            position: relative;
            width: 348px;
            height: 88px;
            border: 1px solid rgba(238, 238, 238, 1);
            margin: 16px 0 0 16px;
        }

        .block_2 {
            width: 58px;
            height: 64px;
            background: url('../../assets/activity/block_2.png') 100% no-repeat;
            background-size: 100% 100%;
            margin: 12px 0 0 12px;
        }

        .text-group_1 {
            width: 28px;
            height: 47px;
            margin: 6px 0 0 15px;
        }

        .text_11 {
            width: 28px;
            height: 33px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 24px;
            font-family: OpenSansRoman-Bold;
            font-weight: 700;
            text-align: right;
            white-space: nowrap;
            line-height: 33px;
        }

        .text_12 {
            width: 21px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin: -3px 0 0 4px;
        }

        .image_3 {
            width: 1px;
            height: 76px;
            margin: 6px 0 0 12px;
        }

        .block_3 {
            width: 232px;
            height: 62px;
            margin: 14px 22px 0 11px;
        }

        .text_13 {
            width: 232px;
            height: 34px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            text-align: left;
            line-height: 17px;
        }

        .group_5 {
            width: 146px;
            height: 20px;
            margin-top: 8px;
        }

        .text-wrapper_5 {
            height: 20px;
            background: url('../../assets/activity/wrapper_5.png') 100% no-repeat;
            background-size: 100% 100%;
            width: 55px;
        }

        .text_14 {
            width: 31px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin: 1px 0 0 12px;
        }

        .text_15 {
            width: 79px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin-top: 2px;
        }

        .thumbnail_5 {
            position: absolute;
            left: 76px;
            top: 81px;
            width: 12px;
            height: 6px;
        }

        .thumbnail_6 {
            position: absolute;
            left: 76px;
            top: -1px;
            width: 12px;
            height: 6px;
        }

        .box_5 {
            width: 310px;
            height: 59px;
            margin: 32px 0 41px 42px;
        }

        .text-wrapper_6 {
            width: 28px;
            height: 47px;
            margin-top: 2px;
        }

        .text_16 {
            width: 28px;
            height: 33px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 24px;
            font-family: OpenSansRoman-Bold;
            font-weight: 700;
            text-align: right;
            white-space: nowrap;
            line-height: 33px;
        }

        .text_17 {
            width: 21px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: OpenSansRoman-SemiBold;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
            margin: -3px 0 0 3px;
        }

        .box_6 {
            width: 242px;
            height: 59px;
        }

        .text_18 {
            width: 232px;
            height: 38px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 14px;
            font-family: OpenSansRoman-SemiBold;
            text-align: left;
            line-height: 19px;
        }

        .text-wrapper_7 {
            width: 224px;
            height: 17px;
            margin: 4px 0 0 18px;
        }

        .text_19 {
            width: 64px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
        }

        .text_20 {
            width: 79px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: left;
            white-space: nowrap;
            line-height: 17px;
        }

        .image-wrapper_1 {
            background-color: rgba(255, 255, 255, 1);
            border-radius: 8px;
            height: 34px;
            border: 1px solid rgba(238, 238, 238, 1);
            width: 348px;
            position: absolute;
            left: 16px;
            top: 360px;
        }

        .image_4 {
            width: 56px;
            height: 22px;
            margin: 12px 0 0 12px;
        }

        .thumbnail_7 {
            position: absolute;
            left: 76px;
            top: -6px;
            width: 12px;
            height: 12px;
        }

        .text-wrapper_8 {
            background-color: rgba(255, 255, 255, 1);
            position: absolute;
            left: 0;
            top: 0;
            width: 380px;
            height: 48px;
        }

        .text_21 {
            width: 94px;
            height: 23px;
            overflow-wrap: break-word;
            color: rgba(34, 34, 34, 1);
            font-size: 18px;
            font-family: Kodchasan-Bold;
            font-weight: 700;
            text-align: left;
            white-space: nowrap;
            line-height: 23px;
            margin: 12px 0 0 16px;
        }

        .text_22 {
            cursor: pointer;
            width: 39px;
            height: 17px;
            overflow-wrap: break-word;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            font-family: OpenSans-Regular;
            text-align: center;
            white-space: nowrap;
            line-height: 17px;
            margin: 15px 16px 0 0;
        }
    }

    @media (max-width: 820px) {
        .dark-theme {
            .act {
                position: absolute;
                width: 100%;
                height: 100%;
                .block_1 {
                    margin-top: 0px;
                    padding-bottom: 150px;
                    top: 250px;
                    bottom: 0px;
                    right: 0px;
                    height: 100%;
                    border-radius: 12px;
                    background-color: rgba(64, 65, 91, 1);
                    color: rgba(255, 255, 255, 1);
                    position: absolute;
                    width: 100%;
                }

                .text_3 {
                    width: 232px;
                    height: 34px;
                    overflow-wrap: break-word;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 12px;
                    font-family: OpenSansRoman-SemiBold;
                    /*font-weight: NaN;*/
                    text-align: left;
                    line-height: 17px;
                }

                .text_5 {
                    width: 31px;
                    height: 17px;
                    overflow-wrap: break-word;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 12px;
                    font-family: OpenSansRoman-SemiBold;
                    text-align: left;
                    white-space: nowrap;
                    line-height: 17px;
                    margin: 1px 0 0 12px;
                }

                .text_10 {
                    width: 31px;
                    height: 17px;
                    overflow-wrap: break-word;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 12px;
                    font-family: OpenSans-Regular;
                    text-align: left;
                    white-space: nowrap;
                    line-height: 17px;
                    margin: 1px 0 0 12px;
                }

                .text_21 {
                    width: 94px;
                    height: 23px;
                    overflow-wrap: break-word;
                    color: #f5f5f5;
                    font-size: 18px;
                    font-family: Kodchasan-Bold;
                    font-weight: 700;
                    text-align: left;
                    white-space: nowrap;
                    line-height: 23px;
                    margin: 12px 0 0 16px;
                }

                .box_1 {
                    display:flex;
                    background-color: rgba(71, 74, 111, 1);
                    border-radius: 8px;
                    position: relative;
                    height: 88px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    width: 90%;
                    margin: 16px;
                }

                .box_2 {
                    display:flex;
                    background-color: rgba(54, 57, 81, 1);
                    border-radius: 8px;
                    position: relative;
                    width: 348px;
                    height: 88px;
                    border: 1px solid rgba(238, 238, 238, 0.1);
                    margin: 16px 0 0 16px;
                }

                .text-wrapper_2 {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    height: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    width: 55px;
                }

                .text-wrapper_3 {
                    background: rgba(63, 65, 91, 1);
                    border-radius: 8px;
                    width: 58px;
                    height: 64px;
                    margin: 12px 0 0 12px;
                }

                .text-wrapper_4 {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    height: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    width: 55px;
                }
            }
        }

        .act {
            position: absolute;
            width: 100%;
            height: 100%;
            .block_1 {
                margin-top: 0px;
                padding-bottom: 150px;
                top: 250px;
                bottom: 0px;
                right: 0px;
                height: 100%;
                border-radius: 12px;
                background-color: #ffffff;
                position: absolute;
                width: 100%;
            }

            .box_1 {
                width: 90%;
                margin: 16px;
            }

            .thumbnail_1 {
                top: 82px;
            }

            .thumbnail_3 {
                top: 82px;
            }

            .thumbnail_5 {
                top: 82px;
            }
        }
    }

    .header-dialog-box {
        font-family: 'Inter Regular';
        position: absolute;
        top: 0;
        right: 0;
    }
</style>
