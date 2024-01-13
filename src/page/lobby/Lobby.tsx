import { Box } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCreateRoom, useFindRoom, useRoom } from '@core/query'
import useLocalStorage from 'use-local-storage'
import { useEffect, useState } from 'react'
import { logEnterRoom } from '@core/analytics'
import { RoomForm } from '.'
import RoomPasswordField from './component/RoomPasswordField'
import RoomNameField from './component/RoomNameField'
import NewRoomDialog from './component/NewRoomDialog'
import LobbyTitle from './component/LobbyTitle'

function Lobby () {
  /* Forms */
  const form = useForm<RoomForm>({
    mode: 'all',
    defaultValues: {
      roomName: '',
      roomPwd: '',
    },
  })
  const { watch, handleSubmit } = form

  /* New Room Dialog */
  const [isNewRoomConfirmOpened, setNewRoomConfirmOpened] = useState(false)

  /* Login */
  const navigate = useNavigate()
  const {
    room,
    isFetching: isLoadingFindRoom,
  } = useFindRoom(
    watch('roomName').trim(),
    watch('roomPwd'),
  )

  const {
    isLoading: isLoadingNewRoom,
  } = useCreateRoom()

  // NOTE: Form 업데이트 후 요청 직전 렌더링 사이클에 onClickEnter가 호출되는 경우
  // Room fetch가 되지 않은 상태에서 호출되는 문제가 있어서 Rerender 시킨 뒤 effect에서 처리
  const [needRerender, setNeedRerender] = useState(false)
  const onClickEnter = handleSubmit(({ roomPwd }) => {
    if (isLoadingFindRoom) {
      setNeedRerender(true)
      return
    }

    const isPrivate = Boolean(roomPwd)
    logEnterRoom(isPrivate)

    // 없는 방이면 새 방 생성 Dialog 열기
    if (!room) {
      setNewRoomConfirmOpened(true)
      return
    }

    // 있는 방이면 바로 redirect
    navigate(`/room/${room.id}`, { replace: true })
  })

  useEffect(() => {
    if (!needRerender) return
    if (isLoadingFindRoom) return

    setNeedRerender(false)
    onClickEnter()
  }, [needRerender, isLoadingFindRoom])

  /* Auto Login to last entered room */
  const [lastEnteredRoom, setLastEnteredRoom] = useLocalStorage('lastEnteredRoom', '')
  const {
    room: lastRoom,
    isLoading: isLoadingLastEnteredRoom,
  } = useRoom(lastEnteredRoom)

  const { state } = useLocation()
  const locState: { exit: boolean } = state
  const isExited = locState?.exit ?? false

  useEffect(() => {
    if (!isExited) return
    setLastEnteredRoom(undefined)
  }, [isExited])

  if (lastEnteredRoom && isLoadingLastEnteredRoom) {
    return <></>
  }

  if (!isExited && lastRoom) {
    logEnterRoom(Boolean(lastRoom.pwd))

    return (
      <Navigate to={`/room/${lastEnteredRoom}`} replace />
    )
  }

  return (
    <Box className="f-col-12 w-full max-w-md px-16 py-24">
      <LobbyTitle />
      <Box className="f-col-4">
        <RoomNameField form={form} />
        <RoomPasswordField form={form} onEnter={onClickEnter} />
      </Box>
      <LoadingButton
        fullWidth
        loading={isLoadingNewRoom}
        variant="contained"
        size="large"
        className="mt-8 !rounded-none"
        onClick={onClickEnter}
      >
        노란 방 입장
      </LoadingButton>
      <NewRoomDialog
        form={form}
        open={isNewRoomConfirmOpened}
        onClose={() => setNewRoomConfirmOpened(false)}
      />
    </Box>
  )
}

export default Lobby
