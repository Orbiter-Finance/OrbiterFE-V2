<template>
  <div id="prizes-rule" class="prizes-rule">
    <div class="rule-title">Terms and Conditions</div>
    <div class="prizes-rule-card">
      <div v-for="(item, index) in ruleList" :key="index">
        <div class="card-label">{{ item.label }}</div>
        <div
          class="card-rule-text"
          v-for="(option, idx) in item.text"
          :key="idx" v-html="option"
        >
        </div>
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
          label: 'How to Get Rewards:',
          text: [
            'Bridge from specific chain to Arbitrum. ',
            'Specific chains include:<strong> Blast, Optopia, ZKFair, Mode, zkLink Nova, Zora, Manta, Mantle, Polygon, Scroll, OPBNB, zkSync Lite, Arbitrum Nova, Proof of Play Apex, BSC, BOB, zkSync Era, Taiko, BEVM, Merlin</strong>',
          ],
        },
        {
          label: 'Complete the following tasks to get rewards accordingly:',
          text: [
            '1. Join the orbiter telegram group: +3 OPoints',
            '2. Complete the first bridging: +5 OPoints',
            '3. Complete the second bridging: +12 OPoints',
          ],
        },
        {
          label:
            'Complete the specified amount of transactions to share the prize pool accordingly:',
          text: [
            '- Complete 3 transactions: share 10% of the prize pool',
            '- Complete 5 transactions: share 15% of the prize pool',
            '- Complete 8 transactions: share 20% of the prize pool',
            '- Complete 15 transactions: share 25% of the prize pool',
            '- Top 100 users (the transactions are over 20): share 30% of the prize pool',
          ],
        },
        {
          label: 'Surprise rewards:',
          text: [
            'The top 800 users (according to the amount of transactions) will receive a certain amount of $ORBGUY for free randomly! ',
          ],
        },
        {
          label: 'Reward Distribution Rules',
          text: [
            '- When the number of participants is ≤ 5000, and the initial prize pool is $25,000.',
            '- For every 1000 users participation, the prize pool will increase $2,000, and the prize pool will increase in this way until $100,000 highest.',
            '- Each address can only share the rewards of the final prize pool level counted at the end of the competition, and the bonus pool each user gets cannot be accumulated.',
            '- The prize pools for the tiers that have completed 3-15 bridging transactions tasks, the winning users will share the prize equally according to the prize pool.',
            '- The top 100 users will share 30% of the prize pool according to the proportion of transaction amounts.',
          ],
        },
        {
          label: 'Note',
          text: [
            '- You only need to complete more than 3 transactions to participate in the prize pool of $100,000.',
            '- The rewards will be distributed when the competition ends.',
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
  margin: 64px 0 200px;
  .rule-title {
    width: 100%;
    font-size: 32px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: 0px;
    text-align: center;
  }
  .prizes-rule-card {
    margin: 16px 0 4px;
    width: 100%;
    padding: 8px 24px 24px;
    border-radius: 16px;
    background: rgb(34, 34, 34);
    text-align: left;
    .card-label {
      font-size: 16px;
      font-weight: 600;
      line-height: 28px;
      letter-spacing: 0px;
      margin-top: 16px;
    }

    .card-rule-text {
      font-size: 14px;
      font-weight: 400;
      line-height: 23px;
      font-family: 'Open Sans';
      letter-spacing: 0px;
      opacity: 0.6;
    }
  }
}

@media (max-width: 740px) {
  #prizes-rule {
    width: 100%;
    padding: 0 12px;
    margin: 32px 0 60px;
    .rule-title {
      font-size: 24px;
    }
  }
}
</style>
