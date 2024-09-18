import * as fs from 'fs'
import * as path from 'path'

/* 
    address of api
*/

const api: string = `https://api.bilibili.com/x/web-interface/view?`

/* 
    Api information
*/

interface video_access {
  // identify
  // readonly bvid:string
  // status
  readonly code: number
  readonly message: string
  data?: {
    // bvid: string
    videos: number
    tname: string
    pic: string
    title: string
    time: number
    duration: number
    desc: string
    // author information
    name: string
    // viewer interaction information
    viewer: number
    danmuku: number
    reply: number
    like: number
    coin: number
    share: number
    favorite: number
  }
  // get address
}

/* 
    
*/

/* 
    Access Internet for json content
*/

async function fetchData(url: string): Promise<JSON> {
  try {
    const response: Response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`)
    }
    const data: JSON = await response.json()
    let newData = JSON.parse(JSON.stringify(data, replacer, 2))
    return Promise.resolve(newData)
  } catch (error) {
    console.error('Error fetching data:', error)
    return Promise.reject(error)
  }
}

/* 
    filter function
*/
function replacer(key: string, value: any): any {
  if (key === 'ttl') {
    return undefined
  }
  if (key === 'data') {
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
      danmuku: value.stat.danmuku,
      reply: value.stat.reply,
      favorite: value.stat.favorite,
      coin: value.stat.coin,
      share: value.stat.share,
      like: value.stat.like,
    }
  }
  return value
}

/* 
    check the aid and bvid number, if error, just throw error. 
*/

function vidNoCheck(bvid: string): string {
  const letter: string = bvid.substring(0, 2).toLowerCase()
  const num: string = bvid.substring(2)
  if (letter === 'bv') {
    let api_bv: string = api.concat('bvid=').concat(bvid)
    return api_bv
  } else if (letter === 'av') {
    let api_av: string = api.concat('aid=').concat(num)
    return api_av
  } else {
    console.error('You should put avid and bvid')
    // console.log(letter)
    // console.log(num)
    process.exit(1)
  }
}

/* basic function of getting json from api, filter and video number check */
