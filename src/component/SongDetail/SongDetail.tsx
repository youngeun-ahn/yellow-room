import { useDeleteSong, useEditSong } from '@core/query'
import { Drawer, DialogContent } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
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
    defaultValues: {
      // number: 0,
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
    },
  })

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
  const { open } = useSongDetailContext()
  const [isMounted, setIsMounted] = useState(false)

  useLayoutEffect(() => {
    if (!open) return
    setIsMounted(true)
  }, [open])

  if (!open && !isMounted) {
    return <></>
  }

  return <SongDetail onClose={() => setIsMounted(false)} />
}

export default SongDetailDrawer
