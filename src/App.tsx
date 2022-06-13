import { QueryClient, QueryClientProvider } from 'react-query'
import { Paper } from '@mui/material'
import Router from './Router'

const queryClient = new QueryClient()

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <Paper className="w-screen h-screen">
        <Router />
      </Paper>
    </QueryClientProvider>
  )
}

export default App
