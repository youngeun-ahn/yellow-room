import SongCard from '@component/SongCard'
import { useSettingSlice } from '@core/store/settingSlice'
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormGroup, FormControlLabel, Checkbox,
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
        PaperProps={{ className: '!mx-4' }}
      >
        <DialogTitle className="!font-bold">
          노래 카드 보기 설정
        </DialogTitle>
        <DialogContent className="f-col-8">
          {/* Preview */}
          <Box className="-mx-8">
            <SongCard song={SONG_MOCK as Song} mock />
          </Box>
          {/* Settings */}
          <Box className="f-row">
            {[0, 4].map(groupIdx => (
              <FormGroup key={groupIdx} className="flex-1">
                {OPTIONS.slice(groupIdx, groupIdx + 4).map(({ label, option }) => (
                  <FormControlLabel
                    label={label}
                    key={option}
                    value={option}
                    checked={setting.cardViewOptionList.includes(option)}
                    onChange={(_, checked) => toggleCardViewOption(option, checked)}
                    control={<Checkbox />}
                  />
                ))}
              </FormGroup>
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
