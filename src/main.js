import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载 Vant 核心组件库
import Vant from 'vant'

// 加载 Vant 全局样式
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'

const app = createApp(App)

// 注册使用 Vant 组件库
app.use(Vant)

app.use(store).use(router).mount('#app')
