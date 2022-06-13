import { Box, IconButton, Drawer, Typography, Divider } from '@mui/material'
import { Settings } from '@mui/icons-material'
import { useState } from 'react'

function SettingPanel () {
  return (
    <Box className="f-col-8 w-[32rem] max-w-full h-full px-12 py-16 bg-yellow-50">
      <Typography variant="h6" className="f-row-start-4">
        <Settings />
        Settings
      </Typography>
      <Divider color="black" />
    </Box>
  )
}

function SettingDrawer () {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Settings htmlColor="white" />
      </IconButton>
      <Drawer
        PaperProps={{ className: 'max-w-[80%]' }}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <SettingPanel />
      </Drawer>
    </>
  )
}

export default SettingDrawer
