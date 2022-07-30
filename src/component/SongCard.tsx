import { useSettingSlice } from '@core/store/settingSlice'
import { EditOutlined } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardProps, IconButton, Rating, Typography } from '@mui/material'
import classNames from 'classnames'
import { useSongDetailContext } from './SongDetail/context'
import GenderToggleButton from './SongDetail/GenderToggleButton'
import SongPlayButton from './SongPlayButton'

interface Props extends CardProps {
  song: Song
  mock?: boolean
}
function SongCard ({ song, mock, className, ...cardProps }: Props) {
  const { openSongDetail } = useSongDetailContext()
  const { isCardViewVisible } = useSettingSlice()

  const isVisible = {
    key: isCardViewVisible('KEY') && song.key !== 0,
    rating: isCardViewVisible('RATING'),
    origin: isCardViewVisible('ORIGIN') && Boolean(song.origin),
    singer: isCardViewVisible('SINGER') && Boolean(song.singer),
    tag: isCardViewVisible('TAG') && song.tagList.length > 0,
    memo: isCardViewVisible('MEMO'),
    lyric: isCardViewVisible('LYRIC'),
    youtube: isCardViewVisible('YOUTUBE') && song.youtube,
  }

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
          disabled={mock}
          disableRipple
          size="small" color="secondary"
          className="!absolute top-4 right-4 opacity-50 hover:opacity-100"
          onClick={() => openSongDetail(song)}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
        <Box className="f-col-4">
          {/* 번호 & 키 & 선호도 */}
          <Box className="f-row-start-4">
            <Typography fontWeight="bold" className="min-w-[2.8rem]">
              {song.number}
            </Typography>
            {isVisible.key && (
              <Box className="f-row">
                <GenderToggleButton
                  className="!p-0"
                  gender={song.gender}
                  disabled
                />
                <Typography>
                  {song.key > 0 && '+'}
                  {song.key}
                </Typography>
              </Box>
            )}
            {isVisible.rating && (
              <Rating value={song.rating} size="small" readOnly />
            )}
          </Box>
          {/* 제목 & 가수 & 원작 & 유튜브 */}
          <Box className="f-row-8 !items-start !flex-nowrap">
            <Box className="f-col-4 self-center">
              {isVisible.origin && (
                <Box className="text-xs font-bold">
                  {song.origin}
                </Box>
              )}
              <Box>
                <span className="mr-4 font-bold">
                  {song.title}
                </span>
                {isVisible.singer && (
                  <span>{`(${song.singer})`}</span>
                )}
              </Box>
            </Box>
            {isVisible.youtube && (
              <SongPlayButton youtube={song.youtube} />
            )}
          </Box>
          {/* 태그 목록 & 메모 & 가사 */}
          <Box className="f-row-4 !flex-nowrap !items-end">
            {isVisible.tag && (
              <Box
                className="flex-1 text-blue-500 text-xs"
                sx={{
                  wordBreak: 'break-all',
                  // lineHeight: 1.5,
                }}
              >
                {song.tagList.map(tag => (
                  <span key={tag} className="mr-4">
                    {`#${tag}`}
                  </span>
                ))}
              </Box>
            )}
            <Box className="f-row-2 !flex-nowrap">
              {isVisible.lyric && (
                <Button
                  size="small"
                  className="!min-w-fit h-[1.2rem]"
                >
                  가사
                </Button>
              )}
              {isVisible.memo && (
                <Button
                  size="small"
                  className="!min-w-fit h-[1.2rem]"
                >
                  메모
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SongCard
