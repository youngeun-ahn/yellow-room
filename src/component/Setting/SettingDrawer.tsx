import {
  Box, Drawer, Button, IconButton,
  FormControlLabel, FormControl, InputLabel,
  Checkbox, Select, MenuItem, Typography, FormHelperText,
} from '@mui/material'
import { Check, Info, Settings } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useState } from 'react'
import { useDeleteRoom } from '@core/query'
import { useSettingSlice } from '@core/store/settingSlice'
import PWAInstallButton from './PWAInstallButton'

function SettingPanel () {
  const {
    setting,
    toggleHideBlacklist,
    setGroupBy,
    setOrderBy,
  } = useSettingSlice()

  const navigate = useNavigate()

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

  const [copiedLink, setCopiedLink] = useState('')
  const { id: roomId = '' } = useParams()
  const { deleteRoom } = useDeleteRoom(roomId)

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
      </Box>
      {/* Actions */}
      <Box className="f-col-8">
        <Button
          variant="contained" size="large"
          className="!bg-green-500 !shadow-sm"
          onClick={() => navigate('/', { state: { logout: true } })}
        >
          로비로 이동
        </Button>
        <CopyToClipboard
          text={location.href}
          onCopy={setCopiedLink}
        >
          <Button
            variant="contained" size="large"
            className="!bg-yellow-400 !text-black !shadow-sm"
          >
            이 방의 링크 복사
            {copiedLink && (
              <Check color="success" fontSize="small" className="ml-4" />
            )}
          </Button>
        </CopyToClipboard>
        <Button
          variant="contained" size="large"
          color="error"
          className="!shadow-sm"
          onClick={() => deleteRoom()}
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
      {open && (
        <Typography className="fixed right-8 bottom-8">
          Copyright 2022. Youngeun.Ahn all rights reserved
        </Typography>
      )}
    </>
  )
}

export default SettingDrawer
