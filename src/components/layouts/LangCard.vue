<template>
  <div class="lang-card" @click="openChange">
    <svg-icon class="lang" iconName="lang" fill="currentColor"></svg-icon>
    <span class="label">{{ label }}</span>
    <div v-if="open" class="lang-modal">
      <div
      @click="langChange(item)"
      v-for="item in langList" :key="item.key" :class="item.key === lang ? 'lang-modal-item active' : 'lang-modal-item' ">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '../SvgIcon/SvgIcon.vue'
export default {
  name: 'LangCard',
  components: { SvgIcon },
  data() {
    return {
      lang: localStorage.getItem('ORBITER_LANG') || 'en',
      langList: [
        {
          key: 'en',
          label: 'English',
        },
        {
          key: 'kr',
          label: '한국어',
        },
      ],
      open: false
    }
  },
  computed: {
    label(){
        const group = this.langList.filter((item)=> this.lang === item.key)[0]
        return group?.label
    }
  },
  methods: {
    openChange() {
      this.open = !this.open
    },
    langChange(group) {
      localStorage.setItem('ORBITER_LANG', group.key)
      this.$i18n.locale = group.key
      this.lang = group.key
    }
  }
}
</script>

<style scoped lang="scss">
.lang-card {
  width: 108px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  color: rgb(26, 26, 26);
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 700;
  position: relative;
  cursor: pointer;
  .lang {
    width: 24px;
    height: 24px;
  }
  .label {
    margin-left: 8px;
    font-size: 14px;
    font-family: GeneralSans-Medium;
  }
  .lang-modal {
    border-radius: 8px;
    background: rgb(255, 255, 255);
    position: absolute;
    top: 48px;
    right: 0;
    width: 120px;
    padding: 8px;
    .lang-modal-item {
      padding: 4px 8px;
      font-size: 14px;
      display: flex;
      justify-content: start;
      align-items: center;
      font-family: GeneralSans-Medium;
      cursor: pointer;
    }

    .active {
      border-radius: 4px;
      background: rgb(245, 245, 245);
    }
  }
}
</style>
