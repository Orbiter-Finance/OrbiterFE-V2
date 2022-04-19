import axios from 'axios'
const apiUrl = "https://maker-list.s3.amazonaws.com"
async function getNewMakerList(count = 0) {
    try {
        return await getNewMakerListOnce()
    } catch (error) {
        errorLogger.error(
            `getNewMakerList error=${error.message},try again ${count}`
        )
        count++
        if (count < 5) {
            return await getNewMakerList(count)
        }
    }
}

async function getNewMakerListOnce() {
    const res = await axios({
        url: `${apiUrl}/maker_list.json`,
        method: "get"
    });
    if (res.status == 200) {
        return { ...res.data }
    } else {
        throw new Error("pull maker_list nothing")
    }
}
export default {
    getNewMakerList
}