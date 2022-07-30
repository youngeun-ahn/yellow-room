import SongCard from '@component/SongCard'
import { useSettingSlice } from '@core/store/settingSlice'
import {
  Box, Button,
  Dialog, DialogActions, DialogContent,
  FormControlLabel, Checkbox,
} from '@mui/material'
import { useState } from 'react'
import SONG_MOCK from './mock.json'

function CardViewSettingButton () {
  type Option = { label: string, option: CardViewOption }
  const OPTIONS: Option[] = [
    { label: '키', option: 'KEY' },
    { label: '선호도', option: 'RATING' },
    { label: '원작', option: 'ORIGIN' },
    { label: '가수', option: 'SINGER' },
    { label: '태그 목록', option: 'TAG' },
    { label: '가사', option: 'LYRIC' },
    { label: '메모', option: 'MEMO' },
    { label: '동영상', option: 'YOUTUBE' },
  ]

  const {
    setting,
    toggleCardViewOption,
  } = useSettingSlice()

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        노래 카드 보기 설정
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: '!mx-4 w-full sm:w-auto' }}
      >
        <DialogContent className="!py-16 !px-8 !bg-yellow-300">
          {/* Preview */}
          <SongCard song={SONG_MOCK as Song} mock />
        </DialogContent>
        <DialogContent className="f-col-8 !pb-0">
          {/* Settings */}
          <Box className="grid grid-cols-2">
            {OPTIONS.map(({ label, option }) => (
              <FormControlLabel
                label={label}
                key={option}
                value={option}
                checked={setting.cardViewOptionList.includes(option)}
                onChange={(_, checked) => toggleCardViewOption(option, checked)}
                control={<Checkbox />}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            onClick={() => setOpen(false)}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CardViewSettingButton
