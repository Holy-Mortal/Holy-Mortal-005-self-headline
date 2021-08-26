<template>
  <van-button :loading="loading" @click="onLike" :class="{liked: numAttitude === 1}" :icon="numAttitude === 1 ? 'good-job' : 'good-job-o'" />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    numAttitude: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLike () {
      this.loading = true
      try {
        let status = -1
        if (this.numAttitude === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId)
        } else {
          // 未点赞，添加点赞
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('update:numAttitude', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.liked {
  /deep/ .van-icon {
    color: #e5645f;
  }
}
</style>
