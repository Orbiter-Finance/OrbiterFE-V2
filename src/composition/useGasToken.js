import { reactive } from './'

const defaultGasTokenInfo = {
  info: {},
}

export const gasTokenInfo = reactive({
  ...defaultGasTokenInfo,
})

export function updateGasTokenInfo(value) {
  gasTokenInfo.info = value
}
