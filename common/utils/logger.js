/* eslint-disable no-console */

const getFormattedTime = () => `[${new Date().toISOString()}]`

const test = (...params) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(...params)
  }
}

const debug = (...params) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(getFormattedTime(), '[DEBUG]:', ...params)
  }
}

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${getFormattedTime()}:`, ...params)
  }
}

const error = (...params) => {
  //if (process.env.NODE_ENV !== 'test') {
  console.error(getFormattedTime(), '[ERROR]:', ...params)
  //}
}

module.exports = {
  test,
  debug,
  info,
  error
}
