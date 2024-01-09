import { UseFormReturn } from 'react-hook-form'

export interface RoomForm {
  roomName: string
  roomPwd: string
}

export interface RoomFormProps {
  form: UseFormReturn<RoomForm>
}
