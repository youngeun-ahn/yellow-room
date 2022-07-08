import { sortedUniq } from 'lodash'
import sha1 from 'sha1'
import Hangul from 'hangul-js'

export const isKeywordIncludes = (
  target: string,
  search: string,
  ignoreCases = true,
) => {
  const targetStr = (ignoreCases ? target.toLowerCase() : target).trim()
  const searchStr = (ignoreCases ? search.toLowerCase() : search).trim()
  const searchChunkList = searchStr.split(/\s+/g)
  return searchChunkList.some(chunk => {
    const isIncluded = targetStr.includes(chunk)
    if (isIncluded) return true

    const isHangulSearched = Hangul.search(targetStr, chunk) >= 0
    if (isHangulSearched) return true

    /* 초성 검색 */
    return Hangul
      .d(targetStr, true)
      .map(_ => _[0])
      .join('')
      .includes(chunk)
  })
}

export function uniqSort (list: string[]) {
  return sortedUniq(
    list.map(_ => _.trim())
      .filter(_ => _) // remove empty
      .sort(),
  )
}

export function toTagList (str: string) {
  return str
    .split(/[#\s]+/g)
    .map(_ => _.trim())
    .filter(_ => _)
}

export const hash = (str: string) => {
  if (!str?.trim()) return ''
  return sha1(str)
}

export const defaultSetting: Setting = {
  hideBlacklist: false,
  groupBy: 'ORIGIN',
  orderBy: 'TITLE',
}
