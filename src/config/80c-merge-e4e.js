// RENDER 80C
const fromRule = require('.//eth-80c-prod.json')
const e4eRules = require('./eth-e4e-prod.json')

for (const chain in fromRule) {
  for (const symbol in fromRule[chain]) {
    const rule = fromRule[chain][symbol];
    const e4eFind = e4eRules[chain][symbol];
    if (e4eFind) {
      rule.gasFee = e4eFind.gasFee;
      rule.tradingFee = e4eFind.tradingFee;
      console.log('change-', rule);
    }
  }
}
console.log(JSON.stringify(fromRule))
