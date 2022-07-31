import { logExitRoom } from '@core/analytics'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function ExitRoomButton () {
  const navigate = useNavigate()
  return (
    <Button
      variant="contained" size="large"
      className="!bg-green-500 !shadow-sm"
      onClick={() => {
        logExitRoom()
        navigate('/', { state: { exit: true } })
      }}
    >
      로비로 나가기
    </Button>
  )
}

export default ExitRoomButton
