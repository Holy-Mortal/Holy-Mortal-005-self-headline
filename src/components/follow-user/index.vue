<template>
  <van-button v-if="isFollowed" class="follow-btn" round :loading="loading" size="small" @click="onFollow">已关注</van-button>
  <van-button v-else class="follow-btn" type="primary" color="#3296fa" round :loading="loading" size="small" icon="plus" @click="onFollow">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
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
    async onFollow () {
      this.loading = true // 展示关注按钮的 loading 状态
      try {
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }
        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('update-is_followed', !this.is_followed)
        this.$emit('update:isFollowed', !this.isFollowed)
      } catch (err) {
        let message = '操作失败，请稍后重试'
        if (err.response && err.response.status === 400) {
          message = '您不能关注您自己！'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style scoped lang="less">

</style>
