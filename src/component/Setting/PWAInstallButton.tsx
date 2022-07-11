import { LoadingButton } from '@mui/lab'
import { useEffect, useState } from 'react'
import { usePWAInstall } from 'react-use-pwa-install'

type TimerID = ReturnType<typeof setTimeout> | null

function PWAInstallButton () {
  const install = usePWAInstall()
  const isInstallReady = install !== null
  const [isPWAEnabled, setPWAEnabled] = useState(isInstallReady)
  const [timer, setTimer] = useState<TimerID>(null)

  // 10초 대기 후 disable 처리
  useEffect(() => {
    if (isPWAEnabled || isInstallReady || timer) return
    const timeout = setTimeout(() => {
      setPWAEnabled(false)
      setTimer(null)
    }, 10000)
    setTimer(timeout)
  }, [])

  // 언제든지 install 함수가 주어지면 enable 처리
  useEffect(() => {
    if (!isInstallReady) return
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setPWAEnabled(true)
  }, [isInstallReady])

  const isLoading = Boolean(timer)
  if (!isLoading && !isPWAEnabled) return <></>

  return (
    <LoadingButton
      disableElevation
      loading={isLoading}
      loadingPosition="start"
      startIcon={<></>}
      variant="contained" size="large"
      onClick={install}
    >
      모바일 App 설치 (PWA)
    </LoadingButton>
  )
}

export default PWAInstallButton
