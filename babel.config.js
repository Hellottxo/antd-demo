module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        useBuiltIns: 'entry',
        modules: false,
        corejs: {
          version: 3,
          proposals: true
        },
        targets: {
          chrome: 64
        }
      }]
  ]
}