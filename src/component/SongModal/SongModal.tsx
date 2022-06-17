import { Close, Man, Woman, Wc, YouTube as YouTubeIcon, Save } from '@mui/icons-material'
import {
  AppBar, Drawer, Toolbar, Autocomplete, Button, Checkbox,
  Dialog, DialogContent, DialogTitle,
  FormControl, FormControlLabel, FormLabel,
  Box, IconButton, Rating, TextField, Typography, DialogActions,
} from '@mui/material'
import PopupState from 'material-ui-popup-state'
import YouTube from 'react-youtube'
import { useSongModalContext } from './SongModalProvider'

/* Song Modal */
function SongModal () {
  const {
    song, open, closeModal,
  } = useSongModalContext()

  const isNew = !song

  const onClose = () => {
    closeModal()
  }

  return (
    <>
      {open && (
        <AppBar position="fixed" className="!z-[9999]">
          <Toolbar disableGutters className="f-row-4 px-8">
            <IconButton onClick={onClose}>
              <Close htmlColor="white" />
            </IconButton>
            <Typography variant="h6" className="flex-auto">
              {isNew ? '노래 등록' : '노래 상세 보기(편집)'}
            </Typography>
            <IconButton onClick={onClose}>
              <Save htmlColor="white" />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      <Drawer open={open} closeAfterTransition anchor="bottom">
        <DialogContent className="h-screen !pt-[4.8rem] bg-yellow-50">
          <Box className="w-[40rem] max-w-full mx-auto f-col-12 !flex-nowrap">
            {/* 번호, 키 */}
            <Box className="f-row-start-8 !items-end">
              <TextField
                label="번호"
                variant="standard" type="number" required
                className="w-[6rem]"
              />
              <TextField
                label="키"
                variant="standard" type="number"
                className="w-[6rem]"
                InputProps={{
                  endAdornment: (
                    <IconButton disableRipple size="small">
                      <Man htmlColor="blue" fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
              <div className="flex-auto">{/* Gutter */}</div>
              <FormControlLabel
                label="블랙리스트"
                className="!justify-self-end"
                control={(
                  <Checkbox disableRipple className="!p-2 !mr-2" />
                )}
              />
            </Box>
            {/* 노래 제목 */}
            <TextField
              label="노래 제목"
              variant="standard" fullWidth required
              inputProps={{ maxLength: 64 }}
            />
            {/* 가수 */}
            <Autocomplete
              freeSolo
              options={[]}
              renderInput={props => (
                <TextField
                  {...props}
                  label="가수"
                  variant="standard"
                  inputProps={{ maxLength: 64 }}
                />
              )}
            />
            {/* 원작 */}
            <Autocomplete
              freeSolo
              options={[]}
              renderInput={props => (
                <TextField
                  {...props}
                  label="원작"
                  variant="standard"
                  inputProps={{ maxLength: 64 }}
                />
              )}
            />
            {/* 선호도, 숙련도 */}
            <Box className="f-row-start-24 mt-8">
              <FormControl>
                <FormLabel className="mb-8">선호도</FormLabel>
                <Rating
                  size="large"
                />
              </FormControl>
              <FormControl>
                <FormLabel className="mb-8">숙련도</FormLabel>
                <Rating
                  size="large"
                />
              </FormControl>
            </Box>
            {/* 태그 */}
            <Autocomplete
              freeSolo
              multiple
              options={[]}
              renderInput={props => (
                <TextField
                  {...props}
                  label="#태그_목록"
                  variant="standard"
                />
              )}
            />
            {/* 메모 */}
            <TextField
              label="메모"
              fullWidth
              variant="standard" multiline maxRows={8}
            />
            {/* 가사 */}
            <TextField
              label="가사"
              fullWidth
              variant="standard" multiline maxRows={8}
            />
            {/* 동영상 */}
            <FormControl>
              <YouTube
                videoId="ROSM7WNWEWM"
                className="mb-8"
                opts={{
                  width: '100%',
                  height: 'auto',
                }}
                title="유튜브"
              />
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
                    <Dialog className="z-[9999]" open={popupState.isOpen}>
                      <DialogTitle fontWeight="bold">
                        YouTube 링크
                      </DialogTitle>
                      <DialogContent>
                        <TextField
                          placeholder="e.g) https://www.youtube.com/watch?v=..."
                          variant="standard" fullWidth
                          className="!min-w-[18rem]"
                        />
                      </DialogContent>
                      <DialogActions className="!px-12 !pb-12">
                        <Button variant="contained">
                          확인
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </PopupState>
            </FormControl>
          </Box>
        </DialogContent>
      </Drawer>
    </>
  )
}

export default SongModal
