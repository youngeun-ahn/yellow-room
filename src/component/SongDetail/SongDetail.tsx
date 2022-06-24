import { useDeleteSong, useEditSong } from '@core/query'
import { Drawer, DialogContent } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import Header from './Header'
import { useSongDetailContext } from './context'
import SongForm from './SongForm'

/* Song Detail Drawer */
function SongDetail () {
  const { song, open, closeSongDetail } = useSongDetailContext()
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
  const onSave = handleSubmit(({ title, singer, origin, key, tempo, ...form }) => {
    editSong({
      title: title.trim(),
      singer: singer.trim(),
      origin: origin.trim(),
      key: Number.parseInt(String(key), 10),
      tempo: Number.parseInt(String(tempo), 10),
      ...form,
    }, {
      onSuccess: closeSongDetail,
    })
  })

  const { deleteSong } = useDeleteSong(roomId, song?.id)
  const onDelete = () => deleteSong({ onSuccess: closeSongDetail })

  if (!open) {
    return <></>
  }

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
        transitionDuration={300}
        anchor="bottom"
      >
        <DialogContent className="h-screen !pt-[4.8rem] sm:!pt-[6.4rem] bg-yellow-50">
          <SongForm songForm={songForm} />
        </DialogContent>
      </Drawer>
    </>
  )
}

export default SongDetail
