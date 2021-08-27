/* 文章请求模块 */
import request from '@/utils/request'

/* 请求获取文章列表数据 */
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    // params 选项用来配置 Query 参数
    params
  })
}

/* 请求获取新闻文章详情数据 */
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

/* 请求收藏文章 */
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target
    }
  })
}

/* 请求取消收藏文章 */
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${target}`
  })
}

/* 请求点赞文章 */
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })
}

/* 请求取消点赞文章 */
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`
  })
}

/* 请求获取用户文章列表数据 */
export const getArticleByUser = userId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user/${userId}/articles`
  })
}
