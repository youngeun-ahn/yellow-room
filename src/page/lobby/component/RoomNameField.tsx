import { Controller } from 'react-hook-form'
import { Autocomplete, Box, IconButton, MenuItem, TextField } from '@mui/material'
import { Close, Info } from '@mui/icons-material'
import { useLocalStorage } from 'usehooks-ts'
import { RoomFormProps } from '..'

function RoomNameField ({ form }: RoomFormProps) {
  /* Room List Autocomplete */
  const [myRoomList, setMyRoomList] = useLocalStorage<string[]>('myRoomList', [])

  return (
    <Controller
      name="roomName"
      control={form.control}
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
                  <Info className="!text-xs" />
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
  )
}

export default RoomNameField
