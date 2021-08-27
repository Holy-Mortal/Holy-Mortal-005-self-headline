<template>
  <van-cell class="comment-item">
    <template #icon>
      <van-image class="avatar" round fit="cover" :src="comment.aut_photo" />
    </template>
    <template #title>
      <div class="title-wrap">
        <div class="user-name">{{comment.aut_name}}</div>
        <van-button :loading="commentLoading" class="like-btn" :class="{liked: is_liking}" :icon="is_liking ? 'good-job' : 'good-job-o'" @click="onCommentLike">{{like_count || '赞'}}</van-button>
      </div>
    </template>
    <template #label>
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{nowDate}}</span>
        <!-- <van-button class="reply-btn" round @click="$emit('click-reply', comment)">回复 {{comment.reply_count}}</van-button> -->
        <van-button class="reply-btn" round>回复 {{comment.reply_count}}</van-button>
      </div>
    </template>
  </van-cell>
</template>

<script>
import { filtertime } from '@/utils/dayjs'
import { addCommentLike, deleteCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commentLoading: false,
      is_liking: this.comment.is_liking,
      like_count: this.comment.like_count
    }
  },
  computed: {
    nowDate () {
      return filtertime(this.comment.pubdate)
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCommentLike () {
      this.commentLoading = true
      try {
        if (this.is_liking) {
          // 已点赞，取消点赞
          await deleteCommentLike(this.comment.com_id)
          this.like_count--
        } else {
          // 未点赞，添加点赞
          await addCommentLike(this.comment.com_id)
          this.like_count++
        }
        this.is_liking = !this.is_liking
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
    .like-btn {
      height: 30px;
      padding: 0;
      border: none;
      font-size: 19px;
      line-height: 30px;
      margin-right: 7px;
      /deep/ .van-icon {
        font-size: 30px;
      }
      &.liked {
        color: #e5645f;
      }
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
}
</style>
