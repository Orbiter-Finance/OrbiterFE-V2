
// RENDER 80C
const fromRule = require('./e4e-prod.json');
const toRule = require('./80c-prod.json');
console.log(fromRule, '=toRule')
const l1Maker = '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8';
const l2Maker = '0x064A24243F2Aabae8D2148FA878276e6E6E452E3941b417f3c33b1649EA83e11';
const l1AfterMaker = '0x80c67432656d59144ceff962e8faf8926599bcf8';
const l2AfterMaker = '0x07b393627bd514d2aa4c83e9f0c468939df15ea3c29980cd8e7be3ec847795f0';
for (const chain in fromRule) {
    for(const symbol in fromRule[chain]) {
        const rule = fromRule[chain][symbol];
        if(!toRule[chain]) {
            console.log('ChainId not found', chain);
            toRule[chain] = {}
        }
        if (!toRule[chain][symbol]) {
            console.log('Rule not found', chain, symbol);
            for (const k in rule) {
                if (String(rule[k]).toLocaleLowerCase() === l1Maker.toLocaleLowerCase()) {
                    rule[k] = l1AfterMaker;
                }
                if (String(rule[k]).toLocaleLowerCase() === l2Maker.toLocaleLowerCase()) {
                    rule[k] = l2AfterMaker;
                }
            }
            toRule[chain][symbol] = rule;
        }
    }
}
// console.log(JSON.stringify(toRule), '=fromRule')