import { Rating, RatingProps, useEventCallback } from '@mui/material'
import { clamp } from 'lodash-es'
import { forwardRef, Ref } from 'react'

function RatingInput (
  { value, onChange, ...props }: RatingProps,
  ref: Ref<unknown>,
) {
  const onTouchMove: RatingProps['onTouchMove'] = useEventCallback(e => {
    const left = e.currentTarget.clientLeft
    const width = e.currentTarget.clientWidth
    const unit = width / 5

    const diff = e.touches[0].clientX - left
    const rating = Math.round((diff / unit) * 2) / 2 - 0.5

    onChange?.(e, clamp(rating, 0, 5))
  })

  return (
    <Rating
      ref={ref}
      size="large"
      precision={0.5}
      value={value}
      onTouchMove={onTouchMove}
      onChange={onChange}
      {...props}
    />
  )
}

export default forwardRef(RatingInput)
