import { Context, h, Schema, Time } from 'koishi'
import { video_access, bili_helper } from './bili-apitget'

export const name = 'bilibili-video-details'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.middleware((session, next) => {
    let video: video_access = new bili_helper(session.content).api()
    if (video !== undefined && video.code !== 0){
      session.send(toString(video) + h('img', {src: video.data.pic}))
    }else {
      return next()
    }
  } )
  
}

function toString(video: video_access):string{
  const ptime = new Date(video.data.time)
  const duration = Time.format(video.data.duration * 1000)
  let detail = `
  标题: ${video.data.title}
  作者: ${video.data.name}
  分类: ${video.data.tname}
  发布时间: ${ptime.toLocaleTimeString()}
  时长: ${duration}
  链接: https://www.bilibili.com/video/${video.data.bvid}
  状态:
  点赞:${video.data.like} 硬币:${video.data.coin} 收藏:${video.data.favorite}
  弹幕:${video.data.danmuku} 评论:${video.data.reply} 分享:${video.data.share}
  观看:${video.data.viewer}  
  评论: ${video.data.desc}

  `
  return detail
}



