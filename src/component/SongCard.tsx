import { EditOutlined, FastForward } from '@mui/icons-material'
import { Box, Card, CardContent, CardProps, IconButton, Typography } from '@mui/material'
import classNames from 'classnames'
import { useSongDetailContext } from './SongDetail/context'
import GenderToggleButton from './SongDetail/GenderToggleButton'

interface Props extends CardProps {
  song: Song
}
function SongCard ({ song, className, ...cardProps }: Props) {
  const titleLabel = song.singer
    ? `${song.title} (${song.singer})`
    : song.title

  const { openSongDetail } = useSongDetailContext()

  return (
    <Card
      className={classNames(
        'w-full sm:w-[24rem]',
        { '!bg-slate-300 !line-through': song.isBlacklist },
        className,
      )}
      {...cardProps}
    >
      <CardContent className="relative !p-8 sm:!p-12">
        <IconButton
          disableRipple
          size="small" color="secondary"
          className="!absolute top-4 right-4 opacity-50 hover:opacity-100"
          onClick={() => openSongDetail(song)}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
        <Box className="f-col-4">
          {/* 번호 & 키 & 템포 */}
          <Box className="f-row-start-4">
            <Typography fontWeight="bold" className="min-w-[2.8rem]">
              {song.number}
            </Typography>
            {song.key !== 0 && (
              <Box className="f-row">
                <GenderToggleButton gender={song.gender} disabled />
                <Typography className="!-ml-4">
                  {song.key > 0 && '+'}
                  {song.key}
                </Typography>
              </Box>
            )}
          </Box>
          {/* 제목 (가수) */}
          <Box>{titleLabel}</Box>
          {/* 태그 목록 */}
          <Box className="f-row-start-2">
            {song.tagList.map(tag => (
              <Typography key={tag} className="text-blue-500">
                {`#${tag}`}
              </Typography>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SongCard
