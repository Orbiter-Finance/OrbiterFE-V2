import {
  Steps,
  Step,
  InputNumber,
  Loading,
  Notification,
  MessageBox,
  Button,
  Dialog,
  Input,
} from 'element-ui'
const element = {
  install: function (Vue) {
    Vue.use(Steps)
    Vue.use(Step)
    Vue.use(InputNumber)
    Vue.use(Loading)
    Vue.use(Button)
    Vue.use(Dialog)
    Vue.use(Input)
    // Vue.prototype.$message = Message
    Vue.prototype.$notify = Notification
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
  },
}
export default element
