import { Box, IconButton, Drawer, Typography, Divider, Button } from '@mui/material'
import { Settings } from '@mui/icons-material'

import { usePWAInstall } from 'react-use-pwa-install'

function SettingPanel () {
  const install = usePWAInstall()
  return (
    <Box className="f-col-8 w-[32rem] max-w-full h-full px-12 py-[6.4rem] bg-yellow-50">
      <Typography variant="h6" className="f-row-start-4">
        <Settings />
        Settings
      </Typography>
      <Divider color="black" />
      {install && (
        <Button onClick={install}>
          App으로 설치 (PWA)
        </Button>
      )}
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
