import {
  Autocomplete, Box, IconButton, MenuItem, TextField, Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Close, Info, InfoOutlined } from '@mui/icons-material'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useCreateRoom, useFindRoom, useRoom } from '@core/query'
import useLocalStorage from 'use-local-storage'
import { useEffect } from 'react'

interface RoomForm {
  roomName: string
  roomPwd: string
}

function Lobby () {
  /* Room List Autocomplete */
  const [myRoomList, setMyRoomList] = useLocalStorage<string[]>('myRoomList', [])

  /* Forms */
  const {
    control,
    watch,
    formState,
    register,
    handleSubmit,
  } = useForm<RoomForm>({
    mode: 'all',
    defaultValues: {
      roomName: '',
      roomPwd: '',
    },
  })
  const { roomName, roomPwd } = watch()
  const { errors, dirtyFields } = formState

  /* Login */
  const navigate = useNavigate()
  const { room } = useFindRoom(roomName.trim(), roomPwd)

  const {
    createRoom,
    roomId: newRoomId,
    isLoading: isLoadingNewRoom,
  } = useCreateRoom()

  const onClickEnter = handleSubmit(() => {
    // 없는 방이면 firebase 문서 생성하고 redirect
    if (!room) {
      createRoom(roomName.trim(), roomPwd)
      navigate(`/room/${newRoomId}`, { replace: true })
      return
    }
    // 있는 방이면 바로 redirect
    navigate(`/room/${room.id}`, { replace: true })
  })

  /* Auto Login to last entered room */
  const [lastEnteredRoom, setLastEnteredRoom] = useLocalStorage('lastEnteredRoom', '')
  const { room: lastRoom, isLoading } = useRoom(lastEnteredRoom)
  const { state } = useLocation()
  const locState = state as { exit: boolean }
  const isExited = locState?.exit ?? false

  useEffect(() => {
    if (!isExited) return
    setLastEnteredRoom(undefined)
  }, [isExited])

  if (lastEnteredRoom && isLoading) {
    return <></>
  }
  if (!isExited && lastRoom) {
    return (
      <Navigate to={`/room/${lastEnteredRoom}`} replace />
    )
  }

  return (
    <>
      <Box className="f-col-12 w-full max-w-md px-16 py-24">
        <Box>
          <Typography fontFamily="Roboto" fontSize="2.8rem" lineHeight={1.5}>
            Yellow
          </Typography>
          <Typography fontFamily="Roboto" fontSize="4.8rem" lineHeight={1}>
            Room
          </Typography>
        </Box>
        <Box className="f-col-4">
          <Controller
            name="roomName"
            control={control}
            rules={{
              required: '방 이름을 입력해주세요.',
              minLength: {
                value: 2,
                message: '방 이름은 2글자 이상이어야 합니다.',
              },
            }}
            render={({ field, fieldState }) => (
              <Autocomplete
                fullWidth
                freeSolo
                autoSelect
                options={myRoomList}
                onChange={(_, nextRoomName) => field.onChange(nextRoomName ?? '')}
                renderInput={params => (
                  <TextField
                    error={Boolean(fieldState.error)}
                    required
                    label="방 이름"
                    variant="standard"
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      maxLength: 24,
                    }}
                    helperText={(
                      <Box
                        component="span"
                        className="!f-row-2"
                        visibility={fieldState.error ? 'visible' : 'hidden'}
                      >
                        <InfoOutlined className="!text-xs" />
                        <span className="!text-xs">
                          {fieldState.error?.message}
                        </span>
                      </Box>
                    )}
                  />
                )}
                renderOption={(params, option) => (
                  <MenuItem
                    {...params}
                    className="!f-row"
                  >
                    <Box>{option}</Box>
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation()
                        setMyRoomList(myRoomList.filter(_ => _ !== option))
                      }}
                    >
                      <Close
                        fontSize="small"
                        className="opacity-30 hover:opacity-100"
                      />
                    </IconButton>
                  </MenuItem>
                )}
              />
            )}
          />
          <Box className="f-col-4">
            <TextField
              fullWidth
              label="방 열쇠 (선택사항)"
              variant="standard"
              type="password"
              inputProps={{ maxLength: 24 }}
              {...register('roomPwd', {
                required: false,
                minLength: {
                  value: 8,
                  message: '방 열쇠는 8글자 이상이어야 합니다.',
                },
              })}
              onKeyDown={e => {
                if (e.key !== 'Enter') return
                onClickEnter()
              }}
              error={Boolean(errors.roomPwd)}
              helperText={(
                <Box
                  component="span"
                  className="f-col-2 h-[4rem]"
                  visibility={dirtyFields.roomPwd ? 'visible' : 'hidden'}
                >
                  {errors.roomPwd && (
                    <Box
                      component="span"
                      className="f-row-start-4 !flex-nowrap"
                    >
                      <Info className="!text-xs" />
                      <span className="!text-xs">
                        {errors.roomPwd?.message}
                      </span>
                    </Box>
                  )}
                  <Box component="span" className="f-row-start-4 !flex-nowrap">
                    <InfoOutlined className="!text-xs" />
                    <span className="!text-xs">
                      동일한 이름의 다른 방을 구분하기 위한 용도입니다.
                    </span>
                  </Box>
                  <Box component="span" className="f-row-start-4 !items-start !flex-nowrap">
                    <Info className="!text-xs mt-2" />
                    <span className="!text-xs">
                      한번 등록하면 변경할 수 없지만 생성된 방 링크만으로도 입장할 수 있습니다.
                    </span>
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Box>
        <LoadingButton
          fullWidth
          loading={isLoadingNewRoom}
          variant="contained"
          size="large"
          className="!mt-8 !rounded-none"
          onClick={onClickEnter}
        >
          노란 방 입장
        </LoadingButton>
      </Box>
    </>
  )
}

export default Lobby
