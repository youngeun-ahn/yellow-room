import { useDeleteSong, useEditSong } from '@core/query'
import { Drawer, DialogContent } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import Header from './Header'
import { useSongDetailContext } from './context'
import SongForm from './SongForm'

/* Song Detail Drawer */
interface Props {
  onClose: () => void
}
function SongDetail ({ onClose }: Props) {
  const { open, song, closeSongDetail } = useSongDetailContext()

  const songForm = useForm<Song>({
    mode: 'all',
    reValidateMode: 'onChange',
  })

  useDeepCompareEffect(() => {
    if (!open) return
    songForm.reset({
      // number: 0, // NOTE: 생성시 number 필드는 일단 빈 필드로 둬야함.
      key: 0,
      tempo: 0,
      gender: 'NONE',
      title: '',
      singer: '',
      origin: '',
      rating: 0,
      isBlacklist: false,
      tagList: [],
      memo: '',
      lyric: '',
      youtube: '',
      ...song,
    })
  }, [open, song])

  const { handleSubmit, reset } = songForm

  const { id: roomId = '' } = useParams()
  const { editSong } = useEditSong(roomId, song?.id)
  const onSave = handleSubmit(form => {
    const {
      title, singer, origin,
      number, key, tempo,
      ...restForm
    } = form

    editSong({
      title: title.trim(),
      singer: singer.trim(),
      origin: origin.trim(),
      number: Number.parseInt(String(number), 10),
      key: Number.parseInt(String(key), 10),
      tempo: Number.parseInt(String(tempo), 10),
      ...restForm,
    }, {
      onSuccess: closeSongDetail,
    })
  })

  const { deleteSong } = useDeleteSong(roomId, song?.id)
  const onDelete = () => deleteSong({ onSuccess: closeSongDetail })

  return (
    <>
      <Header
        onSave={onSave}
        onReset={() => reset(song)}
        onDelete={onDelete}
      />
      <Drawer
        open={open}
        closeAfterTransition
        onTransitionEnd={() => {
          if (open) return
          onClose()
        }}
        anchor="bottom"
      >
        <DialogContent className="h-screen !pt-[4.8rem] sm:!pt-[6.4rem] bg-yellow-50">
          <SongForm songForm={songForm} />
        </DialogContent>
      </Drawer>
    </>
  )
}

/* NOTE: Drawer가 닫혀있을 때는 unmount하여 useForm 초기화 및 렌더링 최적화 */
function SongDetailDrawer () {
  const { open, closeSongDetail } = useSongDetailContext()
  const [isMounted, setIsMounted] = useState(false)

  /* Mobile back 버튼 핸들링을 위해 location state로 제어 */
  const { state } = useLocation()
  const locState = state as { drawer?: 'detail' }
  const isOpenLocState = locState?.drawer === 'detail'
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!open) {
      if (isOpenLocState) {
        navigate('', { replace: true })
      }
      return
    }
    setIsMounted(true)
    navigate('', { state: { drawer: 'detail' } })
  }, [open])

  useLayoutEffect(() => {
    if (isOpenLocState) return
    closeSongDetail()
  }, [isOpenLocState])

  if (!open && !isMounted) {
    return <></>
  }

  return <SongDetail onClose={() => setIsMounted(false)} />
}

export default SongDetailDrawer
