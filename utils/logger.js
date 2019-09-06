export const logger = {
  info(...msgs) {
    console && console.info('[webpack-hot-release/client] ', ...msgs)
  },
  error(...msgs) {
    console && console.error('[webpack-hot-release/client] ', ...msgs)
  }
}
