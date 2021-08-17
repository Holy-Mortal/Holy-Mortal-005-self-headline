/* 封装 axios 请求模块 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起时运行
  // config 本次请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 务必返回 config 配置对象，否则停留在此
  return config
}, function (error) {
  // 请求出错时运行（请求未发出）
  return Promise.reject(error)
})

// 响应拦截器
export default request
