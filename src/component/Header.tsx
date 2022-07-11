import { AppBar, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import SettingDrawer from './Setting/SettingDrawer'

interface Props {
  title?: string
}
function RoomHeader ({ title = '' }: Props) {
  /* Mobile back 버튼 핸들링을 위해 location state로 제어 */
  const { state } = useLocation()
  const locState = state as { drawer?: 'setting' }
  const open = locState?.drawer === 'setting'

  const navigate = useNavigate()
  const toggle = (isOpen = !open) => {
    if (isOpen) {
      navigate('', { state: { drawer: 'setting' } })
    } else {
      navigate('', { state: { replace: true } })
    }
  }

  return (
    <AppBar position="fixed" className="!z-[9999]">
      <Toolbar className="f-row-start-4">
        <SettingDrawer open={open} toggle={toggle} />
        <Typography variant="h6">
          {title}
          {open && ' > Settings'}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default RoomHeader
