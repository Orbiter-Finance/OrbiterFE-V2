<template>
  <div id="prizes-rule" class="prizes-rule">
    <div class="rule-title">Terms and Conditions</div>
    <div class="prizes-rule-card">
      <div v-for="(item, index) in ruleList" :key="index">
        <div class="card-label">{{ item.label }}</div>
        <div v-if="item.image" class="image">
          <img :src="require(`../../../assets/prizes/${item.image}`)" alt="">
        </div>
        <div
          class="card-rule-text"
          v-for="(option, idx) in item.text"
          :key="idx"
          v-html="option"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrizesRule',
  data() {
    return {
      ruleList: [
        {
          label: '1.Which networks are participating in this event?',
          text: [
            '- <span class="orbiter_global_prizes_rule_tag">Bridge from/to Scroll (specific networks)</span>',
            '- Specific networks include: Ethereum, Arbitrum, zkSync Lite, Polygon, Optimism, Loopring, zkSyncEra, BNB Chain, Arbitrum Nova, Polygon zkEVM, Base, Mantle, opBNB, X Layer, Zora, Manta, Kroma, zkFair, Blast, ZetaChain, B² Network, Mode, zkLink Nova, Proof of Play Apex, Merlin, BEVM, BOB, Core, Bitlayer, BounceBit, Optopia, Cyber, Mint, AlienxChain, Fraxtal, Zircuit, Fuse, Linea',
            '- Minimum bridging amount required: 0.03 ETH',
            '- Bridge token: ETH',
          ],
        },
        {
          label:
            '2.How to share a 70,000 USDC prize pool and mint your Exclusive Badge on Scroll?',
          text: [
            '- Complete <span class="orbiter_global_prizes_rule_tag">≥3 transactions </span> to qualify for a share of the prize pool.',
            '- <span class="orbiter_global_prizes_rule_tag">The TOP 100 users</span> will qualify for minting <span class="orbiter_global_prizes_rule_tag">Diamond Scroll Bridger Badge</span> on Scroll after the event concludes.',
          ],
        },
        {
          label: '3.What are the prize pool and bridging fee rebate rules?',
          image: "rule.png",
          text: [
            '- The prize pool will be unlocked when the amount of transactions (TX) ≥ 3,000.',
            '- TOP 1 - 8 users, up to 95% of bridging fees (except for gas fees) will be rebated.',
            '- TOP 9 - 20 users, up to 50% of bridging fees (except for gas fees) will be rebated.',
          ],
        },
        {
          label: '4.What is the rule of ranking?',
          text: [
            '- The ranking is determined based on transactions. The ranking will be based on the transaction value if users have the same number of transactions. More transactions, greater chance to win!',
          ],
        },
        {
          label: '5.When will the rewards be distributed?',
          text: [
            '- All rewards will be distributed after the event ends, including USDC and bridging fee rebates for the top 20 users.',
          ],
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.prizes-rule {
  width: 100%;
  margin: 80px 0 200px;
  .rule-title {
    width: 100%;
    font-size: 32px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
  }
  .prizes-rule-card {
    padding: 8px 24px 24px;
    width: 100%;
    border-radius: 16px;
    background: linear-gradient(-3.58deg, rgba(15, 34, 37, 0.2) 60.756%,rgba(209, 112, 85, 0.2) 102.538%),rgb(15, 34, 37);
    text-align: left;
    margin-top: 16px;
    .card-label {
      margin-top: 16px;
      font-size: 16px;
      font-weight: 600;
      line-height: 28px;
      letter-spacing: 0px;
      font-family: GeneralSans-SemiBold;
      margin-top: 16px;
    }

    .image {
      width: 100%;
      margin-top: 12px;
      img {
        width: 100%;
      }
    }

    .card-rule-text {
      font-size: 14px;
      font-weight: 400;
      line-height: 23px;
      letter-spacing: 0px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

@media (max-width: 740px) {
  #prizes-rule {
    width: 100%;
    margin: 32px 0 60px;
    .prizes-rule-card {
      padding: 8px 16px;
    }
    .rule-title {
      font-size: 24px;
    }
  }
}
</style>
