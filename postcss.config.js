export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-reporter': {
      clearReportedMessages: true,
      throwError: false  // Changed to false to allow warnings
    },
  },
}
