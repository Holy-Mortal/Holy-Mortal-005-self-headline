<template>
  <div class="article-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="Holy-Mortal" @click-left="$router.back()"></van-nav-bar>
    <!-- /顶部导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false" :to="{name: 'user', params: {userId: article.art_id}}">
          <template #icon>
            <van-image class="avatar" round fit="cover" :src="article.aut_photo" />
          </template>
          <template #title>
            <div class="user-name">{{article.aut_name}}</div>
          </template>
          <template #label>
            <div class="publish-date">{{nowDate}}</div>
          </template>
          <!-- 模板中 $event 为事件参数 this.$emit('update-is_followed', 事件参数) -->
          <!-- 传递给子组件的数据既要使用还要修改 -->
          <!-- 传递：props  :is-followed="article.is_followed"
          修改：自定义事件  @update-is_followed="article.is_followed = $event"
          简写方式：在组件上使用 v-model
          v-model:value="article.is_followed" @updata:value="article.is_followed = $event" -->
          <follow-user v-model:isFollowed="article.is_followed" :user-id="article.aut_id" class="follow-btn" />
          <!-- <van-button v-if="article.is_followed" class="follow-btn" round :loading="followLoading" size="small" @click="onFollow">已关注</van-button>
          <van-button v-else class="follow-btn" type="primary" color="#3296fa" round :loading="followLoading" size="small" icon="plus" @click="onFollow">关注</van-button> -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="markdown-body article-content" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- /文章内容 -->

        <!-- 文章评论列表 -->
        <comment-list :source="article.art_id" :list="commentList" @onload-success="totalCommentCount = $event.total_count" />
        <!-- /文章评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
          <van-icon name="comment-o" color="#777" :badge="totalCommentCount" />
          <collect-article class="btn-item" v-model:isCollected="article.is_collected" :article-id="article.art_id" />
          <!-- <van-button icon="star-o" class="btn-item" /> -->
          <like-article class="btn-item" v-model:numAttitude="article.attitude" :article-id="article.art_id" />
          <!-- <van-button icon="good-job-o" class="btn-item" /> -->
          <van-icon name="share" color="#777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup v-model:show="isPostShow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
        <!-- /发布评论 -->
        <!-- 评论回复 -->
        <!-- <van-popup v-model="isReplyShow" position="bottom" style="height: 95%">
          <comment-reply />
        </van-popup> -->
        <!-- /评论回复 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- 加载失败：404 -->

      <!-- 加载失败：其他未知错误（例如网络原因或服务器端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其他未知错误（例如网络原因或服务器端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { filtertime } from '@/utils/dayjs'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article/'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
// import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost
    // CommentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论的点击状态
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {} // 点击回复的那个评论对象
    }
  },
  computed: {
    nowDate () {
      return filtertime(this.article.pubdate)
    }
  },
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) { JSON.parse('任意数据') } // 模拟报错状况
        this.article = data.data
        // 请求成功，关闭 this.loading
        // this.loading = false
        // 初始化图片点击预览
        // console.log(this.$refs['article-content'])
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // this.loading = false
        console.log('获取数据失败', err)
      }
      // 无论请求成功失败，都关闭 this.loading
      this.loading = false
    },
    previewImage () {
      // 得到所有 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 获取所有 img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .loading-wrap {
      padding: 200px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }

    .article-detail {
      .article-title {
        font-size: 40px;
        padding: 50px 32px;
        margin: 0;
        color: #3a3a3a;
      }
      .user-info {
        padding: 40px;
        .avatar {
          width: 70px;
          height: 70px;
          margin-right: 17px;
        }
        /deep/ .van-cell__label {
          margin-top: 0;
        }
        .user-name {
          font-size: 24px;
          color: #3a3a3a;
        }
        .publish-date {
          font-size: 23px;
          color: #b7b7b7;
        }
        .follow-btn {
          width: 170px;
          height: 58px;
        }
      }
      .article-content {
        padding: 55px 32px;
        /deep/ p {
          text-align: justify;
        }
      }
      .article-bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        height: 88px;
        border-top: 1px solid #d8d8d8;
        background-color: #fff;
        .comment-btn {
          width: 282px;
          height: 46px;
          border: 2px solid #eee;
          font-size: 30px;
          line-height: 46px;
          color: #a7a7a7;
        }
        /deep/ .van-icon {
          font-size: 40px;
        }
        /deep/ .van-badge--fixed {
          top: 2px;
        }
        /deep/ .van-badge {
          font-size: 16px;
          background-color: #e22829;
        }
        .btn-item {
          border: none;
          padding: 0;
          height: 40px;
          line-height: 40px;
          color: #777;
        }
        .collect-btn--collected {
          color: #ffa500;
        }
        .like-btn--liked {
          color: #e5645f;
        }
      }
    }
    .error-wrap {
      padding: 200px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .van-icon {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        font-size: 30px;
        color: #666;
        margin: 33px 0 46px;
      }
      .retry-btn {
        width: 280px;
        height: 70px;
        line-height: 70px;
        border: 1px solid #c3c3c3;
        font-size: 30px;
        color: #666;
      }
    }
  }
}
</style>
