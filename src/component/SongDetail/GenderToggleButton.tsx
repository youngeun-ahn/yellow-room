import { Man, Woman, Wc } from '@mui/icons-material'
import { IconButton, IconButtonProps, SvgIcon } from '@mui/material'
import { useMemo } from 'react'

interface Props extends Omit<IconButtonProps, 'onChange' | 'onClick'> {
  gender: Gender
  onChange?: (gender: Gender) => void
}

function GenderToggleButton ({ gender, onChange, ...props }: Props) {
  const { icon, color, next } = useMemo(() => {
    switch (gender) {
      case 'MAN':
        return {
          icon: Man,
          color: 'blue',
          next: 'WOMAN' as Gender,
        }
      case 'WOMAN':
        return {
          icon: Woman,
          color: 'red',
          next: 'BOTH' as Gender,
        }
      case 'BOTH':
        return {
          icon: Wc,
          color: 'violet',
          next: 'NONE' as Gender,
        }
      default:
    }
    return {
      icon: Wc,
      color: 'gray',
      next: 'MAN' as Gender,
    }
  }, [gender])

  return (
    <IconButton
      size="small"
      onClick={() => onChange?.(next)}
      {...props}
    >
      <SvgIcon component={icon} fontSize="small" sx={{ color }} />
    </IconButton>
  )
}

export default GenderToggleButton
