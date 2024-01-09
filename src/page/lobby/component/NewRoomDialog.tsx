import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCreateRoom } from '@core/query'
import { LoadingButton } from '@mui/lab'
import { logCreateRoom } from '@core/analytics'
import { RoomFormProps } from '..'

interface Props extends RoomFormProps {
  open: boolean
  onClose: () => void
}

function NewRoomDialog ({ form, open, onClose }: Props) {
  const navigate = useNavigate()

  const { roomName, roomPwd } = form.watch()
  const isPrivate = Boolean(roomPwd)

  const {
    createRoom,
    roomId: newRoomId,
    isLoading: isLoadingNewRoom,
  } = useCreateRoom()

  const onCreateRoom = () => {
    createRoom(roomName.trim(), roomPwd)
    logCreateRoom(isPrivate)
    onClose()
    navigate(`/room/${newRoomId}`, { replace: true })
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        새 방 만들기
      </DialogTitle>
      <DialogContent>
        아직 해당 방 이름과 열쇠로 만들어진 방이 없습니다.
        <br />
        방을 새로 만드시겠습니까?
      </DialogContent>
      <DialogActions className="mr-8 mb-4">
        <Button
          variant="text"
          size="large"
          hidden={isLoadingNewRoom}
          onClick={onClose}
        >
          취소
        </Button>
        <LoadingButton
          variant="contained"
          size="large"
          loading={isLoadingNewRoom}
          onClick={onCreateRoom}
        >
          방 만들기
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default NewRoomDialog
