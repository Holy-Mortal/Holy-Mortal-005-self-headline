/* 封装 axios 请求模块 */
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// JSON.parse()
// JSON.stringify()

// JSONBig 可以处理数据中超出 JavaScript 安全整数范围（-2^53 ~ 2^53）的问题
// JSONBig.parse() // 把 JSON 格式字符串转为 JavaScript 对象
// JSONBig.parse(变量).属性名.toString() // 将对象转为 字符串
// JSONBig.stringify() // 把 JavaScript 对象转为 JSON 格式字符串
// JSONBig.stringify(JSONBig.parse(变量))

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  // 自定义后端返回的原始数据
  // data：后端返回的原始数据，即 JSON 格式的字符串
  transformResponse: [function (data) {
    /* // axios 默认会在内部处理后端返回的数据
    // return JSON.parse(data) */
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
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
