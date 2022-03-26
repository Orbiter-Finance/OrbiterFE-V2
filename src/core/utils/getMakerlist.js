import axios from 'axios'
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
        case 2:
            return "token " + process.env.VUE_APP_GITHUBTOKEN_TWO
        case 3:
            return "token " + process.env.VUE_APP_GITHUBTOKEN_THREE
        default:
            return ''
    }
}
async function subGetMakerList(githubToken) {
    const res = await axios({
        url: `${apiUrl}/repos/Orbiter-Finance/makerConfiguration/contents/rinkeby/makerList.json`,
        method: "get",
        headers: {
            Accept: "*/*",
            Authorization: githubToken ? githubToken : '',
        },
    });
    const base64Data = res.data.content;
    const makerListBuffer = Buffer.from(base64Data, 'base64')
    const makerListString = makerListBuffer.toString()
    const data = JSON.parse(makerListString);
    const makerList = data.makerList
    const historyMakerList = data.historyMakerList
    return { makerList, historyMakerList };
}
export default {
    getMakerListData
}