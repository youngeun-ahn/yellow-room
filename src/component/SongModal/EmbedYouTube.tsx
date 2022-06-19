import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { YouTube as YouTubeIcon } from '@mui/icons-material'
import PopupState from 'material-ui-popup-state'
import YouTube from 'react-youtube'
import getVideoId from 'get-video-id'
import { useForm } from 'react-hook-form'

interface Props {
  youtube: string
  onChange: (youtube: string) => void
}
function EmbedYouTube ({ youtube, onChange }: Props) {
  const {
    register,
    handleSubmit,
  } = useForm<{ youtube: string }>({
    defaultValues: { youtube },
  })

  return (
    <Box className="f-col-8">
      {youtube && (
        <YouTube
          title="유튜브"
          videoId={getVideoId(youtube).id ?? ''}
          opts={{
            width: '100%',
            height: '280px',
          }}
        />
      )}
      <PopupState variant="popper">
        {popupState => (
          <>
            <Button
              variant="contained"
              onClick={popupState.open}
              className="!bg-red-600"
            >
              <YouTubeIcon fontSize="large" />
            </Button>
            <Dialog
              open={popupState.isOpen}
              className="!z-[10000]"
            >
              <DialogTitle fontWeight="bold">
                YouTube 링크
              </DialogTitle>
              <DialogContent>
                <TextField
                  placeholder="e.g) https://www.youtube.com/watch?v=..."
                  variant="standard" fullWidth
                  className="!min-w-[18rem]"
                  {...register('youtube', {
                    validate (link) {
                      const trimmed = link.trim()
                      if (!trimmed) return undefined
                      const { id, service } = getVideoId(trimmed)
                      if (!id || service !== 'youtube') {
                        return '정상적인 YouTube 동영상 주소를 입력해주세요.'
                      }
                      return undefined
                    },
                  })}
                />
              </DialogContent>
              <DialogActions className="!px-12 !pb-12">
                <Button
                  onClick={popupState.close}
                >
                  닫기
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(form => {
                    onChange(form.youtube)
                    popupState.close()
                  })}
                >
                  확인
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </PopupState>
    </Box>
  )
}

export default EmbedYouTube
