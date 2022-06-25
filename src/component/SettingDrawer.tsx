import { Box, IconButton, Drawer, Typography, Divider, Button } from '@mui/material'
import { Settings } from '@mui/icons-material'

// @ts-ignore
let deferredPrompt
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  deferredPrompt = e
})

function SettingPanel () {
  return (
    <Box className="f-col-8 w-[32rem] max-w-full h-full px-12 py-[6.4rem] bg-yellow-50">
      <Typography variant="h6" className="f-row-start-4">
        <Settings />
        Settings
      </Typography>
      <Divider color="black" />
      {/* @ts-ignore */}
      {JSON.stringify(deferredPrompt)}
      {/* @ts-ignore */}
      <Button onClick={() => deferredPrompt?.prompt()}>
        Install4
      </Button>
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
