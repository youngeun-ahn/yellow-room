import { Close } from '@mui/icons-material'
import { AppBar, DialogContent, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import { useSongModalContext } from './SongModalProvider'

/* Song Modal */
function SongModal () {
  const {
    song, open, closeModal,
  } = useSongModalContext()

  const onClose = () => {
    closeModal()
  }

  return (
    <>
      {open && (
        <AppBar position="fixed" className="!z-[9999]">
          <Toolbar disableGutters className="f-row-start-4 px-8">
            <IconButton onClick={onClose}>
              <Close htmlColor="white" />
            </IconButton>
            <Typography variant="h6">
              Song Detail
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Drawer open={open} closeAfterTransition anchor="bottom">
        <DialogContent className="h-screen">
          {song && JSON.stringify(song)}
        </DialogContent>
      </Drawer>
    </>
  )
}

export default SongModal
