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

const randomInt = (lower, upper) => {
  const low_int = Math.ceil(lower)
  const upper_int = Math.floor(upper)
  return Math.floor(Math.random() * (upper_int - low_int + 1)) + low_int
}

///**
// * Parses command line arguments array into a map holding the key val pairs.
// * @param {string[]} args array containing the command line argument strings.
// * @returns {object} holding the parsed arguments. Empty object if any of the requiredFields were missing.
// */
//const parseArgs = (args, requiredFields = []) => {
//  const parsedArgs = args
//    .map(a => a.trim())
//    .filter(a => a.startsWith('--'))
//    .reduce((acc, arg) => {
//      const [key, val] = arg.slice(2).split('=')
//
//      acc[key] = Number(val)
//        ? Number(val)
//        : val
//
//      return acc
//    }, {})
//
//  for (const field of requiredFields) {
//    if (!(field in parsedArgs)) {
//      return { }
//    }
//  }
//
//  return parsedArgs
//}

module.exports = {
  isNonEmptyArray,
  getRandomElementFromArr,
  sleep,
  randomInt
}
