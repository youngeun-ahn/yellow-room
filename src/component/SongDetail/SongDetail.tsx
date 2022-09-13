import { useDeleteSong, useEditSong } from '@core/query'
import { Drawer, DialogContent } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare'
import { logCreateSong, logDeleteSong, logEditSong } from '@core/analytics'
import Header from './Header'
import { useSongDetailContext } from './context'
import SongForm from './SongForm'

/* Song Detail Drawer */
interface Props {
  onClose: () => void
}
function SongDetail ({ onClose }: Props) {
  const { open, song, isNew, closeSongDetail } = useSongDetailContext()

  const songForm = useForm<Song>({
    mode: 'all',
    reValidateMode: 'onChange',
  })

  useDeepCompareEffect(() => {
    if (!open) return
    songForm.reset({
      // number: 0, // NOTE: 생성시 number 필드는 일단 빈 필드로 둬야함.
      key: 0,
      gender: 'NONE',
      title: '',
      singer: '',
      group: '',
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
  const {
    editSong,
    isLoading: isSaving,
  } = useEditSong(roomId, song?.id)
  const {
    deleteSong,
    isLoading: isDeleting,
  } = useDeleteSong(roomId, song?.id)
  const isLoading = isSaving || isDeleting

  const onSave = handleSubmit(form => {
    if (isLoading) return
    const {
      title, singer, group,
      number, key,
      ...restForm
    } = form

    const nextSongForm = {
      title: title.trim(),
      singer: singer.trim(),
      group: group.trim(),
      number: Number.parseInt(String(number), 10),
      key: Number.parseInt(String(key), 10),
      ...restForm,
    }

    editSong(nextSongForm, { onSuccess: closeSongDetail })

    if (isNew) {
      logCreateSong(nextSongForm)
    } else {
      logEditSong(nextSongForm)
    }
  })

  const onDelete = () => {
    if (isLoading) return
    logDeleteSong()
    deleteSong({ onSuccess: closeSongDetail })
  }

  return (
    <>
      <Header
        isLoading={isLoading}
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
        onKeyDownCapture={e => {
          const isAltEnter = e.altKey && ['\n', 'enter', 'Enter'].includes(e.key)
          if (!isAltEnter) return
          if (isLoading) return
          onSave()
        }}
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
