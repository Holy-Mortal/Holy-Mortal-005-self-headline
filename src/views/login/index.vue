<template>
  <div class="login-container">
    <!-- 头部导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- /头部导航栏 -->
    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-cell-group>
        <van-field type="number" maxlength="11" name="mobile" placeholder="请输入手机号" v-model="user.mobile" :rules="userFormRules.mobile">
          <template #left-icon>
            <van-icon class="toutiao toutiao-shouji" left-icon="shouji"></van-icon>
          </template>
        </van-field>
        <van-field type="number" maxlength="6" name="code" placeholder="请输入验证码" v-model="user.code" :rules="userFormRules.code">
          <template v-slot:left-icon>
            <van-icon class="toutiao toutiao-yanzhengma" left-icon="yanzhengma"></van-icon>
          </template>
          <template #button>
            <!-- time 倒计时时间 -->
            <van-count-down v-if="isCountDownShow" @finish="isCountDownShow = false" :time="1000 * 5" format="ss s" />
            <van-button v-else class="send-sms-btn" round size="small" type="default" @click="onSendSms">发送验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="primary" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// import { sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 测试手机号
        code: '246810' // 测试验证码
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1. 获取表单数据
      const user = this.user
      // 2. 表单验证
      // 在组件中必须通过 this.$toast 来调用 Toast.loading 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认2000 ，0 表示一直展示
      })
      // 3. 提交表单请求登录
      try {
        const { data } = await login(user)
        // console.log('登录成功', res)
        // console.log(res)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 登录成功，跳转回原页面，back 方式不严谨
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          // console.log('登录失败，请稍后重试', err)
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4. 根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // console.log('onSendSms')
      // 1. 校验手机号validate('name属性')
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        // console.log('发送成功', res)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = true
        // console.log('发送失败', err)
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 156px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
