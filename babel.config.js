module.exports = {
  presets: [
    '@vue/babel-preset-jsx'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'view-design',
        libraryDirectory: 'src/components'
      }
    ]
  ]
}
