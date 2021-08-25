<template>
  <div class="search-suggestion">
    <van-cell icon="search" v-for="(text, index) in suggestions" :key="index" @click="$emit('search', text)">
      <template #title>
        <div v-html="highlight(text)"></div>
      </template>
    </van-cell>
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
      // htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生改变时，就调用 handler 函数
      // 注意：handler 函数名称是固定的
      // handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      /* debounce 函数： */
      // 参数1：一个函数    参数2：延迟时间，单位毫秒    返回值：防抖后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
        // console.log(data)
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 需要根据数据变量动态创建正则表达式，则手动 new RegExp
      /* RegExp 正则表达式构造函数 g：全局  i：不区分大小写
      参数1：匹配模式字符串，根据字符串创建正则对象
      参数2：匹配模式，要写到字符串中 */
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
