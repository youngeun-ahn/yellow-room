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
  title: string
  singer: string
  group: string
  rating: number
  isBlacklist: boolean
  locked?: boolean
  tagList: string[]
  memo: string
  lyric: string
  youtube: string
  dateCreated: Date
  dateUpdated: Date
}

declare type Mode = 'NEW' | 'EDIT' | 'READ'

/** NOTE: 우선순위: 무조건 GroupBy로 먼저 Sorting */
declare type GroupBy = 'NONE' | 'GROUP' | 'SINGER'
declare type OrderBy = 'TITLE' | 'RATING' | 'RANDOM'
declare type CardViewOption =
  | 'KEY'
  | 'RATING'
  | 'GROUP'
  | 'SINGER'
  | 'TAG'
  | 'LYRIC'
  | 'MEMO'
  | 'YOUTUBE'
declare interface Setting {
  hideBlacklist: boolean
  orderBy: OrderBy
  groupBy: GroupBy
  cardViewOptionList: CardViewOption[]
}
