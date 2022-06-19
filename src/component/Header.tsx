import { AppBar, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import SettingDrawer from './SettingDrawer'

interface Props {
  title?: string
}
function RoomHeader ({ title = '' }: Props) {
  const [open, setOpen] = useState(false)
  const toggle = (isOpen = !open) => setOpen(isOpen)
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
