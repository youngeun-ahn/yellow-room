import { Rating, RatingProps, useEventCallback } from '@mui/material'
import { forwardRef, Ref, useState } from 'react'

function RatingInput (
  { value, onChange, ...props }: RatingProps,
  ref: Ref<unknown>,
) {
  const [startRating, setStartRating] = useState(value ?? 0)

  const onTouchMove: RatingProps['onTouchMove'] = useEventCallback(e => {
    const left = e.currentTarget.clientLeft
    const width = e.currentTarget.clientWidth
    const unit = width / 5

    const diff = e.touches[0].clientX - left
    const diffRating = Math.round((diff / unit) * 2) / 2 - 0.5
    onChange?.(e, startRating + diffRating)
  })

  return (
    <Rating
      size="large"
      precision={0.5}
      ref={ref}
      value={value}
      onTouchStart={() => setStartRating(value ?? 0)}
      onTouchMove={onTouchMove}
      onChange={onChange}
      {...props}
    />
  )
}

export default forwardRef(RatingInput)
