import { QueryClient, QueryClientProvider } from 'react-query'
import { Paper, ThemeProvider } from '@mui/material'
import { usePWAInstall } from 'react-use-pwa-install'
import { useEffect } from 'react'
import Router from './Router'
import theme from './theme'

const queryClient = new QueryClient()

function App () {
  /* PWA 설치 가능하다면 처음 한번 Install 물어보기 */
  const install = usePWAInstall()
  const isInstallReady = install !== null

  useEffect(() => {
    if (!isInstallReady) return
    install?.()
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
