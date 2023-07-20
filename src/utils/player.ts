import ReactPlayer from "react-player"
import {MutableRefObject, Dispatch, SetStateAction} from "react"
import { getVideoInfo } from '../api/twitchApi'
import moment from "moment"
import { HideList } from "../types"
export const pauseHandler = (players: MutableRefObject<ReactPlayer[]>) => {
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

export const onEndedHandler = (i: number, v: string, hideList: HideList, setHideList: Dispatch<SetStateAction<HideList>>, players: MutableRefObject<ReactPlayer[]>) => {
  const newHideList = {...hideList}
  newHideList[v] = true
  setHideList(newHideList)
  const player = players.current[i]
  player.getInternalPlayer().setMuted(true)
  player.getInternalPlayer().setVideo('')
  console.log(player.getInternalPlayer())
}