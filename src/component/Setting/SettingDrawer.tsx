import { Drawer, IconButton, Typography } from '@mui/material'
import { Settings } from '@mui/icons-material'
import classNames from 'classnames'
import SettingPanel from './SettingPanel'

interface Props {
  open: boolean
  toggle: (open: boolean) => void
}
function SettingDrawer ({ open, toggle }: Props) {
  return (
    <>
      <IconButton
        onClick={() => toggle(!open)}
        disableRipple
        disableFocusRipple
      >
        <Settings
          htmlColor="white"
          className={classNames(
            '!transition-transform',
            { '!rotate-180': open },
          )}
        />
      </IconButton>
      <Drawer
        PaperProps={{ className: 'max-w-[80%]' }}
        anchor="left"
        open={open}
        onClose={() => toggle(false)}
        keepMounted
      >
        <SettingPanel />
      </Drawer>
      {open && (
        <Typography className="fixed right-8 bottom-8 pointer-events-none text-shadow-sm">
          Copyright 2022. 안윤근 all rights reserved
        </Typography>
      )}
    </>
  )
}

export default SettingDrawer
