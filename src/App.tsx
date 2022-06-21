import { QueryClient, QueryClientProvider } from 'react-query'
import { Paper, ThemeProvider } from '@mui/material'
import Router from './Router'
import theme from './theme'

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
