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
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          'display': 'flex',
          'alignItems': 'center',
          'gap': '0.2rem',
          'marginTop': '0.4rem',
          '& > svg': {
            width: '1.2rem',
          },
          '& > span': {
            lineHeight: 0,
          },
        },
      },
    },
  },
})

export default THEME
