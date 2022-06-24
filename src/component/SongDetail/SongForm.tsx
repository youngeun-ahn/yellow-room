import { useSongList } from '@core/query'
import { toTagList, uniqSort } from '@core/util'
import { InfoOutlined } from '@mui/icons-material'
import {
  Box,
  FormControl, FormControlLabel, FormLabel,
  Autocomplete, TextField, Checkbox, Rating,
} from '@mui/material'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useSongDetailContext } from './context'
import EmbedYouTube from './EmbedYouTube'
import GenderToggleButton from './GenderToggleButton'

interface Props {
  songForm: UseFormReturn<Song>
}
function SongForm ({ songForm }: Props) {
  const { song, isReadonly } = useSongDetailContext()
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors = {} },
  } = songForm

  const { id: roomId = '' } = useParams()
  const { songList } = useSongList(roomId)
  const singerList = uniqSort(songList.map(_ => _.singer))
  const originList = uniqSort(songList.map(_ => _.origin))
  const tagList = uniqSort(songList.flatMap(_ => _.tagList))

  return (
    <Box className="w-[40rem] max-w-full mx-auto f-col-12 !flex-nowrap">
      {/* 번호, 키 */}
      <Box className="f-row-8 !items-start">
        <TextField
          label="번호"
          variant="standard" type="number" required
          className="w-[6rem]"
          {...register('number', {
            required: '노래 번호는 반드시 입력해야 합니다.',
            validate (num) {
              /* 노래 번호 중복 체크 */
              const number = Number.parseInt(String(num), 10)
              const found = songList.find(_ => _.number === number)
              if (!found || number === song?.number) {
                return undefined
              }
              return `이미 등록된 노래 번호 입니다(${found.title}).`
            },
          })}
          error={Boolean(errors.number)}
          helperText={errors.number?.message && (
            <>
              <InfoOutlined />
              <Box
                component="span"
                color="red"
                className="w-fit max-w-xs whitespace-nowrap"
              >
                {errors.number?.message}
              </Box>
            </>
          )}
          disabled={isReadonly}
        />
        <Box className="f-row-8">
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
                  disabled={isReadonly}
                />
              ),
            }}
            disabled={isReadonly}
          />
          <TextField
            label="템포"
            variant="standard" type="number"
            className="w-[6rem]"
            {...register('tempo')}
            disabled={isReadonly}
          />
        </Box>
      </Box>
      {/* 노래 제목 */}
      <TextField
        label="노래 제목"
        variant="standard" fullWidth required
        inputProps={{ maxLength: 64 }}
        {...register('title', {
          required: '노래 제목은 반드시 입력해야 합니다.',
        })}
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
        disabled={isReadonly}
      />
      {/* 가수 */}
      <Controller
        name="singer"
        render={({ field }) => (
          <Autocomplete
            id="select-singer"
            freeSolo autoSelect
            clearOnEscape clearOnBlur
            options={singerList}
            value={field.value}
            onChange={(_, nextSinger) => setValue('singer', nextSinger ?? '')}
            renderInput={({ InputProps, inputProps, ...params }) => (
              <TextField
                {...params}
                label="가수"
                variant="standard"
                InputProps={{
                  ...InputProps,
                  inputProps: {
                    ...inputProps,
                    maxLength: 64,
                  },
                }}
              />
            )}
            disabled={isReadonly}
          />
        )}
        control={control}
      />
      {/* 원작 */}
      <Controller
        name="origin"
        render={({ field }) => (
          <Autocomplete
            id="select-origin"
            freeSolo autoSelect
            clearOnEscape clearOnBlur
            options={originList}
            value={field.value}
            onChange={(_, nextOrigin) => setValue('origin', nextOrigin ?? '')}
            renderInput={({ InputProps, inputProps, ...params }) => (
              <TextField
                {...params}
                label="작품 (영화, 드라마, 게임 등)"
                variant="standard"
                InputProps={{
                  ...InputProps,
                  inputProps: {
                    ...inputProps,
                    maxLength: 64,
                  },
                }}
              />
            )}
            disabled={isReadonly}
          />
        )}
        control={control}
      />
      <Box className="f-row-start-24 !items-end">
        {/* 선호도 */}
        <FormControl className="f-col-8">
          <FormLabel>선호도</FormLabel>
          <Controller
            name="rating"
            render={({ field }) => (
              <Rating
                size="large"
                value={field.value}
                readOnly={isReadonly}
                onChange={(_, nextRating) => setValue('rating', nextRating ?? 0)}
              />
            )}
            control={control}
          />
        </FormControl>
        {/* 블랙리스트 여부 */}
        <Controller
          name="isBlacklist"
          render={({ field }) => (
            <FormControlLabel
              label="블랙리스트?"
              control={(
                <Checkbox
                  disableRipple
                  className="!p-2 !mr-2"
                  value={field.value}
                  onChange={(_, checked) => setValue('isBlacklist', checked)}
                />
              )}
              disabled={isReadonly}
            />
          )}
          control={control}
          defaultValue={false}
        />
      </Box>
      {/* 태그 */}
      <Controller
        name="tagList"
        render={({ field }) => (
          <Autocomplete
            id="select-tag-list"
            freeSolo autoSelect multiple
            clearOnEscape clearOnBlur
            options={tagList}
            value={uniqSort(field.value)}
            onChange={(_, nextTagList) => {
              const tags = (nextTagList ?? []).flatMap(toTagList)
              setValue('tagList', uniqSort(tags ?? []))
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant="standard"
                label="태그 (# 또는 공백으로 구분)"
              />
            )}
            disabled={isReadonly}
          />
        )}
        control={control}
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
        disabled={isReadonly}
      />
      {/* 가사 */}
      <TextField
        label="가사"
        variant="outlined" fullWidth
        multiline rows={4}
        inputProps={{ maxLength: 1024 }}
        {...register('lyric')}
        disabled={isReadonly}
      />
      {/* 동영상 */}
      <Controller
        name="youtube"
        render={({ field }) => (
          <EmbedYouTube
            youtube={field.value}
            onChange={nextYoutube => setValue('youtube', nextYoutube)}
            readOnly={isReadonly}
          />
        )}
        control={control}
        defaultValue=""
      />
    </Box>
  )
}

export default SongForm
