/* eslint-disable no-console */

const getFormattedTime = () => `[${new Date().toISOString()}]`

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${getFormattedTime()}:`, ...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(getFormattedTime(), '[ERROR]:', ...params)
  }
}

module.exports = {
  info,
  error
}
