import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function ExitRoomButton () {
  const navigate = useNavigate()
  return (
    <Button
      variant="contained" size="large"
      className="!bg-green-500 !shadow-sm"
      onClick={() => navigate('/', { state: { logout: true } })}
    >
      로비로 이동
    </Button>
  )
}

export default ExitRoomButton
