import { useRoom } from '@core/query'
import { Box } from '@mui/material'
import { Navigate, useParams } from 'react-router-dom'

function Room () {
  const { id = '' } = useParams()
  const { room, isLoading } = useRoom(id)

  if (!id) {
    return <Navigate to="/" />
  }
  return (
    <Box className="f-center h-full p-24 bg-yellow-100">
      {JSON.stringify(room)}
    </Box>
  )
}

export default Room
