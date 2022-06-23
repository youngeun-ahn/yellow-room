import { ChangeEvent } from 'react'
import {
  Autocomplete, Box, TextField, Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Info, InfoOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useNewRoom, useFindRoom } from '@core/query'
import useLocalStorage from 'use-local-storage'

interface RoomForm {
  roomName: string
  roomPwd: string
}

function Login () {
  /* Room List Autocomplete */
  const [roomList] = useLocalStorage('myRoomList', [])

  /* Forms */
  const roomForm = useForm<RoomForm>({
    mode: 'all',
    defaultValues: {
      roomName: '',
      roomPwd: '',
    },
  })
  const onChange = (field: keyof RoomForm) => (e: ChangeEvent<HTMLInputElement>) => {
    const trimmed = e.target.value.trimStart()
    roomForm.setValue(field, trimmed)
  }
  const onBlur = (field: keyof RoomForm) => () => {
    const trimmed = roomForm.getValues()[field].trim()
    roomForm.setValue(field, trimmed)
  }
  const { roomName, roomPwd } = roomForm.getValues()
  const { errors, dirtyFields } = roomForm.formState

  /* Login */
  const navigate = useNavigate()
  const { room } = useFindRoom(roomName.trim(), roomPwd.trim())
  const {
    createNewRoom,
    roomId: newRoomId,
    isLoading: isLoadingNewRoom,
  } = useNewRoom()
  const onClickEnter = roomForm.handleSubmit(() => {
    // 없는 방이면 firebase 문서 생성하고 redirect
    if (!room) {
      createNewRoom(roomName.trim(), roomPwd.trim())
      navigate(`/room/${newRoomId}`, { replace: true })
      return
    }
    // 있는 방이면 바로 redirect
    navigate(`/room/${room.id}`, { replace: true })
  })

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
            control={roomForm.control}
            rules={{
              required: {
                value: true,
                message: '방 이름은 2글자 이상이어야 합니다.',
              },
              minLength: {
                value: 2,
                message: '방 이름은 2글자 이상이어야 합니다.',
              },
              maxLength: {
                value: 24,
                message: '방 이름은 24글자 이하여야 합니다.',
              },
            }}
            render={({ field, fieldState }) => (
              <Autocomplete
                className="w-full"
                freeSolo
                autoSelect
                options={roomList}
                onChange={(_, nextRoomName) => field.onChange(nextRoomName ?? '')}
                renderInput={params => (
                  <TextField
                    error={Boolean(fieldState.error)}
                    required
                    label="Room Name"
                    variant="standard"
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      maxLength: 24,
                    }}
                    helperText={(
                      <Box
                        component="span"
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
              />
            )}
          />
          <Box className="f-col-4">
            <TextField
              error={Boolean(errors.roomPwd)}
              label="Private Room Key (* Optional)"
              className="w-full"
              variant="standard"
              type="password"
              inputProps={{ maxLength: 16 }}
              {...roomForm.register('roomPwd', {
                required: false,
                minLength: {
                  value: 8,
                  message: 'Room Key는 8글자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 16,
                  message: 'Room Key는 16글자 이하여야 합니다.',
                },
                onChange: onChange('roomPwd'),
                onBlur: onBlur('roomPwd'),
              })}
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
                  <Box component="span" className="f-row-start-4 !flex-nowrap">
                    <Info className="!text-xs" />
                    <span className="!text-xs">
                      한번 등록하면 변경할 수 없습니다 (까먹지 마세요!).
                    </span>
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Box>
        <LoadingButton
          loading={isLoadingNewRoom}
          variant="contained"
          size="large"
          disableElevation
          className="w-full !mt-8 !rounded-none"
          onClick={onClickEnter}
        >
          Enter My Yellow Room!
        </LoadingButton>
      </Box>
    </>
  )
}

export default Login
