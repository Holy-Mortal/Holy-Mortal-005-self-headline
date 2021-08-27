<template>
  <div class="update-gender">
    <van-picker title="标题" :columns="columns" :default-index="userGender" @cancel="$emit('close')" @confirm="onConfirm" @change="onPickerChange" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    userGender: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.userGender
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
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // console.log(data)

        // 更新视图
        this.$emit('update:userGender', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败，请稍后重试')
      }
    },
    onPickerChange (value, index) {
      this.localGender = index
      // console.log(value)
    }
  }
}
</script>

<style scoped lang="less">
.update-gender {
  /deep/ .van-picker__cancel {
    color: #52a2fd;
  }
  /deep/ .van-picker__confirm {
    color: #2b99f3;
  }
}
</style>
