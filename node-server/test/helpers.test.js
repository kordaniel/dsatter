/* eslint-disable no-undef */

const {
  concatenateIntegers, intIsDigitsLong
} = require('../../common/utils/helpers')


describe('Helper functions work correctly', () => {
  describe('Concatenate integers:', () => {
    test('a=0, b=1 => 1', () => {
      expect(concatenateIntegers(0, 1)).toBe(1)
    })

    test('a=0, b=12 => 12', () => {
      expect(concatenateIntegers(0, 12)).toBe(12)
    })

    test('a=1, b=0 => 10', () => {
      expect(concatenateIntegers(1, 0)).toBe(10)
    })

    test('a=1, b=2 => 12', () => {
      expect(concatenateIntegers(1, 2)).toBe(12)
    })

    test('a=1, b=23 => 123', () => {
      expect(concatenateIntegers(1, 23)).toBe(123)
    })

    test('a=1, b=234 => 1234', () => {
      expect(concatenateIntegers(1, 234)).toBe(1234)
    })

    test('a=12, b=3 => 123', () => {
      expect(concatenateIntegers(12, 3)).toBe(123)
    })

    test('a=123, b=4 => 1234', () => {
      expect(concatenateIntegers(123, 4)).toBe(1234)
    })

    test('a=12, b=34 => 1234', () => {
      expect(concatenateIntegers(12, 34)).toBe(1234)
    })

    test('a=123, b=456 => 123456', () => {
      expect(concatenateIntegers(123, 456)).toBe(123456)
    })

    test('a=-1, b=0 => undefined', () => {
      expect(concatenateIntegers(-1, 0)).not.toBeDefined()
    })

    test('a=10, b=-5 => undefined', () => {
      expect(concatenateIntegers(10, -5)).not.toBeDefined()
    })

  })

  describe('intIsDigitsLong: ', () => {
    describe('Positives: ', () => {
      test('Single digit', () => {
        expect(intIsDigitsLong(1, 1)).toBe(true)
        for (let d = 2; d <= 10; d++) {
          expect(intIsDigitsLong(1, d)).toBe(false)
        }
      })

      test('2 digits', () => {
        expect(intIsDigitsLong(10, 1)).toBe(false)
        expect(intIsDigitsLong(10, 2)).toBe(true)
      })

      test('3 digits', () => {
        expect(intIsDigitsLong(101, 3)).toBe(true)
      })

      test('n in [1, 10^9] digits', () => {
        for (let n = 1, d = 1; n <= Math.pow(10, 9); n *= 10, d++) {
          expect(intIsDigitsLong(n, d)).toBe(true)
        }
      })

      test('0', () => {
        expect(intIsDigitsLong(0, 1)).toBe(true)
      })

    })

    describe('Negative:', () => {
      test('Single digit', () => {
        expect(intIsDigitsLong(-1, 1)).toBe(true)
        for (let d = 2; d <= 10; d++) {
          expect(intIsDigitsLong(1, d)).toBe(false)
        }
      })

      test('2 digits', () => {
        expect(intIsDigitsLong(-10, 1)).toBe(false)
        expect(intIsDigitsLong(-10, 2)).toBe(true)
      })

      test('3 digits', () => {
        expect(intIsDigitsLong(-101, 3)).toBe(true)
      })

      test('n in [-10^9, 1] digits', () => {
        for (let n = 1, d = 1; n <= Math.pow(10, 9); n *= 10, d++) {
          expect(intIsDigitsLong(-n, d)).toBe(true)
        }
      })

    })

  })

})
