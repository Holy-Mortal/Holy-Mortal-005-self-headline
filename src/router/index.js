import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  }, {
    path: '/',
    name: 'layout', // 有默认子路由后，父路由name值可删除
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 空字符串表示 默认子路由 '/'
        name: 'home',
        component: () => import('@/views/home')
      }, {
        path: '/queswer',
        name: 'queswer',
        component: () => import('@/views/queswer')
      }, {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      }, {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }, {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
