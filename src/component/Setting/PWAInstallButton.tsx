import { Button } from '@mui/material'
import { usePWAInstall } from 'react-use-pwa-install'

function PWAInstallButton () {
  const install = usePWAInstall()
  if (!install) return <></>
  return (
    <Button
      disableElevation
      variant="contained" size="large"
      onClick={() => install()}
    >
      모바일 App 설치 (PWA)
    </Button>
  )
}

export default PWAInstallButton
