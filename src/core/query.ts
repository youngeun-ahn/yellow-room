import { collection, query, doc, where } from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
  useFirestoreDocumentData,
} from '@react-query-firebase/firestore'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import sha1 from 'sha1'
import firestore, { getDefaultConverter } from './firestore'
import { isKeywordIncludes } from './util'

declare interface Song {
  name: string
}

declare interface Room {
  id: string
  name: string
  pwd: string
}

const ROOT = 'Room'
const roomConverter = getDefaultConverter<Room>()

const hash = (str: string) => {
  if (!str?.trim()) return ''
  return sha1(str)
}

export const useRoomList = (roomName = '') => {
  const rootRef = collection(firestore, ROOT).withConverter(roomConverter)
  const ref = query(rootRef)
  const {
    data = [],
    ...result
  } = useFirestoreQueryData([ROOT], ref)
  const roomList = data.filter(_ => isKeywordIncludes(_.name, roomName))

  return { roomList, ...result }
}

export const useNewRoom = () => {
  const roomId = useMemo(() => nanoid(5), [])
  const docRef = doc(firestore, ROOT, roomId)
  const { mutate, ...mutation } = useFirestoreDocumentMutation(docRef)
  return {
    ...mutation,
    roomId,
    create: (roomName: string, roomPwd: string) => mutate({
      id: roomId,
      name: roomName,
      pwd: hash(roomPwd),
      items: [],
    }),
  }
}

export const useFindRoom = (roomName = '', roomPwd = '') => {
  const rootRef = collection(firestore, ROOT).withConverter(roomConverter)
  const ref = query(
    rootRef,
    where('name', '==', roomName),
    where('pwd', '==', hash(roomPwd)),
  )

  const {
    data: roomList = [],
    ...result
  } = useFirestoreQueryData([ROOT, roomName, roomPwd], ref)

  return {
    room: roomList[0],
    ...result,
  }
}

export const useRoom = (roomId: string) => {
  const docRef = doc(firestore, ROOT, roomId).withConverter(getDefaultConverter<Room>())
  const {
    data: room,
    ...result
  } = useFirestoreDocumentData([ROOT, roomId], docRef)
  return { room, ...result }
}
