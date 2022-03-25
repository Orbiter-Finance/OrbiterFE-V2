import thegraph from '../actions/thegraph'
export default {
  getMakerInfoFromGraph: async function (req, next) {
    return await thegraph.getMakerInfo(req, next)
  },
}
