<template>
  <div class="bridage-page">
    <template>
      <div
        v-show="!isMobile && curPage.Status === '1' && !showDetail"
        class="sub-tabs"
      >
        <ToggleBtn />
      </div>
      <div
        v-show="
          curPage.TabState === 'Sender' && curPage.Status === '1' && !showDetail
        "
        class="sender-box"
      >
        <keep-alive>
          <sender />
        </keep-alive>
      </div>
      <div
        v-show="
          curPage.TabState === 'Maker' && curPage.Status === '1' && !showDetail
        "
        class="maker-box"
      >
        <!-- <maker /> -->
        <div class="maker-title">Create a Market Maker Node</div>
        <div class="maker-content">
          <div>
            <ul
              style="
                list-style: none;
                padding-left: 2.4rem;
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
              "
            >
              <li>
                <span style="width: 1.6rem; height: 1.6rem; background: #5ec2b7"
                  >1</span
                >
                Download the
                <a style="text-decoration: underline; color: #5ec2b7"
                  >Market Maker Client</a
                >
                and rent a
                <a style="text-decoration: underline; color: #5ec2b7"
                  >cloud service</a
                >.
              </li>
              <li>Set Node parameters in Market Maker Client webpage.</li>
              <li>Deposit Margin and keep enough liquidity in the node.</li>
              <li>
                Run the node and make sure to response to the users in time.
              </li>
              <li>
                <a style="text-decoration: underline">Docs for Market Maker</a>
              </li>
              <li>
                <a style="text-decoration: underline"
                  >Get Help in Orbiter Discord</a
                >
              </li>
            </ul>
          </div>
          <!-- <div @click="clickLearnMore" class="maker-link">LEARN MORE</div> -->
          <div class="maker-foot-btn mbtn">
            Download the Market Maker Client
          </div>
        </div>
      </div>
      <div
        v-show="
          curPage.TabState === 'Pool' && curPage.Status === '1' && !showDetail
        "
        class="pool-box"
      >
        <cur-network-pool v-if="makerInfoStatus && isLogin" />
        <div class="maker-box" style="margin: 0 auto" v-else>
          <div class="maker-title">About Maker</div>
          <div class="maker-content">
            <div>
              Orbiter's Maker provides liquidity for Layer 2 and benefits from
              it.
            </div>
            <div @click="clickLearnMore" class="maker-link">LEARN MORE</div>
            <div class="maker-foot-btn">Connect a Wallet</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { curNetworkPool, sender } from './'
import { ToggleBtn } from '../components'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Bridge',
  components: { ToggleBtn, sender, curNetworkPool },
  computed: {
    ...mapState(['curPage', 'isMobile']),
    ...mapGetters(['isLogin']),
    showDetail() {
      return false
    },
  },
  data() {
    return {
      makerInfoStatus: false,
    }
  },
  async mounted() {
    this.makerInfoStatus = await this.getMakerInfoList()
  },
  methods: {
    ...mapMutations(['togglePageTab']),
    ...mapActions(['getMakerInfoList']),
    clickLearnMore() {
      window.open('https://docs.orbiter.finance/', '_blank')
    },
    changeState(e) {
      if (e !== '1' && e !== '2' && e !== '3') {
        // historyPanelState.isShowHistory = false
      } else {
        if (this.curPage.Status !== e) {
          this.togglePageTab({ type: 'Status', value: e })
        }
      }
    },
  },
}
</script>

<style scoped lang="scss">
.app {
  .bridage-page {
    .maker-box {
      width: 56rem;
      // height: 33.1rem;
      .maker-content {
        .maker-foot-btn {
          // width: 40rem;
        }
        .mbtn {
          background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
          box-shadow: inset 0px -8px 0px rgba(0, 0, 0, 0.16);
          border-radius: 40px;
        }
        ul li {
          &:not(:last-child) {
            margin-bottom: 1.5rem;
          }
          &:nth-last-child(2) {
            margin-top: 3rem;
          }
        }
      }
    }
    .sender-box {
      width: 48rem;
      height: 54rem;
      padding: 2.4rem 2rem;
    }
  }
}
.app-mobile {
  .bridage-page {
    // height: 100%;
    .maker-box {
      height: 100%;
      width: 100%;
    }
    .sender-box {
      width: 100%;
      height: 100%;
      padding: 2.4rem 2rem;
    }
  }
}
.bridage-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .sub-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2.4rem;
    margin-top: 0rem;
    .tab-toggle-btn {
      width: 22.9rem;
      height: 4rem;
      border-radius: 4rem;
      .tab-btn-item {
        display: inline-block;
        width: 50%;
        text-align: center;
        font-weight: 700;
        font-size: 1.6rem;
        height: 100%;
        line-height: 4rem;
        border-radius: 2rem;
        cursor: pointer;
      }
      .tab-btn-item.selected {
        background: #df2e2d;
        color: #ffffff;
        box-shadow: inset 0rem -0.6rem 0rem rgba(0, 0, 0, 0.16);
      }
    }
  }
  .sender-box {
    border-radius: 2rem;
  }
  .maker-box {
    border-radius: 2rem;
    padding: 3.4rem 4rem;
    text-align: left;
    .maker-title {
      font-weight: 700;
      font-size: 2rem;
      line-height: 2rem;
    }
    .maker-content {
      font-family: 'Inter Regular';
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 2rem;
      margin-top: 3rem;
      .maker-link {
        margin-top: 2rem;
        color: #df2e2d;
      }
      .maker-link:hover {
        text-decoration: underline;
        cursor: pointer;
      }
      .maker-foot-btn {
        height: 5rem;
        box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
        border-radius: 4rem;
        font-weight: 700;
        font-size: 2rem;
        line-height: 2rem;
        color: #fff;
        margin-top: 4rem;
        text-align: center;
        line-height: 5rem;
        font-family: 'Inter Bold';
      }
    }
  }
  .pool-box {
    width: 112rem;
    // height: 110rem;
  }
}
</style>
