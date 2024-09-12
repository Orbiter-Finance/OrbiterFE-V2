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
            '- <span class="orbiter_global_prizes_rule_tag">Bridge from specific networks to Scroll Chain or bridge from Scroll Chain to specific networks.</span>',
            '- Specific Chains include: Ethereum, Arbitrum, zkSync Lite, Linea, Base, Polygon, Optimism, Loopring, zkSyncEra, BNB Chain, Arbitrum Nova, Mantle, opBNB, X Layer, Zora, Manta, Kroma, zkFair, Blast, ZetaChain, B² Network, Mode, zkLink Nova, Proof of Play Apex, Merlin, BEVM, BOB, Core, Bitlayer, BounceBit, Optopia, Cyber, Mint, AlienxChain, Fraxtal, Zircuit, Fuse',
            '- The minimum amount required: 0.03 ETH',
            '- Bridge token: ETH',
          ],
        },
        {
          label:'2.How to share the up to 50,000 USDC prize pool and mint Badge on scroll?',
          text: [
            '- Complete <span class="orbiter_global_prizes_rule_tag">≥3 transactions </span> to qualify for a share of the prize pool.',
            '- <span class="orbiter_global_prizes_rule_tag">Prize Pool Breakdown:</span>',
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="orbiter_global_prizes_rule_tag">≥3 Transactions:</span> Share 5% of the prize pool',
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="orbiter_global_prizes_rule_tag">≥8 Transactions:</span> Share 10% of the prize pool',
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="orbiter_global_prizes_rule_tag">≥15 Transactions:</span> Share 18% of the prize pool',
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="orbiter_global_prizes_rule_tag">Top 9-100 Traders (with ≥20 trades):</span> Share 32% of the prize pool and qualify for <span class="orbiter_global_prizes_rule_tag">minting Alpha Badge</span> on scroll.',
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- <span class="orbiter_global_prizes_rule_tag">Top 1-8 Traders (with ≥20 trades):</span> Share 35% of the prize pool and qualify for <span class="orbiter_global_prizes_rule_tag">minting Alpha Badge</span> on scroll.',
          ],
        },
        {
          label: '3.What are the prize pool and bridging fee rebates rules?',
          image: "rule.png",
          text: [
            '<span class="orbiter_global_prizes_rule_tag">Note:</span>',
            '- The prize pool will be unlocked when the amount of transactions (TX) ≥ 2,500;',
            '- TOP 1 to 8 users, up to 96% bridging fees (except for gas fees) will be rebated.'
          ],
        },
        {
          label: '4.How to Earn O-Points Rewards?',
          text: [
            'Participants can earn additional event points by completing the following tasks:',
            "- Complete ≥1 transactions for 7 days to earn extra 126 Opoints.",
            "- Complete ≥1 transactions for 14 days to earn extra 420 Opoints."
          ],
        },
        {
          label: '5.What is the rule of ranking?',
          text: [
            '-The ranking is determined based on transactions. If users have the same number of transactions, ranking will be based on the transaction value. More transactions, greater chance to win!',
          ],
        },
        {
          label: '6.When will the rewards be distributed?',
          text: [
            '- All rewards will be distributed after the event ends, including USDC and bridging fee rebates for the top 20 users.',
            '- Please stay informed and claim your rewards within 3 days of the reward claim portal opening!'
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
