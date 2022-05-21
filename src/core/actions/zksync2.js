
import Web3 from "web3"
import config from '../utils/config'
import store from "../../store"
import util from "../../util/util"
import { axiosPlus } from "../utils/Axios"
let configNet = config.zkSync2.Mainnet

export default {
    getZK2TokenAllList: async function (chainId, count = 10) {
        let tokenList = chainId == 514 ? store.state.zk2tokenList.rinkeby : store.state.zk2tokenList.mainnet
        if (tokenList.length == 0) {
            count--;
            await util.sleep(300)
            if (count) {
                await this.getZK2TokenAllList(chainId, count)
            } else {
                return []
            }
        } else {
            return tokenList
        }
    },
    getTxList: async function (userAddress, timeStamp) {
        let partTxinfoUrl = `https://zksync2-testnet.zkscan.io/address/${userAddress}/token-transfers?type=JSON`
        const txHashs = []
        let isContinue = true
        while (isContinue) {
            const partTxInfos = await axiosPlus("get", partTxinfoUrl)
            if (!partTxInfos.next_page_path) {
                isContinue = false
            } else {
                partTxinfoUrl = `https://zksync2-testnet.zkscan.io${partTxInfos.next_page_path}&type=JSON`
            }
            const allPromiseTx = partTxInfos.items.map(async (item) => {
                try {
                    const dom = window.document.createElement("div");
                    dom.innerHTML = item;
                    let txType = dom.getElementsByClassName("tile-label")[0].textContent
                    let txStatus = dom.getElementsByClassName("tile-status-label")[0].textContent
                    if (!txType || txType.trim() != "Token Transfer" || !txStatus || txStatus.trim() != "Success") {
                        return
                    }
                    let hash = dom.getElementsByClassName("tile")[0].getAttribute("data-identifier-hash")
                    let timeString = dom.getElementsByClassName("mr-2 mr-md-0 order-2")[0].getAttribute("data-from-now")

                    let tokenAddress = dom.getElementsByClassName("col-xs-12 col-lg-4 ml-3 ml-sm-0")[0].getElementsByTagName("a")[0].getAttribute("href")
                    tokenAddress = tokenAddress ? tokenAddress.slice(-42) : null
                    let from = dom.getElementsByClassName("tile-type-token-transfer-short-name")[0].getElementsByTagName("span")[0].getAttribute("data-address-hash")
                    let to = dom.getElementsByClassName("tile-type-token-transfer-short-name")[1].getElementsByTagName("span")[0].getAttribute("data-address-hash")
                    if (to == "0xde03a0b5963f75f1c8485b355ff6d30f3093bde7") {
                        to = dom.getElementsByClassName("tile-type-token-transfer-short-name")[1].getElementsByTagName("span")[3].getAttribute("data-address-hash")
                    }
                    let value = dom.getElementsByClassName("col-xs-12 col-lg-4 ml-3 ml-sm-0")[0].firstChild?.nodeValue
                    let tokenName = dom.getElementsByClassName("col-xs-12 col-lg-4 ml-3 ml-sm-0")[0].getElementsByTagName("a")[0].textContent
                    const nonce = await this.getNonce(hash)
                    const theTimeStamp = timeString ? Date.parse(timeString) / 1000 : 0
                    const txInfo = {
                        hash: hash ? hash.trim() : null,
                        timeString: theTimeStamp ? theTimeStamp + "" : null,
                        txStatus: txStatus && txStatus.trim() == "Success" ? "finalized" : null,
                        tokenAddress: tokenAddress ? tokenAddress.trim() : null,
                        from: from ? from.trim() : null,
                        to: to ? to.trim() : null,
                        value: value ? value.trim() : null,
                        tokenName: tokenName ? tokenName.trim() : null,
                        nonce: nonce
                    }
                    if (theTimeStamp < timeStamp) {
                        isContinue = false

                    } else {
                        txHashs.push(txInfo)
                    }
                } catch (error) {
                    console.warn(`get zk2 one tx error${error}`)
                }
            })
            await Promise.all(allPromiseTx)
        }
        return txHashs
    },
    getNonce: async function (hash) {
        const theTxInfoUrl = `https://zksync2-testnet.zksync.dev`
        const params = {
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [hash],
            "id": 1
        }
        try {
            const resp = await axiosPlus("post", theTxInfoUrl, params)
            return resp && resp.result && resp.result.nonce ? Web3.utils.hexToNumberString(resp.result.nonce) : null
        } catch (error) {
            console.warn('get zk2 nonce error')
            return null
        }
    }

}
