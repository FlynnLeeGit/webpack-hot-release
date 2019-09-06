const git = require('git-rev-sync')
const chalk = require('chalk')
const webpack = require('webpack')

/** @typedef {import("webpack/lib/Compiler")} Compiler */

const logger = {
  log(...msgs) {
    console && console.log(chalk.blue('[webpack-hot-release]'), ...msgs)
  },
  error(...msgs) {
    console && console.error(chalk.red('[webpack-hot-release]'), ...msgs)
  }
}

class WebpackHotReleasePlugin {
  constructor() {
    try {
      git.short()
    } catch (e) {
      logger.error('get git commit error', e.message)
    }
    this.name = 'webpack-hot-release'
  }
  get releaseInfo() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      GIT_COMMIT: process.env.GIT_COMMIT || git.short(),
      GIT_MESSAGE: process.env.GIT_MESSAGE || git.message(),
      GIT_BRANCH: process.env.GIT_BRANCH || git.branch(),
      GIT_DATE: process.env.GIT_DATE || git.date()
    }
  }
  get releaseJSON() {
    return JSON.stringify(this.releaseInfo, null, 2)
  }
  /**
   *
   * @param {Compiler} compiler
   */
  apply(compiler) {
    this.compiler = compiler
    this.webpackOptions = compiler.options
    this.context = compiler.context

    compiler.options.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GIT_COMMIT': JSON.stringify(this.releaseInfo.GIT_COMMIT),
        'process.env.GIT_BRANCH': JSON.stringify(this.releaseInfo.GIT_BRANCH),
        'process.env.GIT_MESSAGE': JSON.stringify(this.releaseInfo.GIT_MESSAGE),
        'process.env.GIT_DATE': JSON.stringify(this.releaseInfo.GIT_DATE)
      })
    )
    compiler.hooks.compilation.tap(this.name, this.applyPlugin.bind(this))
  }
  applyPlugin(compilation) {
    compilation.assets['release.json'] = {
      source: () => {
        return this.releaseJSON
      },
      size: () => {
        return this.releaseJSON.length
      }
    }
  }
}

new WebpackHotReleasePlugin()
module.exports = WebpackHotReleasePlugin
