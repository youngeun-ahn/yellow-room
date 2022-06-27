import { KeyboardArrowDown } from '@mui/icons-material'
import { Box, Collapse, Typography } from '@mui/material'
import classNames from 'classnames'
import { useState } from 'react'
import SongCard from './SongCard'

interface SongListProps {
  songList: Song[]
}
function SongList ({ songList }: SongListProps) {
  return (
    <Box className="f-row-start-8 pt-8 sm:!items-stretch sm:min-h-[8rem]">
      {songList.map(song => (
        <SongCard key={song.id} song={song} />
      ))}
    </Box>
  )
}

interface Props {
  title: string
  songList: Song[]
}
function SongGroup ({ title, songList }: Props) {
  const [open, setOpen] = useState(true)
  if (title === 'undefined') {
    return <SongList songList={songList} />
  }
  return (
    <Box className="f-col-2">
      <Box
        className="f-row px-8 py-4 sm:px-12 sm:py-8 -mb-4 z-10 sticky top-0 bg-yellow-200 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {title || '그룹 없음'}
        </Typography>
        <KeyboardArrowDown
          className={classNames(
            'opacity-70 rotate-0',
            { 'rotate-180': !open },
          )}
        />
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <SongList songList={songList} />
      </Collapse>
    </Box>
  )
}

export default SongGroup
