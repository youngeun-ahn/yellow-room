import { Man, Woman, Wc } from '@mui/icons-material'
import { IconButton, SvgIcon } from '@mui/material'
import { useMemo } from 'react'

export type Gender = 'MAN' | 'WOMAN' | 'BOTH' | 'NONE'
const GENDER_MAP = {
  MAN: 'WOMAN',
  WOMAN: 'BOTH',
  BOTH: 'NONE',
  NONE: 'MAN',
} as const

interface Props {
  gender: Gender
  onChange: (gender: Gender) => void
}

function GenderToggleButton ({ gender, onChange }: Props) {
  const iconProps = useMemo(() => {
    switch (gender) {
      case 'MAN':
        return {
          component: Man,
          htmlColor: 'blue',
        }
      case 'WOMAN':
        return {
          component: Woman,
          htmlColor: 'red',
        }
      case 'BOTH':
        return {
          component: Wc,
          htmlColor: 'purple',
        }
      case 'NONE':
        return {
          component: Wc,
          htmlColor: 'gray',
        }
      default:
    }
    return {}
  }, [gender])

  return (
    <IconButton
      disableRipple size="small"
      onClick={() => onChange(GENDER_MAP[gender])}
    >
      <SvgIcon {...iconProps} fontSize="small" />
    </IconButton>
  )
}

export default GenderToggleButton
