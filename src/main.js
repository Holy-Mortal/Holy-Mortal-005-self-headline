import { createApp } from 'vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'

const app = createApp(App)
// app.config.globalProperties.$http = () => {
//   console.log('http请求')
// }
app.use(Vant)
app.use(store).use(router).mount('#app')
