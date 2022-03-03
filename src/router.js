import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const originalPush = Router.prototype.push

// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Sender',
      component: (resolve) => require(['./views/sender'], resolve),
      meta: {
        title: 'Orbiter',
        keepAlive: true,
      },
    },
    {
      path: '/maker',
      name: 'Maker',
      component: (resolve) => require(['./views/maker'], resolve),
      meta: {
        title: 'Orbiter',
      },
    },
  ],
})
