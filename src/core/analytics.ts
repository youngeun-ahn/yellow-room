import { logEvent } from 'firebase/analytics'
import { analytics } from './firestore'

export function logInstallApp (
  method: 'PWA' | 'AppStore',
  ui: 'Popup' | 'Button',
) {
  logEvent(analytics, 'install_app', { method, ui })
}

export function logCreateRoom (isPrivate: boolean) {
  logEvent(analytics, 'create_room', { method: isPrivate ? 'Private' : 'Public' })
}

export function logEnterRoom (isPrivate: boolean) {
  logEvent(analytics, 'enter_room', { method: isPrivate ? 'Private' : 'Public' })
}

export function logExitRoom () {
  logEvent(analytics, 'exit_room')
}

export function logShareRoom () {
  logEvent(analytics, 'share_room')
}

export function logDeleteRoom () {
  logEvent(analytics, 'delete_room')
}

const getFilledSongField = (song: Song) => [
  song.key || 'Key',
  song.gender || 'Gender',
  song.singer || 'Singer',
  song.origin || 'Origin',
  song.tagList.length || 'Tags',
  song.rating || 'Rating',
  song.isBlacklist || 'Blacklist',
  song.memo || 'Memo',
  song.lyric || 'Lyric',
  song.youtube || 'YouTube',
].filter(_ => _)

function logFilledSongField (song: Song, method: 'Create' | 'Edit') {
  if (!song) return
  getFilledSongField(song).forEach(field => {
    logEvent(analytics, 'filled_song_field', { method, field })
  })
}

export function logCreateSong (song: Song) {
  logEvent(analytics, 'create_song')
  logFilledSongField(song, 'Create')
}

export function logEditSong (song: Song) {
  logEvent(analytics, 'edit_song')
  logFilledSongField(song, 'Edit')
}

export function logDeleteSong () {
  logEvent(analytics, 'delete_song')
}
