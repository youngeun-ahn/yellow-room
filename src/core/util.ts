import { sortedUniq } from 'lodash'
import sha1 from 'sha1'

export const isKeywordIncludes = (
  target: string,
  search: string,
  ignoreCases = true,
) => {
  if (!ignoreCases) {
    return target.includes(search.trim())
  }
  const targetLo = target.toLowerCase()
  const searchLo = search.toLowerCase().trim()
  return targetLo.includes(searchLo)
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
