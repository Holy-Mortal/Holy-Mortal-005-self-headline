module.exports = {
  plugins: {
    // autoprefixer是一个自动添加浏览器 CSS 样式规则前缀的 PostCss 插件
    // VueCLI 内部已经配置了 autoprefixer 插件
    // 'autoprefixer': {
    //   // `browsers` 用来配置兼容的浏览器版本信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      // rootValue表示根元素字体大小，根据根元素大小进行单位转换
      // Vant 样式设置 rootValue：37.5, 普通样式设置 rootValue：75
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      }, 
      propList: ['*'], // 用来设定可以从 px 转为 rem 的属性,`*` 就是所有属性都要转换
    }
  }
}
