<template>
  <div >
    <div v-for="item in questsList" :key="item.id">
      <div v-if="item.type === 'CHECKIN'">
        <CheckInTaskCard :dataInfo="item"></CheckInTaskCard>
      </div>
      <div v-else-if="item.type === 'LUCKYBAG'">
        <LuckyTaskCard></LuckyTaskCard>
      </div>
      <div v-else-if="item.type === 'OPOINT'">
        <ActivityTaskCard :dataInfo="item"></ActivityTaskCard>
      </div>
      <div v-else></div>
    </div>
  </div>
</template>

<script>
import { questsInfoList } from '../../../composition/hooks'
import CheckInTaskCard from "./CheckInTaskCard.vue"
import ActivityTaskCard from "./ActivityTaskCard.vue"
import LuckyTaskCard from "./LuckyTaskCard.vue"
export default {
  name: 'HeaderQuestsTaskList',
  computed: {
    questsList(){
      return questsInfoList.value
    }
  },
  components: {
    CheckInTaskCard,
    ActivityTaskCard,
    LuckyTaskCard
  },
}
</script>

<style>


</style>