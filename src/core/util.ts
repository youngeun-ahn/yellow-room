import { sortedUniq } from 'lodash'
import sha1 from 'sha1'
import Hangul from 'hangul-js'
import { useEffect, useState } from 'react'

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

// https://usehooks.com/useDebounce
export function useDebounce<T> (value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay],
  )
  return debouncedValue
}
