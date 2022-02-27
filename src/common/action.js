// import {
//   Message
// } from 'element-ui'
import { methodTest } from './api'

//test
async function testMethod(opts, successCall, failCall) {
  try {
    const res = await methodTest({
      ...opts,
    })
    if (res && res.body) {
      const result = JSON.parse(res.body)
      if (res.statusCode === 200) {
        if (result.code === 0) {
          successCall(result.message, 'success', result)
        } else {
          failCall(result.message, result.codez)
        }
      } else {
        failCall(
          result.message ? result.message : 'network error',
          res.statusCode
        )
      }
    } else {
      failCall('network error', 'error')
    }
  } catch (e) {
    failCall('network error', 'error')
  }
}

export { testMethod }
