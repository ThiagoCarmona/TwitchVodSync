import { useState, useRef, useEffect } from 'react'
import './App.css'
import ReactPlayer from 'react-player'
import { FloatButton, Tooltip } from 'antd'
import {PlusCircleOutlined, FastForwardOutlined, FastBackwardOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons'
import { AddVodModal } from './components/AddVodModal'
import { pauseHandler, playHandler, syncToThisHandler, onEndedHandler } from './utils/player'
import { onFastForwardHandler, onFastBackwardHandler } from './utils/controls'
import { HideList, VodStatus } from './types'
import { extractVideoId } from './utils'
import { notification } from 'antd'
import { useDebounce, useTimeout } from 'usehooks-ts'

function App() {

  const [vods, setVods] = useState<string[]>([])
  const players = useRef<ReactPlayer[]>([])
  const [hideList, setHideList] = useState<HideList>({})
  const [addVodModalOpen, setAddVodModalOpen] = useState<boolean>(false)
  const [apiNotification, contextHolder] = notification.useNotification()
  const [vodStatus, setVodStatus] = useState<VodStatus[]>([])

  const [forwardSeconds, setForwardSeconds] = useState<number>(0)
  const [backwardSeconds, setBackwardSeconds] = useState<number>(0)

  const debounceForwardSeconds = useDebounce(forwardSeconds, 1000)
  const debounceBackwardSeconds = useDebounce(backwardSeconds, 1000)

  const [isFloatingButtonOpen, setIsFloatingButtonOpen] = useState<boolean>(false)

  useEffect(() => {
    if(debounceForwardSeconds === 0) return
    onFastForwardHandler(players, debounceForwardSeconds)
    setForwardSeconds(0)
  }, [debounceForwardSeconds])

  useEffect(() => {
    if(debounceBackwardSeconds === 0) return
    onFastBackwardHandler(players, debounceBackwardSeconds)
    setBackwardSeconds(0)
  }, [debounceBackwardSeconds])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const hashValue = hash.replace('#', '')
      const hashVods = hashValue.split('/').filter(v => {
        return v !== ''
      })
      const uniqueVods = [...new Set(hashVods)]
      setVods(uniqueVods)
    }
  }, [])

  useEffect(() => {
    setInterval(() => {
      if(vodStatus.length !== vods.length) return
      const newVodStatus = [...vodStatus]
      players.current.forEach((player, i) => {
        if (hideList[i]) return
        if (player) {
          const volume = player.getInternalPlayer().getVolume()
          if(!newVodStatus[i]) return
          if(volume !== newVodStatus[i].volume){
            newVodStatus[i].volume = volume
            setVodStatus(newVodStatus)
            //mute all other players
            players.current.forEach((p, j) => {
              if(i !== j){
                p.getInternalPlayer().setVolume(0)
              }
            })
          }
        }
      })
    }, 100)
  }, [vodStatus])


  return (
    <div className="App">
      {contextHolder}
      <AddVodModal
        open={addVodModalOpen}
        handleClose={() => {
          setAddVodModalOpen(false)
        }
        }
        handleAddVod={(vod) => {
          const vodId = extractVideoId(vod)
          if (!vodId) return
          const newVods = [...vods]
          newVods.push(vodId)
          setVods([...new Set(newVods)])
          setAddVodModalOpen(false)
          window.location.hash = newVods.join('/')
        }
      }
      />

      <div className='players-grid'>
        {
          vods.map((v, i) => {
            return <div className='grid-item' key={i} style={{
              display: hideList[v] ? 'none' : 'block'
            }}>
              <div className='controls'>
                <button onClick={
                  () => {
                    syncToThisHandler(i, players)
                  }
                }>Sync to This</button>
                <button onClick={
                  () => {
                    onEndedHandler(i, v, hideList, setHideList, players)
                  }
                }>Remove</button>
              </div>
            <ReactPlayer
              key={i}
              url={`https://www.twitch.tv/videos/${v}`}
              playing={false}
              controls={true}
              width='100%'
              height='100%'            
              ref={player => players.current[i] = player!}
              onPause={() => {
                pauseHandler(vodStatus, setVodStatus, players, i)
              }}
              onPlay={() => {
                playHandler(players)
              }}
              muted={true}
              onEnded={() => {
                onEndedHandler(i, v, hideList, setHideList, players, apiNotification)
              }}
              onSeek={() => {
                playHandler(players)
              }}
              onReady={() => {
                const newVodStatus = [...vodStatus]
                newVodStatus.push({
                  index: i,
                  volume: players.current[i].getInternalPlayer().getVolume(),
                  quality: players.current[i].getInternalPlayer().getQuality()
                })
                setVodStatus(newVodStatus)
                players.current[i].getInternalPlayer().pause()
                setTimeout(() => {
                  if(i === 0) return;
                  try{
                    players.current[i].getInternalPlayer().setQuality('480p')
                  }catch(e){
                    console.log(e)
                  }
                }, 10000);

              }}
              //check quality change
              onPlaybackRateChange={() => {
                console.log('playback rate change')
              }}
              config={{
                twitch: {
                  options: {
                    autoplay: false
                  }
                }
              }}
            />
            </div>
          })
        }

      </div>
      <FloatButton.Group
      trigger="click"
      style={{ right: 24, zIndex: 9999 }}
      icon={<ArrowUpOutlined />}
      closeIcon={<ArrowDownOutlined />}
      open={isFloatingButtonOpen}
      onOpenChange={(open) => {
        setIsFloatingButtonOpen(open)
        if(open) {
          setTimeout(() => {
            setIsFloatingButtonOpen(false)
          }, 30000)
        }
      }}
      
    > 
      <Tooltip title={`Forward ${forwardSeconds === 0 ? 30 : forwardSeconds} seconds`} placement='left'>
        <FloatButton icon={<FastForwardOutlined/>} onClick={() =>{
          setForwardSeconds(forwardSeconds + 30)
        }}
        />
      </Tooltip>
      <Tooltip title={`Backward ${backwardSeconds === 0 ? 30 : backwardSeconds} seconds`} placement='left'>
        <FloatButton icon={<FastBackwardOutlined/>} onClick={() =>{
          setBackwardSeconds(backwardSeconds + 30)
        }}/>
      </Tooltip>
      <Tooltip title="Add VOD" placement='left'>
        <FloatButton icon={<PlusCircleOutlined/>} onClick={() => {
          setAddVodModalOpen(true)
          isFloatingButtonOpen && setIsFloatingButtonOpen(false)
        }}/>
      </Tooltip>
    </FloatButton.Group>
    </div>
  )
}

export default App
