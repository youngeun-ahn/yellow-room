import { createTheme } from '@mui/material'

const THEME = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          'color': 'black !important',
          '& .Mui-disabled': {
            color: 'black !important',
            WebkitTextFillColor: 'black',
          },
          'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            appearance: 'none',
            WebkitAppearance: 'none',
            margin: 0,
          },
          'input[type=number]': {
            appearance: 'textfield',
            MozAppearance: 'textfield',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          'display': 'flex',
          'alignItems': 'start',
          'gap': '0.2rem',
          'marginTop': '0.4rem',
          '& > svg': {
            width: '1.2rem',
          },
          '& > span': {
            lineHeight: 0,
            display: 'flex',
            flexFlow: 'column nowrap',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
})

export default THEME
