import { sortedUniq } from 'lodash-es'
import sha1 from 'sha1'

export const isKeywordIncludes = (
  target: string,
  search: string,
  ignoreCases = true,
) => {
  const targetStr = (ignoreCases ? target.toLowerCase() : target).trim()
  const searchStr = (ignoreCases ? search.toLowerCase() : search).trim()
  const searchChunkList = searchStr.split(/\s+/g)
  return searchChunkList.some(_ => targetStr.includes(_))
}

export function uniqSort (list: string[]) {
  const sortedList = list
    .map(_ => _.trim())
    .filter(_ => _)
    .sort()
  return sortedUniq(sortedList)
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
