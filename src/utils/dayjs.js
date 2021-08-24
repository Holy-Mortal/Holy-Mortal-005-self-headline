import dayjs from 'dayjs'

/* 加载中文语言包 */
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

/* day.js 默认语言为英文，将其配置为中文 */
dayjs.locale('zh-cn') // 全局使用

/* vue3停止使用filter */
// 定义一个全局过滤器，仅仅供模板使用
/* 参数1：过滤器名称  参数2：过滤器函数  使用方式：{{ 表达式 | 过滤器名称 }} */
// 管道符（|）前面表达式的结果作为参数传递到过滤器函数中
// 过滤器返回值会渲染到使用过滤器的模板位置
// Vue.filter('relativeTime', value => {
//   return dayjs().to(dayjs(value))
// })

export function filtertime (value) {
  return dayjs().to(dayjs(value))
}

/* dayjs() 获取当前最新时间 */
// dayjs().format('YYYY-MM-DD')
// console.log(dayjs().from(dayjs('1990'))) // 31 年后
// dayjs().from(dayjs('1990-01-01'), true) // 31 年
// dayjs().fromNow()
// dayjs().to(dayjs('1990-01-01')) // 31 年前
// dayjs().toNow()
