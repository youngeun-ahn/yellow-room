import { collection, query, doc, where, orderBy } from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
  useFirestoreDocumentData,
} from '@react-query-firebase/firestore'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import sha1 from 'sha1'
import { useDeepCompareCallback } from 'use-deep-compare'
import { groupBy } from 'lodash'
import firestore, { getDefaultConverter } from './firestore'
import { isKeywordIncludes } from './util'

export interface Room {
  id: string
  name: string
  pwd: string
}

const ROOT = 'Room'
const SONG_LIST = 'Song'
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
  const {
    mutate,
    ...result
  } = useFirestoreDocumentMutation(docRef)

  return {
    ...result,
    roomId,
    createNewRoom: (roomName: string, roomPwd: string) => mutate({
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
  } = useFirestoreDocumentData([ROOT, roomId], docRef, {

  })
  return { room, ...result }
}

export const useSongList = (roomId: string) => {
  const songListRef = collection(firestore, ROOT, roomId, SONG_LIST)
    .withConverter(getDefaultConverter<Song>())
  const ref = query(
    songListRef,
    orderBy('origin'),
    orderBy('title'),
    orderBy('rating'),
  )

  const {
    data: songList = [],
    ...result
  } = useFirestoreQueryData(
    [ROOT, roomId, SONG_LIST],
    ref,
    { subscribe: true },
    { enabled: Boolean(roomId) },
  )

  const filter = useDeepCompareCallback((keyword = '') => {
    if (!keyword) return songList
    return songList.filter(song => {
      const isTitleMatched = isKeywordIncludes(song.title, keyword)
      const isSingerMatched = isKeywordIncludes(song.singer, keyword)
      const isOriginMatched = isKeywordIncludes(song.origin, keyword)
      const isTagMatched = song.tagList.some(tag => isKeywordIncludes(tag, keyword))
      return isTitleMatched || isSingerMatched || isOriginMatched || isTagMatched
    })
  }, [songList])

  const groupByOrigin = useDeepCompareCallback((keyword?: string) => (
    groupBy(filter(keyword), 'origin')
  ), [songList])

  return {
    filter,
    groupBy: groupByOrigin,
    songList,
    ...result,
  }
}
