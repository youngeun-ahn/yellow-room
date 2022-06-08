const CracoAlias = require('craco-alias')

module.exports = {
  devServer: {
    port: 3611,
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        tsConfigPath: 'tsconfig.paths.json',
      },
    },
  ],
}
