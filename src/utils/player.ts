import ReactPlayer from "react-player"
import {MutableRefObject, Dispatch, SetStateAction} from "react"
import { getVideoInfo } from '../api/twitchApi'
import moment from "moment"
import { HideList } from "../types"
import { sendEndNotification } from "./notification"
import { NotificationInstance } from "antd/lib/notification/interface";


export const pauseHandler = (players: MutableRefObject<ReactPlayer[]>, index: number) => {
  //check if player is pause by end of video
  const player = players.current[index]
  const currentTime = player.getCurrentTime()
  const duration = player.getDuration()
  console.log(player)
  if (currentTime >= duration - 5) {
    return
  }
  players.current.forEach(player => {
    player.getInternalPlayer().pause()
  })
}

export const playHandler = (players: MutableRefObject<ReactPlayer[]>) => {
  players.current.forEach(player => {
    player.getInternalPlayer().play()
  })
}

export const syncToThisHandler = async (index: number, players: MutableRefObject<ReactPlayer[]>) => {
  const videoId = players.current[index].getInternalPlayer().getVideo()
  const videoInfo = await getVideoInfo(videoId)
  const videoCurrentTime = players.current[index].getCurrentTime()
  const videoStartDate = moment(videoInfo.recordedAt).unix()
  const videoCalcNow = videoStartDate + videoCurrentTime
  
  players.current.forEach(async (player, i) => {
    if (i !== index) {
      const playerVideoId = player.getInternalPlayer().getVideo()
      const playerVideoInfo = await getVideoInfo(playerVideoId)
      const playerStartDate = moment(playerVideoInfo.recordedAt).unix()
      const syncTime = videoCalcNow - playerStartDate
      player.seekTo(syncTime)
    }
    player.getInternalPlayer().play()
  })
}

export const onEndedHandler = (
  i: number,
  v: string,
  hideList: HideList,
  setHideList: Dispatch<SetStateAction<HideList>>,
  players: MutableRefObject<ReactPlayer[]>,
  apiNotification?: NotificationInstance
  ) => {
  const newHideList = {...hideList}
  newHideList[v] = true
  setHideList(newHideList)
  if(apiNotification) sendEndNotification('Video Ended', `Video ${v} has ended`, apiNotification)
  const player = players.current[i]
  player.getInternalPlayer().setMuted(true)
  player.getInternalPlayer().setVideo('')
  
  const newHash = window.location.hash
  .replace(v, '')
  .replace('//', '/')

  window.location.hash = newHash

}