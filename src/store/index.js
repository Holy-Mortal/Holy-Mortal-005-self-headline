import { createStore } from 'vuex'
import { getItem, setItem } from '@/utils/storage'

const TOKEN_KEY = 'TOUTIAO_USER'

export default createStore({
  state: {
    // user 是一个对象，存储当前登录用户信息（token等数据）
    // user: null
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 数据持久化
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
