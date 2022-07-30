import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useState } from 'react'

interface Props {
  label: string
  title: string
  content: string
}

function SongTextPreviewModal ({ label, title, content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="small"
        className="!min-w-fit h-[1.2rem]"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{ className: '!max-h-[32rem] w-full' }}
        >
          <DialogTitle className="!font-bold">
            {title}
          </DialogTitle>
          <DialogContent className="whitespace-pre-wrap text-xs">
            {content}
          </DialogContent>
          <DialogActions>
            <Button
              size="large"
              onClick={() => setOpen(false)}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default SongTextPreviewModal
