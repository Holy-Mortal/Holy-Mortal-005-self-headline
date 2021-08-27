<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar title="设置昵称" left-text="取消" right-text="完成" @click-left="$emit('close')" @click="onConfirm" />
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-cell-group inset>
        <van-field v-model.trim="localName" rows="2" type="textarea" maxlength="7" placeholder="请输入昵称" show-word-limit />
      </van-cell-group>
    </div>
    <!-- /输入框 -->

  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  components: {},
  props: {
    userName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.userName
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserProfile({
          name: localName
        })
        // console.log(data)

        // 更新视图
        this.$emit('update:userName', localName)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
