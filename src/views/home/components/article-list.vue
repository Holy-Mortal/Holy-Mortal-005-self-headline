<template>
  <div class="article-list">
    <!-- List 列表组件：瀑布流滚动加载，用于展示长列表 -->
    <!-- v-model:loading 是否处于加载状态，加载过程中不触发 load 事件 默认为 false -->
    <!-- finished 是否已加载完成，加载完成后不再触发 load 事件  默认为 false -->
    <!-- finished-text 加载完成后的提示文案 -->
    <van-pull-refresh v-model="isreFreshLoading" :success-text="refreshSuccessText" success-duration="1500" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" v-model:error="error"
  error-text="请求失败，点击重新加载" @load="onLoad">
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
        <article-item v-for="(article, index) in list" :key="index" :article="article" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // onLoad () {
    // // 1.异步更新数据(请求获取数据)
    // // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    // setTimeout(() => {
    //   // 2. 把请求结果数据放到 list 数组中
    //   for (let i = 0; i < 10; i++) {
    //     this.list.push(this.list.length + 1)
    //   }
    //   // 3. 本次数据加载状态结束后 修改加载状态设置为结束
    //   // loading 关闭以后才能触发下一次的加载更多
    //   this.loading = false
    //   // 4. 判断数据是否全部加载完成
    //   if (this.list.length >= 40) {
    //     // 如果没有数据，把 finished 设置为 true，之后不再触发加载更多
    //     this.finished = true
    //   }
    // }, 1000)
  // }
    async onLoad () {
      try {
        // 1.异步更新数据(请求获取数据)
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // 当前最新时间戳（请求第1页数据）Date.now()
          // 用于请求之后的数据的时间戳会在当前请求结果中放回
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // console.log(data)
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        this.list.push(...results) // 数组展开操作符 把数组元素一个个拿出
        // 3. 本次数据加载状态结束后 修改加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据就将 finished 设置为 true
          this.finished = true
        }
      } catch (err) {
        // console.log('请求失败', err)
        // 展示错误提示状态
        this.error = true
        // 请求失败，关闭 loading
        this.loading = false
      }
    },
    // 下拉刷新调用该函数
    async onRefresh () {
      try {
        // console.log('onRefresh')
        // 1. 异步更新数据(请求获取数据)
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(), // 下拉刷新获取最新数据，传递当前时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 2. 将数据追加到列表顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false
        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        // console.log('请求失败', err)
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  height: 158vw;
  overflow-y: auto;
}
</style>
