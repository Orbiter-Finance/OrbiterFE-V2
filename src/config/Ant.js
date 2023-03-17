import { Radio, Tooltip, Checkbox } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less' // or 'ant-design-vue/dist/antd.less'

const ant = {
  install: function (Vue) {
    Vue.use(Radio)
    Vue.use(Tooltip)
    Vue.use(Checkbox)
  },
}
export default ant
