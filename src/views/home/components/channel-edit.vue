<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <template #title>
        <div class="title-text">我的频道</div>
      </template>
      <van-button type="danger" size="mini" plain round class="edit-btn" @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index" @click="onMyChannelClick(channel, index)">
        <template #icon>
          <van-icon name="clear" v-show="isEdit && !fixedChannels.includes(channel.id)"></van-icon>
        </template>
        <!-- v-bind:class 语法 -->
        <!-- 一个对象，对象中 key 表示要作用的 css 类名 -->
        <!-- 一个对象，对象中 value 表示要计算出布尔值 true 为作用该类名 false反之 -->
        <template #text>
          <span class="text" :class="{active: index === active}">{{channel.name}}</span>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <template #title>
        <div class="title-text">频道推荐</div>
      </template>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in recommendChannels" :key="index" icon="plus" @click="onAddChannel(channel)">
        <template #text>
          <span class="text">{{channel.name}}</span>
        </template>
      </van-grid-item>
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      newMyChannels: this.myChannels, // 将 props 数据存储到 data中
      isEdit: false, // 控制编辑状态的显示
      fixedChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    recommendChannels () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        //   const channels = []
        return !this.newMyChannels.find(myChannel => myChannel.id === channel.id)
      })
    }
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const ret = this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })
    //     // 如果我的频道中不包含该频道项，则将其收入推荐频道
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        // console.log(data)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.newMyChannels.push(channel)
      // 1. 数据持久化处理
      try {
        if (this.user) {
          // 3. 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } else {
          // 2. 未登录，把数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('保存失败，请稍后重试')
      }
    },
    onMyChannelClick (channel, index) {
      // console.log(channel, index)
      if (this.isEdit) {
        // 1. 如果是固定频道，则不删除
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 2. 如果是编辑状态，则执行删除频道
        /* 参数1：要删除元素开始的索引（包含）  参数2：删除的个数，无则表示从参数1删除到最后 */
        this.newMyChannels.splice(index, 1)
        // 3. 如果删除激活频道之前项，更新频道项
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('update-active', this.active - 1, true)
        }
        // 4. 处理删除数据持久化
        this.deleteChannel(channel)
      } else {
        // 如果是非编辑状态,则执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，则将数据更新到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，则将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .van-button__content {
    padding: 2px 10px;
}
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-badge__wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
