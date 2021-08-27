<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error" error-text="加载失败，请点击重试！">
    <comment-item v-for="(item, index) in list" :key="index" :comment="item" />
    <!-- <comment-item v-for="(item, index) in list" :key="index" :comment="item" @click-reply="isReplyShow = true" /> -->
  </van-list>
</template>

<script>
import { getComment } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      comList: this.list,
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
      // isReplyShow: false,
      // currentComment: {} // 点击回复的那个评论对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getComment({
          type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id 或 评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 2. 将数据添加到数组列表
        // console.log(data)
        const { results } = data.data
        this.comList.push(...results)
        // 把文章评论总数量传递到外部
        this.$emit('onload-success', data.data)
        // 3. 将本次加载中的 loading 关闭
        this.loading = false
        // 4. 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一页数据的页码
          this.offset = data.data.last_id
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
