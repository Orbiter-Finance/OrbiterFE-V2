import { reactive } from './'

const defaultTradingPairsData = {
  data: [],
}

export const tradingPairsData = reactive({
  ...defaultTradingPairsData,
})

export function updateTradingPairsData(pairsData) {
  tradingPairsData.data = pairsData
}
