import ReactPlayer from "react-player"
import {MutableRefObject} from "react"

export const onFastForwardHandler = (players: MutableRefObject<ReactPlayer[]>, seconds: number) => {
  players.current.forEach(player => {
    const currentTime = player.getCurrentTime()
    player.getInternalPlayer().seek(currentTime + seconds)
    player.getInternalPlayer().play()
  })
}

export const onFastBackwardHandler = (players: MutableRefObject<ReactPlayer[]>, seconds: number) => {
  players.current.forEach(player => {
    const currentTime = player.getCurrentTime()
    player.seekTo(currentTime - seconds)
    player.getInternalPlayer().play()
  })
}