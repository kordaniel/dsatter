const isNonEmptyArray = (obj) => {
  return Array.isArray(obj) && obj.length
}

const getRandomElementFromArr = (obj) => {
  return !isNonEmptyArray(obj)
    ? undefined
    : obj[Math.floor(Math.random() * obj.length)]
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  isNonEmptyArray,
  getRandomElementFromArr,
  sleep
}