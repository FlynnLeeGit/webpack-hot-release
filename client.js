import { logger } from './utils/logger'
import { ajax } from './utils/ajax'

const RELOAD_DELAY = 100 // 页面刷新延迟时间

let lastUpdate = 0

function hotRelease({ throttle = 10, baseUrl = '/' } = {}) {
  // in 10s no twice
  if (new Date().getTime() - lastUpdate < throttle * 1000) {
    return false
  } else {
    lastUpdate = new Date().getTime()
    ajax.get(`${baseUrl}release.json?${lastUpdate}`, releaseJSON => {
      if (
        process.env.GIT_COMMIT &&
        releaseJSON.GIT_COMMIT &&
        releaseJSON.GIT_COMMIT.length === process.env.GIT_COMMIT.length &&
        releaseJSON.GIT_COMMIT !== process.env.GIT_COMMIT
      ) {
        logger.info(
          'UPDATE!',
          'local ->',
          process.env.GIT_COMMIT,
          'remote ->',
          releaseJSON.GIT_COMMIT
        )
        if (process.env.NODE_ENV === 'production') {
          setTimeout(() => {
            document.location.reload()
          }, RELOAD_DELAY)
        }
      }
    })
  }
}

export default function hotReleaseClient({ throttle, baseUrl } = {}) {
  if (!window.history) {
    logger.error('do not support window.history quit')
    return
  }
  if (!process.env.NODE_ENV) {
    logger.error('process.env.NODE_ENV not find,quit')
    return
  }
  if (!process || !process.env || !process.env.GIT_COMMIT) {
    logger.error(
      'process.env.GIT_COMMIT not find,check use webpack-hot-release/plugin first'
    )
    return
  }

  const oriPushState = window.history.pushState
  const oriReplaceState = window.history.replaceState
  /**
   * extra bind pushState
   */
  window.history.pushState = function() {
    hotRelease({
      throttle,
      baseUrl
    })
    return oriPushState.apply(this, arguments)
  }
  /**
   * extra bind replaceState
   */
  window.history.replaceState = function() {
    hotRelease({
      throttle,
      baseUrl
    })
    return oriReplaceState.apply(this, arguments)
  }
}
