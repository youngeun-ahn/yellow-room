import { Close, Delete, Edit, Replay, Save } from '@mui/icons-material'
import { AppBar, IconButton, SvgIcon, Toolbar, Typography, Box, Tooltip } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useSongDetailContext } from './context'

interface Props {
  onSave: () => void
  onReset: () => void
  onDelete: () => void
  isLoading: boolean
}
function Header ({ onSave, onReset, onDelete, isLoading }: Props) {
  const {
    open, mode,
    isNew, isEditable, isReadonly,
    closeSongDetail,
    setMode,
  } = useSongDetailContext()

  const title = useMemo(() => {
    if (isNew) {
      return '새 노래 넣기'
    }
    if (isEditable) {
      return '노래 편집'
    }
    if (isReadonly) {
      return '노래 상세 보기'
    }
    return ''
  }, [mode])

  const onToggleEditable = useCallback(() => {
    if (isNew) return
    if (isEditable) {
      onReset()
    }
    setMode(isEditable ? 'READ' : 'EDIT')
  }, [mode])

  if (!open) return <></>

  return (
    <AppBar position="fixed" className="!z-[9999]">
      <Toolbar className="f-row-4">
        {/* 닫기 */}
        <IconButton onClick={closeSongDetail}>
          <Close htmlColor="white" />
        </IconButton>
        {/* 타이틀 */}
        <Typography variant="h6" className="flex-auto">
          {title}
        </Typography>
        <Box className="f-row sm:gap-4">
          {/* 삭제 */}
          {!isReadonly && !isNew && (
            <IconButton
              onClick={onDelete}
              disabled={isLoading}
            >
              <Delete htmlColor="white" />
            </IconButton>
          )}
          {/* 저장 */}
          {!isReadonly && (
            <Tooltip title="Alt + Enter">
              <IconButton
                onClick={onSave}
                disabled={isLoading}
              >
                <Save htmlColor="white" />
              </IconButton>
            </Tooltip>
          )}
          {/* Editable 토글 */}
          {!isNew && (
            <IconButton
              onClick={onToggleEditable}
              disabled={isLoading}
            >
              <SvgIcon
                sx={{ color: 'white' }}
                component={isEditable ? Replay : Edit}
              />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
