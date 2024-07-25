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
            '- To bridge from a specific network to OpBNB/BNB Chain.',
            '- The <span class="orbiter_global_prizes_rule_tag">minimum amount required: 0.004 ETH.</span>',
            '- Bridge Token: <span class="orbiter_global_prizes_rule_tag">ETH<span>',
            '- The specific networks include: <span class="orbiter_global_prizes_rule_tag">Linea, Ethereum, Optimism, Base, zkSync Lite, Polygon, Arbitrum, Manta, Mantle, Arbitrum Nova, Scroll, ZKSyncEra, Zora.</span>',
          ],
        },
        {
          label: '2. How to Earn $ORBGUY Rewards?',
          text: [
            '- Participants who complete at least 3 transactions daily will qualify to share a $ORBUGY gift box. $ORBUGY gift boxes are distributed daily on a FCFS basis.',
            '- Each address can draw $ORBGUY lucky box once daily by completing tasks, earning one chance per day  Participants could engage in this activity for up to 14 consecutive days.',
            '- Note: Participants securing the 99th, 199th, 299th, 399th, 499th, 599th, and 699th positions when drawing a gift box each day will receive a surprising $ORBGUY bonus.',
            '- Note: The  $ORBUGY gift box update time is 00:00 UTC.'
          ],
        },
        {
          label: '3. How to Earn O-Points Rewards?',
          text: [
            'Participants can accumulate additional O-Points by completing the following tasks:',
            'Complete 3 transactions daily for 3 consecutive days to earn an extra 32 O-Points.',
            'Complete 3 transactions daily for 7 consecutive days to earn an extra 126 O-Points.',
            'Complete 3 transactions daily for 10 consecutive days to earn an extra 240 O-Points.',
            'Complete 3 transactions daily for 14 consecutive days to earn an extra 420O-Points.',
            'Note: The consecutive check-in days are also counted each day at 00:00 UTC. If the check-in streak is broken, the check-in streak will reset to zero.'
          ],
        },
        {
          label: '4. How to Share 200$BNB and get 0 Bridging-Fee?',
          text: [
            '- The top 300 users in the bridging competition will share a 200 $BNB prize pool. Additionally, the top 10 users will receive a 0 Bridging Fee extra reward.',
            '- We will rebate all bridging fees ($2/tx) except for gas fees.'
          ],
        },
        {
          label: '5. What is the 0 Bridging Fee Reward?',
          text: [
            '- For the top 10 users, all bridging fees ($2/tx) except for gas fees will be rebated.',
          ],
        },
        {
          label: '6. What is the rule of ranking?',
          text: [
            '- The ranking is determined based on transactions. If users have the same number of transactions, ranking will be based on the transaction value from largest to smallest. More transactions, greater chance to win!',
          ],
        },
        {
          label: '7. When will the rewards be distributed?',
          text: [
            '- All rewards will be distributed when the competition ends, including $ORBGUY, BNB prize pool and top 10 winners\' all bridging fees.',
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
