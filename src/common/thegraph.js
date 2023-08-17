import axios from 'axios';
import util from "../util/util";
import BigNumber from "bignumber.js";

export async function getMdcRuleLatest(dealerAddress) {
    if (!new RegExp(/^0x[a-fA-F0-9]{40}$/).test(dealerAddress)) {
        return [];
    }
    const thegraphApi = process.env.VUE_APP_THEGRAPH_API;
    if (!thegraphApi) {
        return [];
    }
    const res = await axios.post(thegraphApi, {
        query: `{
        dealer(id: "${ dealerAddress }") {
            mdcs {
            id
            owner
            mapping {
              chainIdMapping {
                chainId
                chainIdIndex
              }
              dealerMapping {
                dealerAddr
                dealerIndex
              }
              ebcMapping {
                ebcAddr
                ebcIndex
              }
            }
            ruleLatest {
              latestUpdateTimestamp
              ebc {
                id
              }
              id
              chain0
              chain0ResponseTime
              chain0Status
              chain0Token
              chain0TradeFee
              chain0WithholdingFee
              chain0maxPrice
              chain0minPrice
              chain1
              chain1CompensationRatio
              chain1ResponseTime
              chain1Status
              chain1Token
              chain1TradeFee
              chain1WithholdingFee
              chain1maxPrice
              chain1minPrice
            }
          }
        }
      }`
    });
    const mdcs = res.data?.data?.dealer?.mdcs || [];
    const marketList = [];
    for (const mdc of mdcs) {
        const chainIdMap = {};
        if (!mdc?.mapping?.chainIdMapping?.length) continue;
        for (const chainIdData of mdc.mapping.chainIdMapping) {
            chainIdMap[chainIdData.chainId] = chainIdData.chainIdIndex;
        }
        const ruleLatests = mdc.ruleLatest;
        for (const ruleLatest of ruleLatests) {
            const ebcId = mdc.mapping.ebcMapping.find(item => item.ebcAddr === ruleLatest.ebc.id)?.ebcIndex;
            const dealerId = mdc.mapping.dealerMapping.find(item => item.dealerAddr === dealerAddress)?.dealerIndex;
            if (ruleLatest.chain0) {
                const token0 = util.getTokenByTokenAddress(String(ruleLatest.chain0), ruleLatest.chain0Token);
                const token1 = util.getTokenByTokenAddress(String(ruleLatest.chain1), ruleLatest.chain1Token);
                const chainInfo0 = util.getV3ChainInfoByChainId(String(ruleLatest.chain0));
                const chainInfo1 = util.getV3ChainInfoByChainId(String(ruleLatest.chain1));
                if (!token0 || !token0) {
                    console.log("none of token", ruleLatest.chain0, ruleLatest.chain0Token, ruleLatest.chain1, ruleLatest.chain1Token);
                    continue;
                }
                marketList.push({
                    dealerId,
                    ebcId,
                    recipient: mdc.owner,
                    sender: mdc.owner,
                    spentTime: ruleLatest.chain0ResponseTime,
                    fromChain: {
                        id: chainIdMap[ruleLatest.chain0],
                        networkId: ruleLatest.chain0,
                        chainId: ruleLatest.chain0,
                        name: chainInfo0.name,
                        symbol: token0?.symbol,
                        tokenAddress: ruleLatest.chain0Token,
                        decimals: token0?.decimals,
                        maxPrice: +ruleLatest.chain0maxPrice,
                        minPrice: +ruleLatest.chain0minPrice,
                    },
                    toChain: {
                        id: chainIdMap[ruleLatest.chain1],
                        networkId: ruleLatest.chain1,
                        chainId: ruleLatest.chain1,
                        name: chainInfo1.name,
                        symbol: token1?.symbol,
                        tokenAddress: ruleLatest.chain1Token,
                        decimals: token1?.decimals,
                    },
                    gasFee: new BigNumber(ruleLatest.chain0TradeFee).multipliedBy(10).toFixed(),
                    tradingFee: new BigNumber(ruleLatest.chain0WithholdingFee).dividedBy(10 ** (token0?.decimals || 18)).toFixed(),
                    times: [0, 99999999999999],
                });
            }
            if (ruleLatest.chain1) {
                const token0 = util.getTokenByTokenAddress(Number(ruleLatest.chain0), ruleLatest.chain0Token);
                const token1 = util.getTokenByTokenAddress(Number(ruleLatest.chain1), ruleLatest.chain1Token);
                const chainInfo0 = util.getChainInfoByNetworkId(Number(ruleLatest.chain0));
                const chainInfo1 = util.getChainInfoByNetworkId(Number(ruleLatest.chain1));
                if (!token0 || !token0) {
                    console.log("none of token", ruleLatest.chain0, ruleLatest.chain0Token, ruleLatest.chain1, ruleLatest.chain1Token);
                    continue;
                }
                marketList.push({
                    dealerId,
                    ebcId,
                    recipient: mdc.owner,
                    sender: mdc.owner,
                    spentTime: ruleLatest.chain1ResponseTime,
                    fromChain: {
                        id: Number(chainIdMap[ruleLatest.chain1]),
                        networkId: ruleLatest.chain1,
                        chainId: ruleLatest.chain1,
                        name: chainInfo1.name,
                        symbol: token1?.symbol,
                        tokenAddress: ruleLatest.chain1Token,
                        decimals: token1?.decimals,
                        maxPrice: +ruleLatest.chain1maxPrice,
                        minPrice: +ruleLatest.chain1minPrice,
                    },
                    toChain: {
                        id: Number(chainIdMap[ruleLatest.chain0]),
                        networkId: ruleLatest.chain0,
                        chainId: ruleLatest.chain0,
                        name: chainInfo0.name,
                        symbol: token0?.symbol,
                        tokenAddress: ruleLatest.chain0Token,
                        decimals: token0?.decimals,
                    },
                    gasFee: new BigNumber(ruleLatest.chain1TradeFee).multipliedBy(10).toFixed(),
                    tradingFee: new BigNumber(ruleLatest.chain1WithholdingFee).dividedBy(10 ** (token1?.decimals || 18)).toFixed(),
                    times: [0, 99999999999999],
                });
            }
        }
    }
    console.log("marketList ====", marketList);
    return marketList;
}
