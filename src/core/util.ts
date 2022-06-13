export const isKeywordIncludes = (
  target = '',
  search = '',
  ignoreCases = true,
) => {
  if (!ignoreCases) {
    return target.includes(search.trim())
  }
  const targetLo = target.toLowerCase()
  const searchLo = search.toLowerCase().trim()
  return targetLo.includes(searchLo)
}
