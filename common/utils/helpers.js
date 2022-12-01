const isEmptyArray = (obj) => {
  return Array.isArray(obj) && obj.length === 0
}

const isNonEmptyArray = (obj) => {
  return Array.isArray(obj) && obj.length
}

const shallowEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

/**
 * Shuffles the array in place. Mutates the arr passed as argument, does NOT return a new array.
 * @param {Object[]} arr Array object to shuffle
 */
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
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
  isEmptyArray,
  isNonEmptyArray,
  shallowEqual,
  shuffleArray,
  getRandomElementFromArr,
  sleep,
  randomInt
}
