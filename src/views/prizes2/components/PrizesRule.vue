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
          label: '1. Which networks are participating in this event?',
          text: [
            '- To bridge from a specific network to OpBNB/BNB Chain, the <span>minimum amount required is 0.004 ETH.</span>',
            '- The specific networks include: <span>Linea, Ethereum, Optimism, Base, zkSync Lite, Polygon, Arbitrum, Manta, Mantle, Arbitrum Nova, Scroll, ZKSyncEra, Zora, Starknet.</span>',
          ],
        },
        {
          label: '2. How to Earn $ORBGUY Rewards?',
          text: [
            '- Participants who complete at least 3 transactions daily will qualify to share a $ORBUGY gift bag valued at 4,000 USDC. 707 gift bags are distributed daily on a FCFS basis. Participants could engage in this activity for up to 14 consecutive days. ',
            '- Note: Participants securing the 99th, 199th, 299th, 399th, 499th, 599th, and 699th positions when drawing a gift bag each day will receive a surprising $ORBGUY bonus.',
            'Note: The lucky bag update time is 00:00 UTC.',
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
          label: '3. How to Earn O-Points Rewards?',
          text: [
            'Participants can accumulate additional O-Points by completing the following tasks:',
            'Complete 3 transactions daily for 3 consecutive days to earn an extra 32 O-Points.',
            'Complete 3 transactions daily for 7 consecutive days to earn an extra 105 O-Points.',
            'Complete 3 transactions daily for 10 consecutive days to earn an extra 165 O-Points.',
            'Complete 3 transactions daily for 14 consecutive days to earn an extra 275 O-Points.',
            'Note: The consecutive check-in days are also counted each day at 00:00 UTC. If the check-in streak is broken, the check-in streak will reset to zero.'
          ],
        },
        {
          label: '4. How to Share 80,000 USDC and get 0 Bridging-Fee？',
          text: [
            '- The top 100 users in the bridging competition will share an 80,000 USDC prize pool. Additionally, the top 10 users will receive a 0 Bridging Fee reward.',
            '- The top 10 will also receive additional bonuses as follows:',
            '1st Place: 2,000 USDC',
            '2nd Place: 1,500 USDC',
            '4th to 10th Places: 600 USDC each',
            'We will rebate all bridging fees (up to 2USDC/tx) except for gas fees.',
          ],
        },
        {
          label: '5. What is the 0 Bridging Fee Reward?',
          text: [
            '- For the top 10 users, all bridging fees (up to 2USDC/tx) except for gas fees will be rebated.',
            '- The rewards will be distributed when the competition ends.',
          ],
        },
        {
          label: '6. When will the rewards be distributed?',
          text: [
            'All rewards will be distributed when the competition ends. Please stay informed and claim your rewards within 3 days of the reward claim portal opening!'
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
    padding: 8px 24px 24px;
    width: 100%;
    border: 1px solid rgba(243, 223, 47, 0.3);
    background: rgb(1, 1, 1);
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
      opacity: 0.6;
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
