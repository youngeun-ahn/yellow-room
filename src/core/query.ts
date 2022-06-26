import { collection, query, doc, where, orderBy } from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
  useFirestoreDocumentData,
  useFirestoreDocumentDeletion,
} from '@react-query-firebase/firestore'
import { nanoid } from 'nanoid'
import { useDeepCompareCallback } from 'use-deep-compare'
import { groupBy } from 'lodash'
import { useNavigate } from 'react-router-dom'
import firestore, { getDefaultConverter } from './firestore'
import { hash, isKeywordIncludes } from './util'

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

/** Room 생성 */
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

/** Room 체크인 */
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

/** Room 상세 정보 */
export const useRoom = (roomId: string) => {
  const roomDocRef = getRoomDocRef(roomId)
  const {
    data: room,
    ...result
  } = useFirestoreDocumentData([ROOT, roomId], roomDocRef)
  return { room, ...result }
}

/** Room 삭제 */
export const useDeleteRoom = (roomId: string) => {
  const navigate = useNavigate()

  const roomDocRef = getRoomDocRef(roomId)
  const { mutate, ...result } = useFirestoreDocumentDeletion(roomDocRef, {
    onSuccess () {
      navigate('/', { replace: true, state: { logout: true } })
    },
  })

  return {
    ...result,
    deleteRoom: (options?: Parameters<typeof mutate>[1]) => {
      mutate(undefined, options)
    },
  }
}

/** Song 목록 조회 */
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
      ].some(lazyExp => lazyExp())
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

/** Song 편집(및 신규 등록) */
export const useEditSong = (roomId: string, songId?: string) => {
  const songDocId = songId ?? nanoid(5)
  const songDocRef = getSongDocRef(roomId, songDocId)
  const { mutate, ...result } = useFirestoreDocumentMutation(songDocRef, { merge: true })

  return {
    ...result,
    songDocId,
    editSong: (songForm: Song, options?: Parameters<typeof mutate>[1]) => {
      mutate({ ...songForm, id: songDocId }, options)
    },
  }
}

const EMPTY_SONG_ID = 'EMPTY_SONG_ID'
/** Song 삭제 */
export const useDeleteSong = (roomId: string, songId = EMPTY_SONG_ID) => {
  // NOTE: 신규 생성시에도 hook 규칙 때문에 호출되어야 해서 songId가 없을 수 있는데
  // 이 경우, firestore 문서를 가져올때 문제가 발생하여 더미 문서 ID로 처리.
  const songDocRef = getSongDocRef(roomId, songId)
  const {
    refetch: refetchSongList,
  } = useSongList(roomId)
  const { mutate, ...result } = useFirestoreDocumentDeletion(songDocRef, {
    onSuccess () {
      refetchSongList()
    },
  })

  return {
    ...result,
    deleteSong: (options?: Parameters<typeof mutate>[1]) => {
      if (!songId || songId === EMPTY_SONG_ID) return
      mutate(undefined, options)
    },
  }
}
