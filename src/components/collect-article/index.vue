<template>
  <van-button :loading="loading" @click="onCollect" :class="{collected: isCollected}" :icon="isCollected ? 'star' : 'star-o'" />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    isCollected: {
      type: Boolean,
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
    async onCollect () {
      this.loading = true
      try {
        if (this.isCollected) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('update:isCollected', !this.isCollected)
        this.$toast.success(!this.isCollected ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  /deep/ .van-icon {
    color: #ffa500;
  }
}
</style>
