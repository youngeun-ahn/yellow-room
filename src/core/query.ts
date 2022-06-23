import { collection, query, doc, where, orderBy } from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
  useFirestoreDocumentData,
} from '@react-query-firebase/firestore'
import { nanoid } from 'nanoid'
import { useDeepCompareCallback } from 'use-deep-compare'
import { groupBy } from 'lodash'
import firestore, { getDefaultConverter } from './firestore'
import { hash, isKeywordIncludes } from './util'

export interface Room {
  id: string
  name: string
  pwd: string
}

const ROOT = 'Room'
const SONG_LIST = 'Song'
const roomConverter = getDefaultConverter<Room>()
const songConverter = getDefaultConverter<Song>()

const getRoomCollectionRef = () => (
  collection(firestore, ROOT).withConverter(roomConverter)
)
const getRoomDocRef = (roomId: string) => (
  doc(firestore, ROOT, roomId).withConverter(roomConverter)
)
const getSongCollectionRef = (roomId: string) => (
  collection(firestore, ROOT, roomId, SONG_LIST).withConverter(songConverter)
)
const getSongDocRef = (roomId: string, songId: string) => (
  doc(firestore, ROOT, roomId, SONG_LIST, songId).withConverter(songConverter)
)

export const useCreateRoom = () => {
  const roomId = nanoid(5)
  const roomDocRef = getRoomDocRef(roomId)

  const { mutate, ...result } = useFirestoreDocumentMutation(roomDocRef)

  return {
    ...result,
    roomId,
    createRoom (roomName: string, roomPwd: string) {
      mutate({
        id: roomId,
        name: roomName,
        pwd: hash(roomPwd),
      })
    },
  }
}

export const useFindRoom = (roomName = '', roomPwd = '') => {
  const roomCollectionRef = getRoomCollectionRef()
  const roomCollectionQuery = query(
    roomCollectionRef,
    where('name', '==', roomName),
    where('pwd', '==', hash(roomPwd)),
  )

  const {
    data: roomList = [],
    ...result
  } = useFirestoreQueryData([ROOT, roomName, roomPwd], roomCollectionQuery)

  return {
    room: roomList[0],
    ...result,
  }
}

export const useRoom = (roomId: string) => {
  const roomDocRef = getRoomDocRef(roomId)
  const {
    data: room,
    ...result
  } = useFirestoreDocumentData([ROOT, roomId], roomDocRef)
  return { room, ...result }
}

export const useSongList = (roomId: string) => {
  const songCollectionRef = getSongCollectionRef(roomId)
  const ref = query(
    songCollectionRef,
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

  const search = useDeepCompareCallback((keyword = '') => {
    if (!keyword) return songList
    return songList.filter(song => (
      [
        () => isKeywordIncludes(song.title, keyword),
        () => isKeywordIncludes(song.singer, keyword),
        () => isKeywordIncludes(song.origin, keyword),
        () => isKeywordIncludes(song.number.toString(), keyword),
        () => song.tagList.some(tag => isKeywordIncludes(tag, keyword)),
      ].some(_ => _()) // lazy & shortcut
    ))
  }, [songList])

  const groupByOrigin = useDeepCompareCallback((keyword?: string) => (
    groupBy(search(keyword), 'origin')
  ), [songList])

  return {
    search,
    groupBy: groupByOrigin,
    songList,
    ...result,
  }
}

export const useEditSong = (roomId: string, songId?: string) => {
  const songDocId = songId ?? nanoid(5)
  const songDocRef = getSongDocRef(roomId, songDocId)

  const { mutate, ...result } = useFirestoreDocumentMutation(songDocRef)

  return {
    ...result,
    songId,
    editSong: (songForm: Song, options?: Parameters<typeof mutate>[1]) => {
      mutate({ ...songForm, id: songDocId }, options)
    },
  }
}
