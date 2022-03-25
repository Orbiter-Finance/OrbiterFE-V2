import axios from 'axios'
import { Base64 } from "js-base64";
const apiUrl = "https://api.github.com"

async function getMakerListData() {
    try {
        return await subGetMakerList()
    } catch (error) {
        return await subGetMakerList(randomGithubToken())
    }
}
function randomGithubToken() {
    let randomNumber = parseInt(Math.random() * 4 + 1)
    switch (randomNumber) {
        case 1:
            return "token " + process.env.VUE_APP_GITHUBTOKEN_ONE
            break;
        case 2:
            return "token " + process.env.VUE_APP_GITHUBTOKEN_TWO
            break;
        case 3:
            return "token " + process.env.VUE_APP_GITHUBTOKEN_THREE
            break;
        default:
            return ''
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