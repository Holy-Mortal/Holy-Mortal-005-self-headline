<template>
  <div class="home-container">
    <!-- 头部导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <template #title>
        <van-button round type="primary" size="small" icon="search" class="search-btn" to="/search">搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- /头部导航栏 -->

    <!-- 频道列表 -->
    <!-- v-model:active 绑定当前激活标签对应的索引值，默认情况下启用第一个标签 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页 -->
    <van-tabs class="channel-tabs" v-model:active="active" animated swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 文章列表 -->
        <article-list :channel="channel" />
        <!-- /文章列表 -->
      </van-tab>
      <template #nav-right>
        <div class="placeholder"></div>
        <div class="hamburger-btn" @click="isChannelEditShow = true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </template>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup v-model:show="isChannelEditShow" closeable close-icon-position="top-left" position="bottom" :style="{ height: '100%' }">
      <channel-edit :my-channels="channels" v-model:active="active" @update-active="onUpdateActive" />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {},
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // // console.log(data)
        // this.channels = data.data.channels

        let channels = []
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 有，则使用
          if (localChannels) {
            channels = localChannels
          } else {
            // 无则请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      // console.log('home', index)
      // 将 index 给 active 改变我的频道中数据的 选中属性，更新激活频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}

</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__content {
      // 响应式布局单位：vw 和 vh
      // vw：1vw = 布局视口宽度的1%
      // vh：1vh = 布局视口高度的1%
      min-height: 79vh;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url('~@/assets/gradient-gray-line.png');
        background-size: contain;
      }
    }
  }
}
</style>
