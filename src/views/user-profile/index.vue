<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar title="个人信息" class="page-nav-bar" left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->

    <input type="file" hidden ref="file" @change="onFileChange">

    <!-- 个人信息 -->
    <van-cell title="头像" @click="$refs.file.click()" is-link>
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" @click="isUpdateNameShow = true" :value="user.name" is-link />
    <van-cell title="性别" @click="isUpdateGenderShow = true" :value="user.gender === 0 ? '男' : '女'" is-link />
    <van-cell title="生日" @click="isUpdateBirthdayShow = true" :value="user.birthday" is-link />
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model:show="isUpdateNameShow" position="bottom" style="height: 100%;">
      <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model:userName="user.name" />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model:show="isUpdateGenderShow" position="bottom">
      <update-gender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false" v-model:userGender="user.gender" />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model:show="isUpdateBirthdayShow" position="bottom">
      <update-birthday v-if="isUpdateBirthdayShow" @close="isUpdateBirthdayShow = false" v-model:userBirthday="user.birthday" />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup v-model:show="isUpdatePhotoShow" position="bottom" style="height: 100%;">
      <update-photo v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event" />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'

export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  /deep/ .van-cell-group--inset {
    margin: 0 6px;
  }
  /deep/ .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
