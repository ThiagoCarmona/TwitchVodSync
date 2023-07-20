import ReactPlayer from "react-player"
import {MutableRefObject} from "react"

export const onFastForwardHandler = (players: MutableRefObject<ReactPlayer[]>) => {
  players.current.forEach(player => {
    const currentTime = player.getCurrentTime()
    console.log(currentTime)
    player.getInternalPlayer().seek(currentTime + 30)
  })
}

export const onFastBackwardHandler = (players: MutableRefObject<ReactPlayer[]>) => {
  players.current.forEach(player => {
    const currentTime = player.getCurrentTime()
    player.seekTo(currentTime - 30)
  })
}