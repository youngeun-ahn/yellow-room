import { createTheme } from '@mui/material'

const THEME = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          'color': 'black !important',
          'WebkitTextFillColor': 'black',
          '& .Mui-disabled': {
            color: 'black !important',
            WebkitTextFillColor: 'black',
          },
        },
      },
    },
  },
})

export default THEME
