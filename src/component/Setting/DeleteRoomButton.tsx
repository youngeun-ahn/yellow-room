import { useDeleteRoom, useRoom } from '@core/query'
import { hash } from '@core/util'
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField,
} from '@mui/material'
import PopupState from 'material-ui-popup-state'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

function DeleteRoomButton () {
  const { id: roomId = '' } = useParams()
  const { room } = useRoom(roomId)
  const { deleteRoom } = useDeleteRoom(roomId)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { password: '' },
  })

  const onClickDelete = handleSubmit(() => {
    if (!roomId) return
    deleteRoom({
      onSuccess () {
        navigate('/', { replace: true, state: { exit: true } })
      },
    })
  })

  return (
    <PopupState variant="popover">
      {popupState => (
        <>
          <Button
            variant="contained" size="large"
            color="error"
            className="!shadow-sm"
            onClick={popupState.open}
          >
            방 청소하기
          </Button>
          <Dialog open={popupState.isOpen}>
            <DialogTitle>
              방 청소하기
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                이 방을 청소합니다.
              </DialogContentText>
              <DialogContentText>
                방과 노래 목록, 링크가 영구적으로 제거됩니다.
              </DialogContentText>
              <TextField
                type="password"
                className="!mt-8"
                fullWidth
                label="Room Private Key"
                placeholder="방 열쇠 입력(* 없으면 입력하지 마세요)"
                {...register('password', {
                  validate (password) {
                    return room?.pwd !== hash(password)
                      ? '다른 방의 열쇠인 것 같습니다.'
                      : undefined
                  },
                })}
                error={Boolean(errors?.password)}
                helperText={errors?.password?.message}
              />
            </DialogContent>
            <DialogActions className="!p-12 !pt-0">
              <Button size="large" onClick={popupState.close}>
                Cancel
              </Button>
              <Button
                variant="contained" size="large"
                color="error"
                onClick={onClickDelete}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </PopupState>
  )
}

export default DeleteRoomButton
