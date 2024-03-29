import { useRoom, useSongList } from '@core/query'
import { Add, Search } from '@mui/icons-material'
import { Box, Fab, Skeleton, TextField } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SongGroup from '@component/SongGroup'
import RoomHeader from '@component/RoomHeader'
import SongDetailProvider, { useSongDetailContext } from '@component/SongDetail/context'
import SongDetailDrawer from '@component/SongDetail/SongDetail'
import useLocalStorage from 'use-local-storage'
import { uniqSort } from '@core/util'
import { debounce } from 'lodash-es'
import classNames from 'classnames'

function Room () {
  const { id: roomId = '' } = useParams()
  const { room, isSuccess: isRoomFetched } = useRoom(roomId)
  const [keyword, setKeyword] = useState('')
  const { openSongDetail } = useSongDetailContext()
  const navigate = useNavigate()

  const [, setLastEnteredRoom] = useLocalStorage<string>('lastEnteredRoom', '')

  const setKeywordDebounced = debounce(setKeyword, 200)

  /* 없는 방에 입장 */
  useEffect(() => {
    if (!isRoomFetched) return
    if (room) {
      setLastEnteredRoom(room.id)
      return
    }

    navigate('/', { state: { exit: true }, replace: true })
  }, [isRoomFetched, Boolean(room)])

  /* Lobby 에서 방 이름 자동 완성을 위해 입장한 방 이름 목록 기억 */
  const [myRoomList, setMyRoomList] = useLocalStorage<string[]>('myRoomList', [])
  useEffect(() => {
    if (!room?.name?.trim()) return

    const nextRoomList = uniqSort([...myRoomList, room.name])
    setMyRoomList(nextRoomList)
  }, [room?.name])

  const {
    search,
    groupByWithFilter,
    isLoading,
    isSuccess,
    isError,
    dataUpdatedAt,
    songList,
  } = useSongList(roomId)

  const hasSong = useMemo(
    () => isSuccess && search(keyword).length > 0,
    [isSuccess, keyword, songList.length],
  )

  const songGroupEntries = useMemo(
    () => Object.entries(groupByWithFilter(keyword)),
    [dataUpdatedAt, keyword],
  )

  const cntSearched = songGroupEntries.flatMap(_ => _[1]).length
  const scrollBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollBodyRef.current) return undefined

    const onScroll = debounce(() => {
      window.dispatchEvent(new Event('rerender-card'))
    }, 50)

    scrollBodyRef.current.addEventListener('scroll', onScroll)
    return () => scrollBodyRef.current?.removeEventListener('scroll', onScroll)
  }, [scrollBodyRef.current])

  useEffect(() => {
    window.dispatchEvent(new Event('rerender-card'))
  }, [keyword])

  if (!roomId) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <RoomHeader
        roomName={room?.name}
        roomId={room?.id}
      />
      <Fab
        color="primary"
        className="!fixed right-16 bottom-16"
        onClick={() => openSongDetail()}
      >
        <Add fontSize="large" />
      </Fab>
      <Box className="f-col-8 w-full h-full pt-[4.2rem] sm:pt-[5.4rem]">
        {/* Search */}
        <TextField
          label="제목, 가수, 작품명, 태그로 검색"
          inputMode="search"
          fullWidth
          onChange={e => setKeywordDebounced(e.target.value)}
          InputProps={{
            endAdornment: <Search color="action" />,
          }}
        />
        <Box
          className="font-bold text-xs text-right"
        >
          {keyword.trim() ? (
            `전체 ${songList.length}곡 중 ${cntSearched}곡 검색됨`
          ) : (
            `전체 ${songList.length}곡`
          )}
        </Box>
        {/* Song Groups */}
        {isSuccess && hasSong && (
          <Box
            ref={scrollBodyRef}
            className={classNames(
              'f-col-12 flex-1 overflow-auto mb-16 pb-2 -mr-8 pr-8',
              'scrollbar-thumb-yellow-400 hover:scrollbar-thumb-yellow-500',
            )}
          >
            {songGroupEntries.map(([groupName, groupSongList]) => (
              <SongGroup
                key={groupName}
                title={groupName}
                songList={groupSongList}
              />
            ))}
            {/* Bottom Gutter */}
            <Box className="min-h-[4rem]" />
          </Box>
        )}
        {/* No Search Result */}
        {isSuccess && !hasSong && (
          <Box>
            검색된 노래가 없습니다. ㅠㅠ
          </Box>
        )}
        {/* Loading */}
        {isLoading && (
          <Box className="f-row-start-8 sm:!items-stretch sm:min-h-[8rem]">
            {[0, 1, 2].map(_ => (
              <Skeleton key={_} className="w-full sm:w-[24rem] !h-[8rem] !transform-none" />
            ))}
          </Box>
        )}
        {/* Error */}
        {isError && (
          <Box>
            일시적인 오류가 발생했습니다. ㅠㅠ
          </Box>
        )}
      </Box>
    </>
  )
}

function RoomPage () {
  return (
    <SongDetailProvider>
      <Room />
      <SongDetailDrawer />
    </SongDetailProvider>
  )
}

export default RoomPage
