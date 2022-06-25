import { Button, ButtonProps } from '@mui/material'
import { usePWAInstall } from 'react-use-pwa-install'

function PWAInstallButton ({ onClick, ...props }: ButtonProps) {
  const install = usePWAInstall()

  const onClickInstall: ButtonProps['onClick'] = e => {
    onClick?.(e)
    install?.()
  }
  // if (!install) return <></>
  return (
    <Button onClick={onClickInstall} {...props}>
      모바일 App 설치 (PWA)
    </Button>
  )
}

export default PWAInstallButton
