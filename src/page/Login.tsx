import { ChangeEvent } from 'react'
import {
  Autocomplete, Box, Button, TextField, Typography,
} from '@mui/material'
import { Info, InfoOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useRoomList } from '@/core/query'

interface RoomForm {
  roomName: string
  roomPwd: string
}

function Login () {
  const roomForm = useForm<RoomForm>({ mode: 'all' })
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
  const { roomList, isLoading } = useRoomList(roomName)

  const navigate = useNavigate()
  const onClickEnter = roomForm.handleSubmit(() => {
    console.log('Enter', roomName, roomPwd)
    navigate('/list', { state: { roomName, roomPwd } })
  })

  return (
    <Box className="f-center h-full p-24 bg-yellow-300">
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
          <Autocomplete
            className="w-full"
            freeSolo
            options={roomList.map(_ => _.name)}
            loading={isLoading}
            renderInput={params => (
              <TextField
                error={Boolean(errors.roomName)}
                required
                label="Room Name"
                variant="standard"
                {...params}
                inputProps={{
                  ...params.inputProps,
                  maxLength: 24,
                }}
                {...roomForm.register('roomName', {
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
                  onChange: onChange('roomName'),
                  value: roomName,
                  // onBlur: onBlur('roomName'), // FIXME: 의도대로 동작하지 않음.
                })}
                helperText={(
                  <Box
                    component="span"
                    visibility={errors.roomName ? 'visible' : 'hidden'}
                  >
                    <InfoOutlined className="!text-xs" />
                    <span className="!text-xs">
                      {errors.roomName?.message}
                    </span>
                  </Box>
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
        <Button
          variant="contained"
          size="large"
          disableElevation
          className="w-full !mt-8 !rounded-none"
          onClick={onClickEnter}
        >
          Enter My Yellow Room!
        </Button>
      </Box>
    </Box>
  )
}

export default Login
