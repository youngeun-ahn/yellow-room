import { Close, LockOpenOutlined, LockOutlined, Save } from '@mui/icons-material'
import { AppBar, IconButton, SvgIcon, Toolbar, Typography, Box } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useSongModalContext } from './SongModalProvider'

interface Props {
  onSave: () => void
  onReset: () => void
}
function Header ({ onSave, onReset }: Props) {
  const {
    open, mode,
    isNew, isEditable, isReadonly,
    closeModal, setMode,
  } = useSongModalContext()

  const title = useMemo(() => {
    if (isNew) {
      return '새 노래 등록'
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
        <IconButton onClick={closeModal}>
          <Close htmlColor="white" />
        </IconButton>
        {/* 타이틀 */}
        <Typography variant="h6" className="flex-auto">
          {title}
        </Typography>
        <Box className="f-row-4">
          {/* 저장 */}
          {!isReadonly && (
            <IconButton onClick={onSave}>
              <Save htmlColor="white" />
            </IconButton>
          )}
          {/* Editable 토글 */}
          {!isNew && (
            <IconButton onClick={onToggleEditable}>
              <SvgIcon
                sx={{ color: 'white' }}
                component={isEditable ? LockOpenOutlined : LockOutlined}
              />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
