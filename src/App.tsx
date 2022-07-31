import { QueryClient, QueryClientProvider } from 'react-query'
import { Paper, ThemeProvider } from '@mui/material'
import { logInstallApp } from '@core/analytics'
import { useEffect } from 'react'
import { usePWAInstall } from 'react-use-pwa-install'
import theme from './theme'
import Router from './Router'

const queryClient = new QueryClient()

function App () {
  /* PWA 설치 가능하다면 처음 한번 Install 물어보기 */
  const install = usePWAInstall()
  const isInstallReady = Boolean(install)

  useEffect(() => {
    if (!isInstallReady) return
    install?.()?.then(() => {
      logInstallApp('PWA', 'Popup')
    })
  }, [isInstallReady])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Paper className="w-screen h-screen">
          <Router />
        </Paper>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
