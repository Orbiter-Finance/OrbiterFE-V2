import { ref } from './'

export const questsInfoList = ref([])

export const questsUserInfoList = ref([])

export const setQuestsInfoList = (value) => {
  questsInfoList.value = value
}

export const setQuestsUserInfoList = (value) => {
  questsUserInfoList.value = value
}
