import { collection, query } from 'firebase/firestore'
import { useFirestoreQueryData } from '@react-query-firebase/firestore'
import firestore, { getDefaultConverter } from './firestore'
import { isKeywordIncludes } from './util'

interface Song {
  name: string
}

interface Room {
  id: string
  name: string
  pwd: string
  items: Song[]
}

const ROOT = 'Room'
const roomConverter = getDefaultConverter<Room>()

export const useRoomList = (roomName = '') => {
  const ref = query(
    collection(firestore, ROOT)
      .withConverter(roomConverter),
  )

  const {
    data = [],
    ...result
  } = useFirestoreQueryData([ROOT], ref)
  const roomList = data.filter(_ => isKeywordIncludes(_.name, roomName))

  return { roomList, ...result }
}
