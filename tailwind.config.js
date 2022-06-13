const plugin = require('tailwindcss/plugin')

const flexUtil = plugin(({ addUtilities, matchUtilities, theme }) => {
  const flex = {
    'f' (gap = 0) {
      return {
        display: 'flex',
        gap,
      }
    },
    'f-center' (gap) {
      return {
        ...flex['f'](gap),
        justifyContent: 'center !important',
        alignItems: 'center !important',
      }
    },
    'f-row' (gap) {
      return {
        ...flex['f'](gap),
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
      }
    },
    'f-row-start' (gap) {
      return {
        ...flex['f-row'](gap),
        justifyContent: 'flex-start',
      }
    },
    'f-row-end' (gap) {
      return {
        ...flex['f-row'](gap),
        justifyContent: 'flex-end',
      }
    },
    'f-col' (gap) {
      return {
        ...flex['f'](gap),
        flexFlow: 'column wrap',
        alignItems: 'stretch',
      }
    },
  }

  addUtilities(
    Object.entries(flex).reduce((acc, [k, fn]) => {
      const key = '.' + k
      return { ...acc, [key]: fn() }
    }, {}),
  )

  matchUtilities(
    flex,
    { values: theme('spacing') },
  )
})

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    spacing: {
      0: 0,
      2: '0.2rem',
      4: '0.4rem',
      8: '0.8rem',
      12: '1.2rem',
      16: '1.6rem',
      24: '2.4rem',
    },
  },
  plugins: [flexUtil],
}
