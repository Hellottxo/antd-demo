module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        useBuiltIns: 'usage',
        modules: false,
        corejs: { version: 3, proposals: true },
        targets: {
          chrome: 64
        }
      }],
    '@babel/preset-typescript',
    '@babel/preset-flow',
    '@babel/preset-react'
  ]
}