import { logShareRoom } from '@core/analytics'
import { CheckCircle, ContentCopy } from '@mui/icons-material'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
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

  const [copied, setCopied] = useState(false)
  const onCopy = (text?: string, result?: boolean) => {
    setCopied(Boolean(result))

    if (!result) return
    logShareRoom()
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
          {isSettingOpened ? (
            ' > Settings'
          ) : (
            <>
              <small className="opacity-30">
                {` (${roomId})`}
              </small>
              <CopyToClipboard
                text={location.href}
                onCopy={onCopy}
              >
                <IconButton
                  className="opacity-70 hover:opacity-100 !ml-2"
                  disableRipple
                  disableFocusRipple
                >
                  {copied
                    ? <CheckCircle htmlColor="white" />
                    : <ContentCopy htmlColor="white" />}
                </IconButton>
              </CopyToClipboard>
            </>
          )}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default RoomHeader
