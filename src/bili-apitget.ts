import * as fs from "fs";
import * as path from "path";
import {Time} from 'koishi'

/* 
    address of api
*/

const api: string = `https://api.bilibili.com/x/web-interface/view?`;

/* 
    Api information
*/

export interface video_access {
  // identify
  // readonly bvid:string
  // status
  readonly code: number;
  readonly message: string;
  data?: {
    bvid: string
    videos: number;
    tname: string;
    pic: string;
    title: string;
    pubdate: number;
    duration: number;
    desc: string;
    name: string;
    view: number;
    danmaku: number;
    reply: number;
    like: number;
    coin: number;
    share: number;
    favorite: number;
  };
  // get address
}

/* 
    Verify a string whether a bilibili url or go to video check
*/

export class bili_helper {
  constructor(private index: string) {}

  /**
   * api
   */
  public async api(): Promise<video_access> {
    let bili_filled: video_access = await this.fetchData(bili_helper.verifyURL(this.index)) as unknown as video_access
    return bili_filled
  }

  public static verifyURL(urlIf: string): string {
    try {
      const url = new URL(urlIf);
      if (
        url.hostname === "www.bilibili.com" ||
        url.hostname === "bilibili.com"
      ) {
        let bvid = url.pathname;
        bvid = bvid.substring(7, bvid.length)
        // console.log(bvid)
        return this.vidNoCheck(bvid);
      }
    } catch (error) {
      console.log(`Not a valid address, verify whether bvid`);
      return this.vidNoCheck(urlIf);
    }
    return this.vidNoCheck(urlIf);
  }

  /* 
    Access Internet for json content
*/

  private async fetchData(url: string): Promise<JSON> {
    try {
      const response: Response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data: JSON = await response.json();
      let newData = JSON.parse(JSON.stringify(data, this.replacer, 2))
      return Promise.resolve(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return Promise.reject(error);
    }
  }

  /* 
    filter function
*/
  private replacer(key: string, value: any): any {
    if (key === "ttl") {
      return undefined;
    }
    if (key === "data") {
      return {
        bvid: value.bvid,
        videos: value.videos,
        tname: value.tname,
        pic: value.pic,
        title: value.title,
        pubdate: value.pubdate,
        desc: value.desc,
        duration: value.duration,
        name: value.owner.name,
        view: value.stat.view,
        danmaku: value.stat.danmaku,
        reply: value.stat.reply,
        favorite: value.stat.favorite,
        coin: value.stat.coin,
        share: value.stat.share,
        like: value.stat.like,
      };
    }
    return value;
  }

  /* 
    check the aid and bvid number, if error, just throw error. 
*/

  private static vidNoCheck(bvid: string): string {
    const letter: string = bvid.substring(0, 2).toLowerCase();
    const num: string = bvid.substring(2);
    if (letter === "bv") {
      let api_bv: string = api.concat("bvid=").concat(bvid);
      return api_bv;
    } else if (letter === "av") {
      let api_av: string = api.concat("aid=").concat(num);
      return api_av;
    } else {
      console.error("You should put avid and bvid")
    }
  }
}

/* basic function of getting json from api, filter and video number check */

export class dateAndTime{
  /**
   * toDate
   */
  public static toDate(unixTime:number):string {
    const milisec = unixTime * 1000
    const date: Date = new Date(milisec)
    return date.toLocaleString()
  }

  /**
   * toTime
   */
  public static toTime(unixTime:number):string {
    const hour = Math.floor(unixTime / 3600)
    const formattedHour = Time.toDigits(hour, 2)
    const minute = Math.floor((unixTime - hour * 3600) / 60)
    const formattedMinute = Time.toDigits(minute, 2)
    const sec = (unixTime - minute * 60 - hour * 3600)
    const formattedSec = Time.toDigits(sec, 2)
    return `${formattedHour}:${formattedMinute}:${formattedSec}`
  }
}