import axios from 'axios'
import { Base64 } from "js-base64";
const apiUrl = "https://api.github.com"
async function getData() {
    const res = await axios({
        url: `${apiUrl}/repos/anengzend/block-chain-demo/contents/data-dev.json`,
        method: "get",
        headers: {
            Accept: "*/*",
            Authorization: `token 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`,
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
    getData
}