import {
  collection, query, doc, where, orderBy, QueryConstraint,
} from 'firebase/firestore'
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
  useFirestoreDocumentData,
  useFirestoreDocumentDeletion,
  useFirestoreTransaction,
} from '@react-query-firebase/firestore'
import { nanoid } from 'nanoid'
import { useDeepCompareMemo } from 'use-deep-compare'
import { groupBy } from 'lodash-es'
import { useMemo } from 'react'

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

/** Song 목록 조회 */
export const useSongList = (roomId: string) => {
  const songCollectionRef = getSongCollectionRef(roomId)
  const { setting } = useSettingSlice()
  const {
    hideBlacklist,
    orderBy: optionOrderBy,
    groupBy: optionGroupBy,
  } = setting

  let groupField = ''
  if (optionOrderBy !== 'RANDOM') {
    switch (optionGroupBy) {
      case 'NONE':
        break
      case 'GROUP':
        groupField = 'group'
        break
      case 'SINGER':
        groupField = 'singer'
        break
      default:
    }
  }

  const queryConstraints = useDeepCompareMemo(() => {
    const constraints: QueryConstraint[] = []
    if (hideBlacklist) {
      constraints.push(where('isBlacklist', '==', false))
    }
    if (groupField) {
      constraints.push(orderBy(groupField))
    }
    if (optionOrderBy === 'TITLE') {
      constraints.push(orderBy('title', 'asc'))
    } else if (optionOrderBy === 'RATING') {
      constraints.push(orderBy('rating', 'desc'))
    }
    return constraints
  }, [optionOrderBy, hideBlacklist, groupField])

  const ref = query(
    songCollectionRef,
    ...queryConstraints,
  )

  const {
    data: songList = [],
    dataUpdatedAt,
    ...result
  } = useFirestoreQueryData(
    [ROOT, roomId, SONG_LIST, optionGroupBy, optionOrderBy, hideBlacklist],
    ref,
    { subscribe: false },
    { enabled: Boolean(roomId) },
  )

  return useMemo(() => {
    const search = (keyword = '') => {
      if (!keyword) return songList
      return songList.filter(song => (
        [
          () => isKeywordIncludes(song.title, keyword),
          () => isKeywordIncludes(song.singer, keyword),
          () => isKeywordIncludes(song.group, keyword),
          () => isKeywordIncludes(song.number.toString(), keyword),
          () => song.tagList.some(tag => isKeywordIncludes(`#${tag}`, keyword)),
        ].some(lazyExp => lazyExp())
      ))
    }

    return {
      search,
      groupByWithFilter (keyword?: string) {
        return groupBy(search(keyword), groupField)
      },
      songList,
      dataUpdatedAt,
      ...result,
    }
  }, [dataUpdatedAt, groupField])
}

/** Song 편집(및 신규 등록) */
export const useEditSong = (roomId: string, songId?: string) => {
  const songDocId = songId ?? nanoid(5)
  const songDocRef = getSongDocRef(roomId, songDocId)

  const {
    refetch: refetchSongList,
  } = useSongList(roomId)
  const { mutate, ...result } = useFirestoreDocumentMutation(songDocRef, { merge: true }, {
    onSuccess () {
      refetchSongList()
    },
  })

  return {
    ...result,
    songDocId,
    editSong (songForm: Song, options?: Parameters<typeof mutate>[1]) {
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
    deleteSong (options?: Parameters<typeof mutate>[1]) {
      if (!songId || songId === EMPTY_SONG_ID) return
      mutate(undefined, options)
    },
  }
}

/** Room 삭제 */
export const useDeleteRoom = (roomId: string = EMPTY_ROOM_ID) => {
  const roomDocRef = getRoomDocRef(roomId)
  const { songList } = useSongList(roomId)

  const {
    mutate: deleteRoom,
    ...result
  } = useFirestoreTransaction(firestore, async tsx => {
    songList.forEach(song => {
      const songRef = getSongDocRef(roomId, song.id)
      tsx.delete(songRef)
    })
    tsx.delete(roomDocRef)
  })

  return {
    ...result,
    deleteRoom (options?: Parameters<typeof deleteRoom>[1]) {
      deleteRoom(undefined, options)
    },
  }
}
