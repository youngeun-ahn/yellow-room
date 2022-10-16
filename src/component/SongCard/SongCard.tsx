import { useSettingSlice } from '@core/store/settingSlice'
import { EditOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, CardProps, IconButton, Rating, Typography } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useDeepCompareMemo } from 'use-deep-compare'
import { useSongDetailContext } from '../SongDetail/context'
import GenderToggleButton from '../SongDetail/GenderToggleButton'
import SongPlayButton from './SongPlayButton'
import SongTextPreviewModal from './SongTextPreviewModal'

interface Props extends CardProps {
  song: Song
  mock?: boolean
}
function SongCard ({ song, mock, className, ...cardProps }: Props) {
  const { openSongDetail } = useSongDetailContext()
  const {
    isCardViewVisible,
  } = useSettingSlice()

  const isVisible = useDeepCompareMemo(() => ({
    key: isCardViewVisible('KEY') && song.key !== 0,
    rating: isCardViewVisible('RATING'),
    group: isCardViewVisible('GROUP') && song.group,
    singer: isCardViewVisible('SINGER') && song.singer,
    tag: isCardViewVisible('TAG') && song.tagList.length > 0,
    memo: isCardViewVisible('MEMO') && song.memo.trim().length > 0,
    lyric: isCardViewVisible('LYRIC') && song.lyric.trim().length > 0,
    youtube: isCardViewVisible('YOUTUBE') && song.youtube,
  }), [isCardViewVisible, song])

  /* 일정 스크롤 영역 바깥의 카드는 컨텐츠 렌더링 X */
  const cardRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState<number>(Infinity)
  const isInRenderArea = scrollY > -640 && scrollY < 2560

  useEffect(() => {
    if (!cardRef.current) return undefined
    const updateScrollY = () => {
      if (!cardRef.current) return
      const { y } = cardRef.current.getBoundingClientRect()
      setScrollY(y ?? Infinity)
    }
    updateScrollY()
    window.addEventListener('rerender-card', updateScrollY)
    return () => window.removeEventListener('rerender-card', updateScrollY)
  }, [cardRef.current])

  return (
    <Card
      ref={cardRef}
      className={classNames(
        'w-full sm:w-[24rem]',
        { '!bg-slate-300 !line-through': song.isBlacklist },
        className,
      )}
      {...cardProps}
    >
      {isInRenderArea ? (
        <CardContent className="relative !p-8 sm:!px-12">
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
                <Rating
                  size="small" readOnly
                  value={song.rating}
                  precision={0.5}
                />
              )}
            </Box>
            {/* 제목 & 가수 & 그룹 & 유튜브 */}
            <Box className="f-row-8 !items-start !flex-nowrap">
              <Box className="f-col-4 self-center">
                {isVisible.group && (
                  <Box className="text-xs font-bold">
                    {song.group}
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
                  sx={{ wordBreak: 'break-all' }}
                >
                  {song.tagList.map(tag => (
                    <span key={tag} className="mr-4">
                      {`#${tag}`}
                    </span>
                  ))}
                </Box>
              )}
              <Box className="f-row-2 !flex-nowrap ml-auto">
                {isVisible.lyric && (
                  <SongTextPreviewModal
                    label="가사"
                    title={song.title}
                    content={song.lyric}
                  />
                )}
                {isVisible.memo && (
                  <SongTextPreviewModal
                    label="메모"
                    title="Memo"
                    content={song.memo}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      ) : (
        <CardContent className="h-[5.4rem] f-row items-center font-bold">
          {song.title}
        </CardContent>
      )}
    </Card>
  )
}

export default SongCard
