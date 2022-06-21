import { useRoom, useSongList } from '@core/query'
import { Add, Search } from '@mui/icons-material'
import { Box, Fab, TextField } from '@mui/material'
import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import SongGroup from '@component/SongGroup'
import Header from '@component/Header'
import SongModalProvider, { useSongModalContext } from '@component/SongModal/SongModalProvider'
import SongModal from '@component/SongModal/SongModal'

function Room () {
  const { id: roomId = '' } = useParams()
  const { room } = useRoom(roomId)
  const [keyword, setKeyword] = useState('')

  const { openModal } = useSongModalContext()

  const {
    filter,
    groupBy,
    isSuccess,
    isError,
  } = useSongList(roomId)

  const hasSong = isSuccess && filter(keyword).length > 0

  if (!roomId) {
    return <Navigate to="/" />
  }
  return (
    <>
      <Header title={room?.name} />
      <Fab
        color="primary"
        className="!fixed right-16 bottom-16"
        onClick={() => openModal()}
      >
        <Add fontSize="large" />
      </Fab>
      <Box className="f-col-16 w-full h-full pt-[4.2rem] sm:pt-[5.4rem]">
        <TextField
          value={keyword}
          variant="standard"
          label="Search"
          placeholder="제목, 가수, 원작명, 태그로 검색"
          fullWidth
          onChange={e => setKeyword(e.target.value)}
          InputProps={{
            endAdornment: <Search color="action" />,
          }}
        />
        {isSuccess && (
          hasSong ? (
            <Box>
              {Object.entries(groupBy(keyword)).map(([groupName, songList]) => (
                <SongGroup key={groupName} title={groupName} songList={songList} />
              ))}
            </Box>
          ) : (
            <Box>
              검색된 노래가 없습니다. ㅠㅠ
            </Box>
          )
        )}
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
    <SongModalProvider>
      <Room />
      <SongModal />
    </SongModalProvider>
  )
}

export default RoomPage
