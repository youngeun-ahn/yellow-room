declare type Gender = 'MAN' | 'WOMAN' | 'BOTH' | 'NONE'

declare interface Room {
  id: string
  name: string
  pwd: string
}

declare interface Song {
  id: string
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

declare type Mode = 'NEW' | 'EDIT' | 'READ'

/** NOTE: 우선순위: GROUP > TITLE > RATING */
declare type GroupBy = 'NONE' | 'ORIGIN' // | 'SINGER'
declare type OrderBy = 'RANDOM' | 'RATING' | 'GROUP' | 'TITLE'
declare interface Setting {
  hideBlacklist: boolean
  orderBy: OrderBy
  groupBy: GroupBy
}
