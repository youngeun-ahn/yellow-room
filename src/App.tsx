import { QueryClient, QueryClientProvider } from 'react-query'
import { Paper, ThemeProvider } from '@mui/material'
import theme from './theme'
import Router from './Router'

const queryClient = new QueryClient()

function App () {
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
