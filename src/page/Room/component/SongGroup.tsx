import { Song } from '@core/query'
import { KeyboardArrowDown } from '@mui/icons-material'
import { Box, Collapse, Typography } from '@mui/material'
import classNames from 'classnames'
import { useState } from 'react'
import SongCard from './SongCard'

interface Props {
  title: string
  songList: Song[]
}
function SongGroup ({ title, songList }: Props) {
  const [open, setOpen] = useState(true)
  return (
    <Box className="f-col-2">
      <Box className="f-row" onClick={() => setOpen(!open)}>
        <Typography variant="subtitle2" fontWeight="bold">
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
        <Box className="f-row-8 sm:!items-stretch sm:min-h-[8rem]">
          {songList.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}

export default SongGroup
