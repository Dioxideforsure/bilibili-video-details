import { Context, h, Schema, Time } from 'koishi'
import { video_access, bili_helper, dateAndTime } from './bili-apitget'

export const name = 'bilibili-video-details'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.on("message", (session) => {
    let video = new bili_helper(session.content);
    video.api().then((video_api) => {
      if (video_api !== undefined && video_api.code === 0) {
        session.send(
          toString(video_api) + h.image(video_api.data.pic)
        );
      }
    });
  });
} 
  


function toString(video: video_access): string {
  
  let detail = `
标题: ${video.data.title}
作者: ${video.data.name}
分类: ${video.data.tname}
发布时间: ${dateAndTime.toDate(video.data.pubdate)}
时长: ${dateAndTime.toTime(video.data.duration)}
链接: https://www.bilibili.com/video/${video.data.bvid}
状态:
点赞:${video.data.like} 硬币:${video.data.coin} 收藏:${video.data.favorite}
弹幕:${video.data.danmaku} 评论:${video.data.reply} 分享:${video.data.share}
观看:${video.data.view}  
简介: 
${video.data.desc}

  `;
  return detail;
}



