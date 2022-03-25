import axios from 'axios'
import { Base64 } from "js-base64";
const apiUrl = "https://api.github.com"
const githubToken = 'token ' + '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'
async function getMakerListData() {
    try {
        return await subGetMakerList()
    } catch (error) {
        return await subGetMakerList(githubToken)
    }
}

async function subGetMakerList(githubToken) {
    const res = await axios({
        url: `${apiUrl}/repos/anengzend/block-chain-demo/contents/data-dev.json`,
        method: "get",
        headers: {
            Accept: "*/*",
            Authorization: githubToken ? githubToken : '',
        },
    });
    const base64Data = res.data.content;
    const dataString = Base64.decode(base64Data);
    const data = JSON.parse(dataString);
    const makerList = data.makerList
    const historyMakerList = data.historyMakerList
    return { makerList, historyMakerList };
}
export default {
    getMakerListData
}