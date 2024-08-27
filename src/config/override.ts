const allRules = require('./eth-e4e-prod.json');
const changeFromRules = require('./0x3472-prod.json');
for (const chain in changeFromRules) {
    for (const symbol in changeFromRules[chain]) {
        const findData = changeFromRules[chain][symbol];
        if (findData) {
            changeFromRules[chain][symbol].gasFee = findData.gasFee;
            changeFromRules[chain][symbol].tradingFee = findData.tradingFee;
            changeFromRules[chain][symbol].maxPrice = findData.maxPrice;
            changeFromRules[chain][symbol].minPrice = findData.minPrice;
        }
    }
}
console.log(JSON.stringify(changeFromRules))