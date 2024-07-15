import Vue from 'vue'
import Router from 'vue-router'

const Data = () => import('./views/data/Index/Index.vue')
const DataDetail = () => import('./views/data/DataDetail/DataDetail.vue')
const Home = () => import('./views/home/index.vue')
const Statistics = () => import('./views/statistics/index.vue')
const PrizesOld = () => import('./views/prizes/index.vue')
const Prizes = () => import('./views/prizes2/index.vue')

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
      component: (resolve) => require(['./views/bridge/Bridge'], resolve),
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
    // {
    //   path: '/home',
    //   component: Home,
    //   meta: {
    //     title: 'Orbiter',
    //     keepAlive: false,
    //   },
    // },
    {
      path: '/statistics',
      component: Statistics,
      meta: {
        title: 'Statistics',
        keepAlive: false,
      },
    },
    {
      path: '/prizes-old',
      component: PrizesOld,
      meta: {
        title: 'Prizes',
        keepAlive: false,
      },
    },
    {
      path: '/prizes',
      component: Prizes,
      meta: {
        title: 'Prizes',
        keepAlive: false,
      },
    },
  ],
})
