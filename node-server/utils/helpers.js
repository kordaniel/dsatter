const isNonEmptyArray = (obj) => {
  return Array.isArray(obj) && obj.length
}

module.exports = {
  isNonEmptyArray
}
