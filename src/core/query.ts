import { collection, query, doc, where, orderBy, QueryConstraint } from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
  useFirestoreDocumentData,
  useFirestoreDocumentDeletion,
} from '@react-query-firebase/firestore'
import { nanoid } from 'nanoid'
import { useDeepCompareCallback } from 'use-deep-compare'
import { groupBy, shuffle } from 'lodash'
import { useNavigate } from 'react-router-dom'
import firestore, { getDefaultConverter } from './firestore'
import { hash, isKeywordIncludes } from './util'
import { useSettingSlice } from './store/settingSlice'

const ROOT = 'Room'
const SONG_LIST = 'Song'
const roomConverter = getDefaultConverter<Room>()
const songConverter = getDefaultConverter<Song>()

const EMPTY_ROOM_ID = 'EMPTY_ROOM_ID'
const EMPTY_SONG_ID = 'EMPTY_SONG_ID'
const getRoomCollectionRef = () => (
  collection(firestore, ROOT).withConverter(roomConverter)
)
const getRoomDocRef = (roomId: string) => (
  doc(firestore, ROOT, roomId || EMPTY_ROOM_ID).withConverter(roomConverter)
)
const getSongCollectionRef = (roomId: string) => (
  collection(firestore, ROOT, roomId || EMPTY_ROOM_ID, SONG_LIST).withConverter(songConverter)
)
const getSongDocRef = (roomId: string, songId: string) => (
  doc(firestore, ROOT, roomId || EMPTY_ROOM_ID, SONG_LIST, songId || EMPTY_SONG_ID)
    .withConverter(songConverter)
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
export const useDeleteRoom = (roomId: string = EMPTY_ROOM_ID) => {
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
  const { setting } = useSettingSlice()

  const constraints: QueryConstraint[] = []
  if (setting.hideBlacklist) {
    constraints.push(where('isBlacklist', '==', false))
  }

  let groupField = ''
  if (setting.orderBy !== 'RANDOM') {
    switch (setting.groupBy) {
      case 'NONE':
        break
      case 'ORIGIN':
        groupField = 'origin'
        break
      case 'SINGER':
        groupField = 'singer'
        break
      default:
    }

    if (groupField) {
      constraints.push(orderBy(groupField))
    }

    if (setting.orderBy === 'TITLE') {
      constraints.push(orderBy('title', 'asc'))
    } else if (setting.orderBy === 'RATING') {
      constraints.push(orderBy('rating', 'desc'))
    }
  }

  const ref = query(
    songCollectionRef,
    ...constraints,
  )

  const {
    data: songList = [],
    ...result
  } = useFirestoreQueryData(
    [ROOT, roomId, SONG_LIST, setting],
    ref,
    { subscribe: true },
    { enabled: Boolean(roomId) },
  )

  const isShuffle = setting.orderBy === 'RANDOM'
  const search = useDeepCompareCallback((keyword = '') => {
    if (!keyword) return songList
    const filtered = songList.filter(song => (
      [
        () => isKeywordIncludes(song.title, keyword),
        () => isKeywordIncludes(song.singer, keyword),
        () => isKeywordIncludes(song.origin, keyword),
        () => isKeywordIncludes(song.number.toString(), keyword),
        () => song.tagList.some(tag => isKeywordIncludes(tag, keyword)),
      ].some(lazyExp => lazyExp())
    ))

    /* OrderBy가 Random이면 Shuffle */
    return isShuffle ? shuffle(filtered) : filtered
  }, [songList, isShuffle])

  const groupByField = useDeepCompareCallback((keyword?: string) => (
    groupBy(search(keyword), groupField)
  ), [songList, groupField])

  return {
    search,
    groupBy: groupByField,
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
