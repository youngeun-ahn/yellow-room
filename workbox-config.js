module.exports = {
  globDirectory: 'build/',
  globPatterns: [
    '**/*.{ico,html,png,txt,woff,woff2}',
  ],
  swDest: 'build/service-worker.js',
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/,
  ],
}
