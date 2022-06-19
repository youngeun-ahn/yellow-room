declare type Gender = 'MAN' | 'WOMAN' | 'BOTH' | 'NONE'

declare interface SongForm {
  number: number
  key: number
  gender: Gender
  tempo : number
  title: string
  singer: string
  origin: string
  rating: number
  isBlacklist: boolean
  tagList: string[]
  memo: string
  lyric: string
  youtube: string
}

declare type Mode = 'NEW' | 'EDIT'
