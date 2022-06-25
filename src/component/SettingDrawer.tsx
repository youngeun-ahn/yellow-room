import {
  Box, Drawer, Button, IconButton,
  FormControlLabel, FormControl, InputLabel,
  Checkbox, Select, MenuItem,
} from '@mui/material'
import { Settings } from '@mui/icons-material'
import useLocalStorage from 'use-local-storage'
import PWAInstallButton from './PWAInstallButton'

function SettingPanel () {
  const [setting, setSetting] = useLocalStorage<Setting>('setting', {
    hideBlacklist: false,
    groupBy: 'ORIGIN',
    orderBy: 'GROUP',
  })

  const groupByLabel = {
    ORIGIN: '원작으로 그룹핑',
    NONE: '그룹핑 안함',
  }

  const orderByLabel = {
    GROUP: '그룹명으로 정렬',
    TITLE: '노래 제목으로 정렬',
    RATING: '선호도 순으로 정렬',
    RANDOM: '무작위 순서로 정렬',
  }

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
              onChange={(_, checked) => {
                setSetting({
                  ...setting,
                  hideBlacklist: checked,
                })
              }}
            />
          )}
        />
        {/* Group By */}
        <FormControl variant="outlined">
          <InputLabel className="bg-yellow-50 !pl-2 !pr-4">
            그룹핑
          </InputLabel>
          <Select
            value={setting.groupBy}
            renderValue={groupBy => groupByLabel[groupBy]}
            onChange={e => setSetting({
              ...setting,
              groupBy: e.target.value as GroupBy,
            })}
          >
            {Object.entries(groupByLabel).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Group By */}
        <FormControl variant="outlined">
          <InputLabel className="bg-yellow-50 !pl-2 !pr-4">
            정렬 기준
          </InputLabel>
          <Select
            value={setting.orderBy}
            renderValue={orderBy => orderByLabel[orderBy]}
            onChange={e => setSetting({
              ...setting,
              orderBy: e.target.value as OrderBy,
            })}
          >
            {Object.entries(orderByLabel).map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Actions */}
      <Box className="f-col-8">
        <Button
          variant="contained" size="large"
          className="!bg-white !text-blue-600 !shadow-sm"
          onClick={() => {}}
        >
          로비로 이동
        </Button>
        <Button
          variant="contained" size="large"
          className="!bg-yellow-400 !text-black !shadow-sm"
          onClick={() => {}}
        >
          이 방의 링크 복사
        </Button>
        <Button
          variant="contained" size="large"
          color="error"
          className="!shadow-sm"
          onClick={() => {}}
        >
          방 청소하기
        </Button>
        <PWAInstallButton
          disableElevation
          variant="contained" size="large"
        />
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
      >
        <SettingPanel />
      </Drawer>
    </>
  )
}

export default SettingDrawer
