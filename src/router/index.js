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
  }, {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启 Props 传参，把路由参数映射到组件的 props 数据
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
