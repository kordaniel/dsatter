const isNonEmptyArray = (obj) => {
  return Array.isArray(obj) && obj.length
}

const getRandomElementFromArr = (obj) => {
  return !isNonEmptyArray(obj)
    ? undefined
    : obj[Math.floor(Math.random() * obj.length)]
}

module.exports = {
  isNonEmptyArray,
  getRandomElementFromArr
}
