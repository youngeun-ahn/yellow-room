import { EditOutlined } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { useSongModalContext } from './SongModal/SongModalProvider'

interface Props {
  song: Song
}
function SongCard ({ song }: Props) {
  const keyColorMap = {
    MAN: 'blue',
    WOMAN: 'pink',
    BOTH: 'purple',
    NONE: 'black',
  } as const

  const keyColor = keyColorMap[song.gender]
  const titleRow = song.singer
    ? `${song.title} (${song.singer})`
    : song.title

  const { openModal } = useSongModalContext()

  return (
    <Card className="w-full sm:w-[24rem]">
      <CardContent className="relative !p-8 sm:!p-12">
        <IconButton
          disableRipple
          size="small" color="secondary"
          className="!absolute top-4 right-4 opacity-50 hover:opacity-100"
          onClick={() => openModal(song)}
        >
          <EditOutlined fontSize="small" />
        </IconButton>
        <Box className="f-col-4">
          {/* 번호 & 키 */}
          <Box className="f-row-start-4">
            <Typography fontWeight="bold">
              {song.number}
            </Typography>
            {song.key && (
              <Typography color={keyColor}>
                {song.key > 0 && '+'}
                {song.key}
              </Typography>
            )}
          </Box>
          {/* 제목 (가수) */}
          <Typography>
            {titleRow}
          </Typography>
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
