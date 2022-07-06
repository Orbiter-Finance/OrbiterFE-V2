// deprecate !!! this file will delete!!!
import { getMakerInfo } from '../actions/thegraph'
export default {
  // deprecate!!!
  getMakerInfoFromGraph: function(req, next) {
    return new Promise((resolve, reject) => {
      getMakerInfo(req, next)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
