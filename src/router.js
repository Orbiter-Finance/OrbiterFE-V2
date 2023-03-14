import Vue from 'vue'
import Router from 'vue-router'

const Data = () => import('./views/data/Index/Index.vue')
const DataDetail = () => import('./views/data/DataDetail/DataDetail.vue')

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
      component: (resolve) => require(['./views/bridage/Bridage'], resolve),
      meta: {
        title: 'Orbiter',
        keepAlive: true,
      },
    },
    {
      path: '/history',
      component: (resolve) => require(['./views/History'], resolve),
      meta: {
        title: 'Orbiter',
        keepAlive: true,
      },
    },
    {
      path: '/data',
      component: Data,
      meta: {
        title: 'Orbiter',
        keepAlive: false,
      },
    },
    {
      path: '/dataDetail',
      component: DataDetail,
      meta: {
        title: 'Orbiter',
        keepAlive: false,
      },
    },
  ],
})
