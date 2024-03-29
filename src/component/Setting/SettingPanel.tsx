import {
  Box,
  FormControlLabel, FormControl, InputLabel,
  Checkbox, Select, MenuItem, FormHelperText,
} from '@mui/material'
import { Info } from '@mui/icons-material'
import { useSettingSlice } from '@core/store/settingSlice'
import { useDeepCompareEffect } from 'use-deep-compare'
import PWAInstallButton from './PWAInstallButton'
import DeleteRoomButton from './DeleteRoomButton'
import CopyRoomLinkButton from './CopyRoomLinkButton'
import ExitRoomButton from './ExitRoomButton'
import CardViewSettingModal from './CardViewSettingModal'
import SendCoffeeButton from './SendCoffeeButton'

function SettingPanel () {
  const {
    setting,
    toggleHideBlacklist,
    setGroupBy,
    setOrderBy,
  } = useSettingSlice()

  const groupByLabel = {
    GROUP: '설정한 그룹으로 그룹핑',
    SINGER: '가수 이름으로 그룹핑',
    NONE: '그룹핑하지 않음',
  }

  const orderByLabel = {
    TITLE: '노래 제목으로 정렬',
    RATING: '선호도 순으로 정렬',
    RANDOM: '무작위 순서로 정렬',
  }

  const isShuffle = setting.orderBy === 'RANDOM'

  useDeepCompareEffect(() => {
    window.dispatchEvent(new Event('rerender-card'))
  }, [setting])

  return (
    <Box className="f-col-8 w-[32rem] max-w-full h-full px-12 pt-[4.8rem] sm:pt-[5.4rem] pb-24 bg-yellow-50">
      <Box className="f-col-16 flex-auto">
        {/* Hide Blacklist */}
        <FormControlLabel
          label="블랙리스트 숨기기"
          className="-mb-8"
          control={(
            <Checkbox
              checked={setting.hideBlacklist}
              onChange={(_, checked) => toggleHideBlacklist(checked)}
            />
          )}
        />
        {/* Group By */}
        <FormControl
          variant="outlined"
          disabled={isShuffle}
        >
          <InputLabel className="bg-yellow-50 !pl-2 !pr-4">
            그룹핑
          </InputLabel>
          <Select
            value={setting.groupBy}
            renderValue={groupBy => groupByLabel[groupBy]}
            onChange={e => setGroupBy(e.target.value as GroupBy)}
          >
            {Object.entries(groupByLabel).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
          {isShuffle && (
            <FormHelperText className="!mx-4">
              <Info fontSize="small" />
              무작위 순서로 정렬하는 경우에는 그룹핑할 수 없습니다.
            </FormHelperText>
          )}
        </FormControl>
        {/* Order By */}
        <FormControl variant="outlined">
          <InputLabel className="bg-yellow-50 !pl-2 !pr-4">
            정렬 기준
          </InputLabel>
          <Select
            value={setting.orderBy}
            renderValue={orderBy => orderByLabel[orderBy]}
            onChange={e => setOrderBy(e.target.value as OrderBy)}
          >
            {Object.entries(orderByLabel).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Song Card View Options */}
        <CardViewSettingModal />
      </Box>
      {/* Actions */}
      <Box className="f-col-8 mb-24">
        <CopyRoomLinkButton />
        <ExitRoomButton />
        <DeleteRoomButton />
        <SendCoffeeButton />
        <PWAInstallButton />
      </Box>
    </Box>
  )
}

export default SettingPanel
