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
        >
          {{ option }}
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
          label: 'How to get rewards',
          text: [
            'Complete the following tasks to get the corresponding reward points:',
            '1. Completion of the activity official tweet forwarding: bonus 3 points',
            '2. Completion of the first transaction: additional 5 bonus points',
            '3. Completion of the second transaction: an additional 12 points.',
            'Accumulate the specified number of transactions, you can participate in the bonus pool:',
            '- Accumulated 3 transactions: 10% of the bonus pool.',
            '- Accumulated 5 transactions: 15% of the bonus pool',
            '- Accumulated 8 transactions: 20% of the bonus pool',
            '- Accumulated 15 transactions: 25% of the bonus pool',
            '- Top 100 trades (number of trades must be greater than 20): 30% of the bonus pool.',
          ],
        },
        {
          label: 'Bonus pool release rules',
          text: [
            '- If the number of participants is less than 5000, the initial bonus pool is $25,000.',
            '- For every 1,000 new traders, the bonus will be increased by $2,000, and the bonus pool will be increased until it reaches the maximum of $100,000.',
          ],
        },
        {
          label: 'Special Instructions',
          text: [
            '- To be eligible for the $100,000 prize pool, you only need to have completed at least 3 transactions.',
            '- The top 100 traders during the campaign period will receive up to $1,500.',
            '- The more participants you have, the higher the prize pool will be!',
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
    margin-top: 16px;
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
      letter-spacing: 0px;
      opacity: 0.6;
    }
  }
}
</style>
