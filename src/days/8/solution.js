const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n'),
  R.init
)

const solution1 = R.pipe(
  R.map(R.split(' | ')),
  R.map(R.last),
  R.map(R.split(' ')),
  R.chain(R.filter(s => s.length === 2 || s.length === 3 || s.length === 4 || s.length === 7)),
  R.length
)

const lengthIs = v => R.pipe(R.length, R.equals(v))
const groupSegments = R.converge(Array.of, [
  R.filter(lengthIs(2)),
  R.filter(lengthIs(3)),
  R.filter(lengthIs(4)),
  R.filter(lengthIs(5)),
  R.filter(lengthIs(6)),
  R.filter(lengthIs(7))
])

const sortStr = str => [...str].sort().join('')

const decode = ([[one = []], [seven = []], [four = []], twoThreeFive, zeroSixNine, [eight = []]]) => {
  const seg24 = R.difference(four, one)
  const three = R.find(v => R.intersection(one, v).length === 2, twoThreeFive) || []
  const twoFive = R.filter(v => R.intersection(v, three).length !== 5, twoThreeFive)
  const seg2 = R.difference(seg24, three)
  const seg4 = R.intersection(seg24, three)
  const zero = R.find(v => R.intersection(seg4, v).length === 0, zeroSixNine)
  const sixNine = R.filter(v => R.intersection(v, zero).length !== 6, zeroSixNine)
  const six = R.find(v => R.intersection(one, v).length === 1, sixNine)
  const nine = R.find(v => R.intersection(one, v).length === 2, sixNine)
  const two = R.find(v => R.intersection(seg2, v).length !== 1, twoFive)
  const five = R.find(v => R.intersection(seg2, v).length === 1, twoFive)
  return {
    [sortStr(zero)]: 0,
    [sortStr(one)]: 1,
    [sortStr(two)]: 2,
    [sortStr(three)]: 3,
    [sortStr(four)]: 4,
    [sortStr(five)]: 5,
    [sortStr(six)]: 6,
    [sortStr(seven)]: 7,
    [sortStr(eight)]: 8,
    [sortStr(nine)]: 9
  }
}

const getOutputValues = R.pipe(
  R.map(R.split(' | ')),
  R.map(R.pipe(
    R.last,
    R.split(' '),
    R.map(sortStr)
  ))
)

const buildValues = ([values, valMap]) =>
  Number(values.map(v => valMap[v]).join(''))

const solution2 = input => R.pipe(
  R.map(R.split(' | ')),
  R.map(R.head),
  R.map(R.split(' ')),
  R.map(R.map(R.pipe(R.uniq, R.join('')))),
  R.map(R.sort((a, b) => a.length - b.length)),
  R.map(groupSegments),
  R.map(decode),
  R.zip(getOutputValues(input)),
  R.map(buildValues),
  R.sum
)(input)

module.exports = R.pipe(parseInput, solution2, console.log)
