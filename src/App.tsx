import { useState, useRef, useEffect } from 'react'
import './App.css'
import ReactPlayer from 'react-player'
import { FloatButton, Tooltip } from 'antd'
import {PlusCircleOutlined, FastForwardOutlined, FastBackwardOutlined, ArrowUpOutlined, ArrowDownOutlined} from '@ant-design/icons'
import { AddVodModal } from './components/AddVodModal'
import { pauseHandler, playHandler, syncToThisHandler, onEndedHandler } from './utils/player'
import { onFastForwardHandler, onFastBackwardHandler } from './utils/controls'
import { HideList } from './types'
import { extractVideoId } from './utils'
import { notification } from 'antd'


function App() {

  const [vods, setVods] = useState<string[]>([])
  const players = useRef<ReactPlayer[]>([])
  const [hideList, setHideList] = useState<HideList>({})
  const [addVodModalOpen, setAddVodModalOpen] = useState<boolean>(false)
  const [apiNotification, contextHolder] = notification.useNotification()

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
              playing={true}
              controls={true}
              width='100%'
              height='100%'
              ref={player => players.current[i] = player!}
              onPause={() => {
                console.log('pause')
                pauseHandler(players, i)
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
              config={{
                twitch: {
                  options: {
                    muted: true,
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
    > 
      <Tooltip title="Forward 30 seconds" placement='left'>
        <FloatButton icon={<FastForwardOutlined/>} onClick={() =>{
          onFastForwardHandler(players)
        }}/>
      </Tooltip>
      <Tooltip title="Back 30 seconds" placement='left'>
        <FloatButton icon={<FastBackwardOutlined/>} onClick={() =>{
          onFastBackwardHandler(players)
        }}/>
      </Tooltip>
      <Tooltip title="Add VOD" placement='left'>
        <FloatButton icon={<PlusCircleOutlined/>} onClick={() => {
          setAddVodModalOpen(true)
        }}/>
      </Tooltip>
    </FloatButton.Group>
    </div>
  )
}

export default App
