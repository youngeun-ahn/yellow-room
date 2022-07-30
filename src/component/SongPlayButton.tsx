import {
  Pause,
  YouTube as YouTubeIcon,
} from '@mui/icons-material'
import { Box, CircularProgress, IconButton } from '@mui/material'
import getVideoId from 'get-video-id'
import { useState } from 'react'
import YouTube, { YouTubeEvent } from 'react-youtube'

interface Props {
  youtube: string
}
function SongPlayButton ({ youtube }: Props) {
  const {
    id = '',
    service = '',
  } = getVideoId(youtube)

  const [play, setPlay] = useState(false)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(true)
  const [control, setControl] = useState<YouTubeEvent>()

  const onClickControl = () => {
    if (!ready) return
    if (paused) {
      control?.target.playVideo()
    } else {
      control?.target.pauseVideo()
    }
  }

  if (!id || service !== 'youtube') {
    return <></>
  }

  if (!play) {
    return (
      <Box className="f-center w-[2.4rem] h-[2.4rem]">
        <IconButton
          className="max-w-[4rem]"
          onClick={() => setPlay(true)}
        >
          <YouTubeIcon fontSize="large" htmlColor="red" />
        </IconButton>
      </Box>
    )
  }

  return (
    <>
      <Box className="f-center w-[2.4rem] h-[2.4rem]">
        <IconButton onClick={onClickControl}>
          {ready && (paused ? (
            <YouTubeIcon fontSize="large" htmlColor="red" />
          ) : (
            <Pause fontSize="large" />
          ))}
          {!ready && (
            <CircularProgress size="1.6rem" />
          )}
        </IconButton>
      </Box>
      <Box className="!absolute top-0 left-0 w-full h-full f-center pointer-events-none">
        <YouTube
          style={{ opacity: 0.2 }}
          videoId={id}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onEnd={() => setPlay(false)}
          onReady={e => {
            setReady(true)
            setControl(e)
            e.target.playVideo?.()
          }}
          opts={{
            playerVars: {
              rel: 0,
              controls: 0,
              showinfo: 0,
              loop: 0,
              fs: 0,
              disablekb: 1,
              modestbranding: 1,
              playsinline: 1,
            },
          }}
        />
      </Box>
    </>
  )
}

export default SongPlayButton
