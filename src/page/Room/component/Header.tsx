import { AppBar, Toolbar, Typography } from '@mui/material'
import SettingDrawer from './SettingDrawer'

interface Props {
  title?: string
}
function RoomHeader ({ title = '' }: Props) {
  return (
    <AppBar position="fixed">
      <Toolbar disableGutters className="f-row-start-4 px-8">
        <SettingDrawer />
        <Typography variant="h6">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default RoomHeader
