import {
  Box, Drawer, IconButton,
  FormControlLabel, FormControl, InputLabel,
  Checkbox, Select, MenuItem, Typography, FormHelperText,
} from '@mui/material'
import { Info, Settings } from '@mui/icons-material'
import { useSettingSlice } from '@core/store/settingSlice'
import PWAInstallButton from './PWAInstallButton'
import DeleteRoomButton from './DeleteRoomButton'
import CopyRoomLinkButton from './CopyRoomLinkButton'
import ExitRoomButton from './ExitRoomButton'
import CardViewSettingModal from './CardViewSettingModal'

function SettingPanel () {
  const {
    setting,
    toggleHideBlacklist,
    setGroupBy,
    setOrderBy,
  } = useSettingSlice()

  const groupByLabel = {
    ORIGIN: '원작으로 그룹핑',
    SINGER: '가수 이름으로 그룹핑',
    NONE: '그룹핑 안함',
  }

  const orderByLabel = {
    GROUP: '그룹명으로 정렬',
    TITLE: '노래 제목으로 정렬',
    RATING: '선호도 순으로 정렬',
    RANDOM: '무작위 순서로 정렬',
  }

  const isShuffle = setting.orderBy === 'RANDOM'

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
          {isShuffle && (
            <FormHelperText>
              <Info fontSize="small" />
              정렬 기준이 무작위 순서인 경우 그룹핑할 수 없습니다.
            </FormHelperText>
          )}
        </FormControl>
        {/* Song Card View Options */}
        <CardViewSettingModal />
      </Box>
      {/* Actions */}
      <Box className="f-col-8 mb-24">
        <CopyRoomLinkButton />
        <ExitRoomButton />
        <DeleteRoomButton />
        <PWAInstallButton />
      </Box>
    </Box>
  )
}

interface Props {
  open: boolean
  toggle: (open?: boolean) => void
}
function SettingDrawer ({ open, toggle }: Props) {
  return (
    <>
      <IconButton onClick={() => toggle()}>
        <Settings htmlColor="white" />
      </IconButton>
      <Drawer
        PaperProps={{ className: 'max-w-[80%]' }}
        anchor="left"
        open={open}
        onClose={() => toggle(false)}
        keepMounted
      >
        <SettingPanel />
      </Drawer>
      {open && (
        <Typography
          className="fixed right-8 bottom-8 pointer-events-none text-shadow-sm"
        >
          Copyright 2022. 안윤근 all rights reserved
        </Typography>
      )}
    </>
  )
}

export default SettingDrawer
