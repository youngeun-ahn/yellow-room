import { logShareRoom } from '@core/analytics'
import { ContentCopy } from '@mui/icons-material'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useLocation, useNavigate } from 'react-router-dom'
import SettingDrawer from './Setting/SettingDrawer'

interface Props {
  roomId?: string
  roomName?: string
}
function RoomHeader ({ roomId = '', roomName = '' }: Props) {
  /* Mobile back 버튼 핸들링을 위해 location state로 제어 */
  const { state } = useLocation()
  const locState = state as { drawer?: 'setting' }
  const isSettingOpened = locState?.drawer === 'setting'

  const navigate = useNavigate()
  const toggle = (isOpen = !isSettingOpened) => {
    if (isOpen) {
      navigate('', { state: { drawer: 'setting' } })
    } else {
      navigate('', { replace: true })
    }
  }

  return (
    <AppBar position="fixed" className="!z-[9999]">
      <Toolbar className="f-row-start-4">
        <SettingDrawer open={isSettingOpened} toggle={toggle} />
        <Typography
          variant="h6"
          display={roomName ? undefined : 'none'}
        >
          {roomName}
          {
            isSettingOpened
              ? ' > Settings'
              : (
                <>
                  <small className="opacity-30">
                    {` (${roomId})`}
                  </small>
                  <CopyToClipboard
                    text={location.href}
                    onCopy={logShareRoom}
                  >
                    <IconButton
                      className="opacity-30 hover:opacity-100 !ml-2"
                      disableRipple
                      disableFocusRipple
                    >
                      <ContentCopy htmlColor="white" />
                    </IconButton>
                  </CopyToClipboard>
                </>
              )
          }
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default RoomHeader
