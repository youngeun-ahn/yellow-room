import { Close, LockOpenOutlined, LockOutlined, Save } from '@mui/icons-material'
import { AppBar, IconButton, SvgIcon, Toolbar, Typography, Box } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useSongModalContext } from './SongModalProvider'

interface Props {
  onSave: () => void
}
function Header ({ onSave }: Props) {
  const {
    open, mode, closeModal,
  } = useSongModalContext()
  const [editable, setEditable] = useState(mode === 'NEW')

  useEffect(() => {
    setEditable(open ? mode === 'NEW' : false)
  }, [open])

  const title = useMemo(() => {
    if (mode === 'NEW') {
      return '새 노래 등록'
    }
    return editable
      ? '노래 편집'
      : '노래 상세 보기'
  }, [mode])

  const onToggleEditable = (nextEditable = !editable) => setEditable(nextEditable)
  const onClickSave = () => {
    onSave()
    closeModal()
  }

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
        <Box className="f-row">
          {/* 저장 */}
          {editable && (
            <IconButton onClick={onClickSave}>
              <Save htmlColor="white" />
            </IconButton>
          )}
          {/* Editable 토글 */}
          {mode === 'EDIT' && (
            <IconButton
              onClick={() => onToggleEditable()}
            >
              <SvgIcon
                sx={{ color: 'white' }}
                component={editable ? LockOpenOutlined : LockOutlined}
              />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
