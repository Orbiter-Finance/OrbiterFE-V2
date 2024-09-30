<template>
  <div class="bridge-cards">
    <div class="task-title">
        <div>Superchain Airdrop Tracker</div>
      </div>

      <div class="task-list-group">
        <div
          class="task-card-pool-group"
          v-for="item in bridgeLinkList"
          :key="item.chain"
          @click="openTelegram(item)"
        >
          <div class="task-card-pool">
            <div class="info">
              <svg-icon
                class="icon"
                :iconName="item.chain"
              ></svg-icon>

              <div class="content-text-group">
                <span class="content-text" v-html="item.label"></span>
              </div>
            </div>
                <div class="prizes-promotion">
                  <div
                    class="task-reward-laebl"
                  >
                    {{ item.reward }}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="24.000000"
                    height="24.000000"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      width="24.000000"
                      height="24.000000"
                      fill="#D8D8D8"
                      fill-opacity="0"
                    />
                    <rect
                      x="0.500000"
                      y="0.500000"
                      width="23.000000"
                      height="23.000000"
                      stroke="#979797"
                      stroke-opacity="0"
                      stroke-width="1.000000"
                    />
                    <path
                      d="M11.18 6.05L11.18 6.08L10.67 6.59L16.31 12.24L10.67 17.88L11.18 18.4L11.18 18.42C10.89 18.72 10.42 18.72 10.12 18.42C9.82 18.13 9.82 17.66 10.12 17.36L10.15 17.36L10.65 17.87L10.65 6.61L10.15 7.11L10.12 7.11C9.82 6.81 9.82 6.35 10.12 6.05C10.42 5.75 10.89 5.75 11.18 6.05Z"
                      fill="#D8D8D8"
                      fill-opacity="0"
                      fill-rule="evenodd"
                    />
                    <path
                      d="M10.65 17.89L16.31 12.24L10.65 6.58"
                      stroke="#FFFFFF"
                      stroke-opacity="1.000000"
                      stroke-width="1.500000"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'BridgeChainLinksCard',
  computed: {
    bridgeLinkList() {
      return [{
        chain: "8453",
        label: "Bridge to Base",
        reward: "Build name on Base",
        link: "https://www.base.org/names"
      }, {
        chain: "60808",
        label: "Bridge to BOB",
        reward: "Join Fusion Season 3 to get BOB spices",
        link: "https://www.mintchain.io/airdrop"
      }, {
        chain: "185",
        label: "Bridge to Mint",
        reward: "Join in Mint Expedition Season 3 airdrop",
        link: "https://www.mode.network/about-the-airdrop"
      }, {
        chain: "34443",
        label: "Bridge to Mode",
        reward: "Join in Mode Season2 airdrop",
        link: "https://www.gobob.xyz/#about"
      }, {
        chain: "7560",
        label: "Bridge to Cyber",
        reward: "Join in CyberID Migration Campaign airdrop",
        link: "https://cyber.co/cyber-id?source=xbio"
      }, {
        chain: "255",
        label: "Bridge to Kroma",
        reward: "Mint Your Own Kromans to join airdrop",
        link: "https://kcu.kroma.network/?dialog=gate"
      }]
    }
  },
  methods: {
    openTelegram(option) {
     const name = "PRIZES_V7_CHAIN_LINK_" + option.chain
     const url = option.link
     try {
        this.$gtag.event(name, {
          event_category: name,
          event_label: url,
        })
      } catch (error) {}
      window.open(url, '_blank')
    },
  }
}
</script>

<style scoped lang="scss">
.bridge-cards {
    width: 100%;
    .task-title {
        font-size: 20px;
        font-family: GeneralSans-SemiBold;
        letter-spacing: 0px;
        text-align: left;
        padding: 24px 0 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .update-time {
          white-space: nowrap;
          font-size: 12px;
          font-family: GeneralSans-Regular;
        }
      }
      .task-list-group {
        width: 100%;
        position: relative;
        top: 0;
        left: 0;
        .prizes-end-modal {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          border: 2px solid rgb(34, 34, 34);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          background: rgba(26, 26, 26, 0.4);
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: GeneralSans-SemiBold;
          font-family: GeneralSans-SemiBold;
        }
        .task-card-options-group {
          width: 100%;
          background: #0a1618;
          margin-top: 12px;
          border-radius: 12px;
          cursor: pointer;
          border: 1px solid transparent;
          padding: 16px;
          .task-card-options {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .info {
              display: flex;
              justify-content: start;
              align-items: center;
              .icon {
                width: 24px;
                height: 24px;
              }
              .content-text-group {
                display: flex;
                justify-content: start;
                align-items: center;
                flex-wrap: wrap;
                text-align: left;
                span {
                  white-space: nowrap;
                }
                .content-text {
                  font-size: 16px;
                  font-family: GeneralSans-SemiBold;
                  letter-spacing: 0px;
                  text-align: left;
                  margin: 0 4px;
                }
                .tip-text {
                  margin-right: 4px;
                }
              }
            }
            .reward {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              font-size: 16px;
              font-family: GeneralSans-SemiBold;
              letter-spacing: 0px;
              text-align: right;
              .reward-info {
                display: flex;
                justify-content: flex-end;
                align-items: center;
              }
              .reward-status {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                margin-left: 6px;
              }
            }
          }
          .reward-info-mobile-group {
            width: 100%;
            display: none;
            justify-content: start;
            align-items: center;
            margin-top: 8px;
            font-size: 12px;
            .reward-info-mobile {
              display: flex;
              justify-content: start;
              align-items: center;
              padding: 4px 8px;
              border-radius: 4px;
              background: rgb(0, 0, 0);
              img {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
        .task-card-pool-group {
          width: 100%;
          padding: 16px;
          background: #1e140e;
          margin-top: 12px;
          border-radius: 12px;
          cursor: pointer;
          border: 1px solid transparent;
          .task-card-pool {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .info {
              display: flex;
              justify-content: start;
              align-items: center;
              .icon {
                width: 24px;
                height: 24px;
              }
              .content-text-group {
                .content-text {
                  font-size: 16px;
                  font-family: GeneralSans-Medium;
                  letter-spacing: 0px;
                  text-align: left;
                  margin: 0 4px;
                }
                .tip-text {
                  margin-right: 4px;
                }
              }
            }
            .pool-reward {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              font-size: 16px;
              font-family: GeneralSans-SemiBold;
              letter-spacing: 0px;
              text-align: right;
            }
            .prizes-promotion {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              color: #ffff;
              .task-reward-laebl {
                font-size: 16px;
                font-family: GeneralSans-Medium;
                color: rgba(255, 255, 255, 0.4);
              }
              svg {
                width: 24px;
                height: 24px;
              }
            }
  
            .earn-nft {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
              font-family: GeneralSans-SemiBold;
              border-radius: 4px;
              backdrop-filter: blur(156px);
              .icon {
                width: 24px;
                height: 24px;
                margin-left: 4px;
              }
              .text {
                margin: 0 4px;
              }
            }
          }
        }
        .task-card-pool-group-promotion {
          opacity: 0.6;
        }
      }
}
</style>
