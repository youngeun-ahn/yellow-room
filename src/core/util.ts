import { sortedUniq } from 'lodash'

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
