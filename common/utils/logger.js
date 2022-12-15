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

const debugPrettyPrintObj = (prefix, obj, ...params) => {
  debug(prefix, `\n${JSON.stringify(obj, null, 2)}`)

  if (params.length > 0 && process.env.NODE_ENV === 'development') {
    console.log(...params)
  }
}

const info = (...params) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }
  console.log(`${getFormattedTime()}:`, ...params)
}

const infoPrettyPrintObj = (prefix, obj, ...params) => {
  info(prefix, `\n${JSON.stringify(obj, null, 2)}`)

  if (params.length > 0 && process.env.NODE_ENV !== 'test') {
    console.log(...params)
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
  debugPrettyPrintObj,
  info,
  infoPrettyPrintObj,
  error
}
