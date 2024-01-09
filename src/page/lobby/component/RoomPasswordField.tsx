import { Info, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, IconButton, SvgIcon, TextField } from '@mui/material'
import { useState } from 'react'
import { RoomFormProps } from '..'

interface Props extends RoomFormProps {
  onEnter: () => void
}

function RoomPasswordField ({ form, onEnter }: Props) {
  const [isKeyVisible, setKeyVisibility] = useState(false)

  const {
    register,
    formState: { errors, dirtyFields },
  } = form

  return (
    <TextField
      fullWidth
      label="방 열쇠 (선택사항)"
      variant="standard"
      type={isKeyVisible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <IconButton
            size="small"
            onClick={() => setKeyVisibility(!isKeyVisible)}
          >
            <SvgIcon component={isKeyVisible ? Visibility : VisibilityOff} fontSize="small" />
          </IconButton>
        ),
        inputProps: {
          maxLength: 24,
        },
      }}
      {...register('roomPwd', {
        required: false,
        minLength: {
          value: 8,
          message: '방 열쇠는 8글자 이상이어야 합니다.',
        },
      })}
      onKeyDown={e => {
        if (e.key !== 'Enter') return
        onEnter()
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
            <Info className="!text-xs" />
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
  )
}

export default RoomPasswordField
