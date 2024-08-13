<template>
  <div id="prizes-rule" class="prizes-rule">
    <div class="rule-title">Terms and Conditions</div>
    <div class="prizes-rule-card">
      <div v-for="(item, index) in ruleList" :key="index">
        <div class="card-label">{{ item.label }}</div>
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
            '- Bridge <span class="orbiter_global_prizes_rule_tag">from specific networks to Linea Chain.</span> ( Ethereum, Arbitrum, zkSync Lite, Polygon, Optimism, Loopring, zkSyncEra, BNB Chain, Arbitrum Nova, Polygon zkEVM, Scroll, Base, Mantle, opBNB, X Layer, Zora, Manta, Kroma, zkFair, Blast, ZetaChain, B² Network, Mode, zkLink Nova, Proof of Play Apex, Merlin, BEVM, BOB, Core, Bitlayer, BounceBit, Optopia, Cyber, Mint, AlienxChain, Fraxtal, Zircuit, Fuse )',
            '- The minimum amount required: 0.03 ETH.',
            '- Bridge token: ETH',
          ],
        },
        {
          label: '2.How to share the 35,000 USDC prize pool?',
          text: [
          '- Complete ≥3 transactions to qualify for a share of the prize pool.',
          '- The top 100 users in this bridging competition will share a 35,000 USDC prize pool.',
          ],
        },
        {
          label: '3.What is the 0 Bridging Fee & 50% Bridging Fee Rebates?',
          text: [
            '- TOP 1 to 8 users, all bridging fees (except for gas fees) will be rebated.',
            '- TOP 9 to 20 users, 50% of bridging fees (except for gas fees) will be rebated.'
          ],
        },
        {
          label: '4.What are the prize pool rules?',
          text: [
            '- The total  prize pool is 35,000 USDC, with a base pool of 7,000 USDC. ',
            '- When the total transactions ≥ 55,000, the pool increases to 10,500 USDC.',
            '- When the total transactions ≥100,000, the pool increases to 21,000 USDC.',
            '- When the total transactions  ≥180,000, the pool increases to 35,000 USDC.'
          ],
        },
        {
          label: '5.What is the rule of ranking?',
          text: [
            '- The ranking is determined based on transactions. If users have the same number of transactions, ranking will be based on the transaction value. More transactions, greater chance to win!',
          ],
        },
        {
          label: '6.When will the rewards be distributed?',
          text: [
            '- All rewards will be distributed after the competition ends, including USDC and bridging fee rebates for the top 20 users.',
            '- Please stay informed and claim your rewards within 3 days of the reward claim portal opening!'
          ],
        }
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.prizes-rule {
  width: 100%;
  margin: 56px 0 200px;
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
    border: 1px solid rgba(243, 223, 47, 0.3);
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
