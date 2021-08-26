<template>
  <!-- :to="'/article/' + article.art_id" -->
  <!-- :to="`/article/${article.art_id}`" -->
  <!-- :to="{name: 'article', params: {articleId: article.art_id}}" -->
  <!-- 根据路由名称 name 进行跳转，传递路由动态参数 params，属性名：路由路径设计动态参数名称 articleId  -->
  <van-cell class="article-item" :to="{name: 'article', params: {articleId: article.art_id}}">
    <template #title>
      <div class="title van-multi-ellipsis--l2">{{article.title}}</div>
    </template>
    <template #label>
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
          <van-image class="cover-item-img" :src="img" fit="cover" />
        </div>
      </div>
      <div class="label-info-wrap">
        <span>{{article.aut_name}}</span>
        <span>{{article.comm_count}}评论</span>
        <span>{{nowDate}}</span>
      </div>
    </template>
    <template v-if="article.cover.type === 1" #value>
      <van-image class="right-cover" fit="cover" :src="article.cover.images[0]" />
    </template>
  </van-cell>
</template>

<script>
import { filtertime } from '@/utils/dayjs'
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    nowDate () {
      return filtertime(this.article.pubdate)
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
