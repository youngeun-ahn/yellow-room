import {
  Drawer, Autocomplete, Checkbox,
  DialogContent,
  FormControl, FormControlLabel, FormLabel,
  Box, Rating, TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import EmbedYouTube from './EmbedYouTube'
import GenderToggleButton from './GenderToggleButton'
import Header from './Header'
import { useSongModalContext } from './SongModalProvider'

/* Song Modal */
function SongModal () {
  const { song, open } = useSongModalContext()

  const {
    register,
    watch,
    getFieldState,
    setValue,
    handleSubmit,
  } = useForm<Song>({
    defaultValues: song,
  })

  return (
    <>
      <Header onSave={() => {}} />
      <Drawer open={open} closeAfterTransition anchor="bottom">
        <DialogContent className="h-screen !pt-[4.8rem] bg-yellow-50">
          <Box className="w-[40rem] max-w-full mx-auto f-col-12 !flex-nowrap">
            {/* 번호, 키 */}
            <Box className="f-row-start-8 !items-end">
              <TextField
                label="번호"
                variant="standard" type="number" required
                className="w-[6rem]"
                {...register('number', {
                  required: '번호는 반드시 입력해야 합니다.',
                })}
                error={Boolean(getFieldState('number').error)}
                helperText={getFieldState('number').error?.message}
              />
              <TextField
                label="키"
                variant="standard" type="number"
                className="w-[6rem]"
                {...register('key')}
                InputProps={{
                  endAdornment: (
                    <GenderToggleButton
                      gender={watch('gender')}
                      onChange={gender => setValue('gender', gender)}
                    />
                  ),
                }}
              />
              <TextField
                label="템포"
                variant="standard" type="number"
                className="w-[6rem]"
                {...register('tempo')}
              />
            </Box>
            {/* 노래 제목 */}
            <TextField
              label="노래 제목"
              variant="standard" fullWidth required
              inputProps={{ maxLength: 64 }}
              {...register('title', {
                required: '노래 제목은 반드시 입력해야 합니다.',
              })}
              error={Boolean(getFieldState('title').error)}
              helperText={getFieldState('title').error?.message}
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
                  {...register('singer')}
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
                  label="작품 (영화, 드라마, 게임 등)"
                  variant="standard"
                  inputProps={{ maxLength: 64 }}
                />
              )}
              {...register('origin')}
            />
            <Box className="f-row-start-24 !items-end">
              {/* 선호도 */}
              <FormControl className="f-col">
                <FormLabel className="mb-8">선호도</FormLabel>
                <Rating
                  size="large"
                  value={watch('rating')}
                  onChange={(_, rating) => setValue('rating', rating ?? 0)}
                />
              </FormControl>
              {/* 블랙리스트 여부 */}
              <FormControlLabel
                label="블랙리스트?"
                control={(
                  <Checkbox
                    disableRipple
                    className="!p-2 !mr-2"
                    value={watch('isBlacklist')}
                    onChange={(_, checked) => setValue('isBlacklist', checked)}
                  />
                )}
              />
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
                  error={Boolean(getFieldState('tagList').error)}
                  helperText={getFieldState('tagList').error?.message}
                />
              )}
              {...register('tagList', {
                maxLength: {
                  value: 10,
                  message: '최대 10개까지 태그를 지정할 수 있습니다.',
                },
              })}
            />
            {/* 메모 */}
            <TextField
              label="메모"
              variant="outlined" fullWidth
              multiline rows={4}
              InputProps={{
                inputProps: { maxLength: 1024 },
              }}
              {...register('memo')}
            />
            {/* 가사 */}
            <TextField
              label="가사"
              variant="outlined" fullWidth
              multiline rows={4}
              inputProps={{ maxLength: 1024 }}
              {...register('lyric')}
            />
            {/* 동영상 */}
            <EmbedYouTube
              youtube={watch('youtube')}
              onChange={youtube => setValue('youtube', youtube)}
            />
          </Box>
        </DialogContent>
      </Drawer>
    </>
  )
}

function SongModalOpener () {
  const { open } = useSongModalContext()
  if (!open) {
    return <></>
  }
  return <SongModal />
}

export default SongModalOpener