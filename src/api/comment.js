/* 评论请求模块 */
import request from '@/utils/request'

/* 请求获取文章评论列表数据 */
export const getComment = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    // params 选项用来配置 Query 参数
    params
  })
}

/* 请求对评论或评论回复点赞 */
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/* 请求取消对评论或评论回复点赞 */
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`
  })
}

/* 请求添加评论或评论回复 */
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
