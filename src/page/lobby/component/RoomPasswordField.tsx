import { Info, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, IconButton, SvgIcon, TextField } from '@mui/material'
import { PropsWithChildren, useState } from 'react'
import { RoomFormProps } from '..'

function HelperTextItem ({ children }: PropsWithChildren) {
  return (
    <span className="f-row-start-4 !flex-nowrap !items-start">
      <Info className="!text-xs mt-2" />
      <span className="text-xs">
        {children}
      </span>
    </span>
  )
}

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
      type={isKeyVisible ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <IconButton
            size="small"
            onClick={() => setKeyVisibility(!isKeyVisible)}
          >
            <SvgIcon
              component={isKeyVisible ? Visibility : VisibilityOff}
              fontSize="small"
            />
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
            <HelperTextItem>
              {errors.roomPwd?.message}
            </HelperTextItem>
          )}
          <HelperTextItem>
            동일한 이름의 다른 방을 구분하기 위한 용도입니다.
          </HelperTextItem>
          <HelperTextItem>
            한번 등록하면 변경할 수 없지만 생성된 방 링크만으로도 입장할 수 있습니다.
          </HelperTextItem>
        </Box>
      )}
    />
  )
}

export default RoomPasswordField
