// const allRules = require('./eth-e4e-prod.json');
// const changeFromRules = require('./0x3472-prod.json');
// for (const chain in changeFromRules) {
//     for (const symbol in changeFromRules[chain]) {
//         const findData = allRules[chain][symbol];
//         if (findData) {
//             changeFromRules[chain][symbol].gasFee = findData.gasFee;
//             changeFromRules[chain][symbol].tradingFee = findData.tradingFee;
//             changeFromRules[chain][symbol].maxPrice = findData.maxPrice;
//             changeFromRules[chain][symbol].minPrice = findData.minPrice;
//             changeFromRules[chain][symbol].tieredFee = findData.tieredFee;
//         }
//     }
// }
// console.log(JSON.stringify(changeFromRules))


// change fee
const allRules = require('./0x3472-prod.json');
for (const chain in allRules) {
    const [fcId, tcId] = chain.split('-');
    for (const symbol in allRules[chain]) {
        const [fsName, tsName] = chain.split('-');
        const rule = allRules[chain][symbol];
        if (fcId === '40' && tcId=='1') {
            console.log(chain, '==')
            rule.tradingFee = 0.0022;
            rule.gasFee = 2.5;
            rule.tieredFee = [{
                "range": [
                    0,
                    0.1
                ],
                "tradeFee": 0,
                "withholdingFee": 0.0022
            },
            {
                "range": [
                    0.1,
                    0.3
                ],
                "tradeFee": 2,
                "withholdingFee": 0.0022
            },
            {
                "range": [
                    0.3,
                    9999999999
                ],
                "tradeFee": 2.5,
                "withholdingFee": 0.0022
            }
            ];
        }else if (fcId === '40') {
            rule.gasFee = 2.5;
            rule.tradingFee = 0.0005;
            rule.tieredFee = [{
                "range": [
                    0,
                    0.1
                ],
                "tradeFee": 0,
                "withholdingFee": 0.0005
            },
            {
                "range": [
                    0.1,
                    0.3
                ],
                "tradeFee": 2,
                "withholdingFee": 0.0005
            },
            {
                "range": [
                    0.3,
                    9999999999
                ],
                "tradeFee": 2.5,
                "withholdingFee": 0.0005
            }
            ];
        }
    }
}

console.log(JSON.stringify(allRules))