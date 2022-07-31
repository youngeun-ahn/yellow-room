import { logShareRoom } from '@core/analytics'
import { Check } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

function CopyRoomLinkButton () {
  const [copiedLink, setCopiedLink] = useState('')

  return (
    <CopyToClipboard
      text={location.href}
      onCopy={url => {
        setCopiedLink(url)
        logShareRoom()
      }}
    >
      <Button
        variant="contained" size="large"
        className="!bg-yellow-400 !text-black !shadow-sm"
      >
        이 방의 링크 복사
        {copiedLink && (
          <Check color="success" fontSize="small" className="ml-4" />
        )}
      </Button>
    </CopyToClipboard>
  )
}

export default CopyRoomLinkButton
