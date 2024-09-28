import { Context, h, Schema } from 'koishi'
import { video_access, bili_helper, dateAndTime } from './bili-apitget'

export const name = 'bilibili-video-details'

export interface Config {
  mainSwitch: boolean,
  outputFormat: {
    switchTitle: boolean,
    switchName: boolean,
    switchType: boolean,
    switchPubdate: boolean,
    switchDuration: boolean,
    switchLink: boolean,
    switchStatus: boolean,
    switchDesc: boolean,
    switchCover: boolean,
  }
}

export const Config: Schema<Config> = Schema.object({
  mainSwitch: Schema.boolean().default(true),
  outputFormat: Schema.object({
    switchTitle: Schema.boolean().default(true),
    switchName: Schema.boolean().default(true),
    switchType: Schema.boolean().default(true),
    switchPubdate: Schema.boolean().default(true),
    switchDuration: Schema.boolean().default(true),
    switchLink: Schema.boolean().default(true),
    switchStatus: Schema.boolean().default(true),
    switchDesc: Schema.boolean().default(true),
    switchCover: Schema.boolean().default(true),
  })
}).i18n({
  'zh-CN': require('./locales/zh-CN'),
});

export function apply(ctx: Context, con: Config) {
  ctx.i18n.define('zh-CN', require('./locales/zh-CN'));
  if (con.mainSwitch) {
    ctx.on("message", (session) => {
      let video = new bili_helper(session.content);
      video.api().then((video_api) => {
        if (video_api !== undefined && video_api.code === 0) {
          if (con.outputFormat.switchCover) {
            session.send(toString(video_api, con) + h.image(video_api.data.pic));
          } else {
            session.send(toString(video_api, con));
          };
        }
      }).catch((reason) => {/*Do nothing*/});
    });
  }

}



function toString(video: video_access, con: Config): string {
  /*let detail = `
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

  `;*/
  let detail = "";
  if (con.outputFormat.switchTitle) detail += `标题: ${video.data.title}\n`;
  if (con.outputFormat.switchName) detail += `作者: ${video.data.name}\n`;
  if (con.outputFormat.switchType) detail += `分类: ${video.data.tname}\n`;
  if (con.outputFormat.switchPubdate) detail += `发布时间: ${dateAndTime.toDate(video.data.pubdate)}\n`;
  if (con.outputFormat.switchDuration) detail += `时长: ${dateAndTime.toTime(video.data.duration)}\n`;
  if (con.outputFormat.switchLink) detail += `链接: https://www.bilibili.com/video/${video.data.bvid}\n`;
  if (con.outputFormat.switchStatus) detail += `状态:\n点赞:${video.data.like} 硬币:${video.data.coin} 收藏:${video.data.favorite}\n弹幕:${video.data.danmaku} 评论:${video.data.reply} 分享:${video.data.share}\n观看:${video.data.view}\n`;
  if (con.outputFormat.switchDesc) detail += `简介: \n${video.data.desc}\n`;

  return detail;
}



