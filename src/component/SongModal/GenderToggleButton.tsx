import { Man, Woman, Wc } from '@mui/icons-material'
import { IconButton, SvgIcon } from '@mui/material'
import { useMemo } from 'react'

const GENDER_MAP = {
  MAN: 'WOMAN',
  WOMAN: 'BOTH',
  BOTH: 'NONE',
  NONE: 'MAN',
} as const

interface Props {
  gender: Gender
  onChange: (gender: Gender) => void
  disabled?: boolean
}

function GenderToggleButton ({ gender, onChange, disabled }: Props) {
  const genderIcon = useMemo(() => {
    switch (gender) {
      case 'MAN':
        return {
          icon: Man,
          color: 'blue',
        }
      case 'WOMAN':
        return {
          icon: Woman,
          color: 'red',
        }
      case 'BOTH':
        return {
          icon: Wc,
          color: 'violet',
        }
      case 'NONE':
        return {
          icon: Wc,
          color: 'gray',
        }
      default:
    }
    return {}
  }, [gender])

  return (
    <IconButton
      disableRipple size="small"
      onClick={() => onChange(GENDER_MAP[gender])}
      disabled={disabled}
    >
      <SvgIcon
        component={genderIcon.icon!}
        fontSize="small"
        sx={{ color: genderIcon.color }}
      />
    </IconButton>
  )
}

export default GenderToggleButton
