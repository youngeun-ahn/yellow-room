import { useLocation, useParams } from 'react-router-dom'

interface RoomLocationState {
  roomName?: string
  roomPwd?: string
}

interface Props {
  newRoom?: boolean
}
function Room ({ newRoom }: Props) {
  const { state } = useLocation()
  const { id = '' } = useParams()

  const {
    roomName, roomPwd,
  } = (state ?? {}) as RoomLocationState

  console.log(newRoom, state, id)

  return (
    <>
      asdfasdf
    </>
  )
}

export default Room
