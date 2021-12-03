const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n'),
  R.map(R.split('')),
  R.init
)

const invertNum = R.pipe(R.map(v => v === '0' ? '1' : '0'), R.join(''))

const solution1 = R.pipe(
  R.transpose,
  R.map(R.groupBy(R.identity)),
  R.map(R.map(R.length)),
  R.map(v => v[0] > v[1] ? '0' : '1'),
  R.join(''),
  v => [Number(`0b${v}`), Number(`0b${invertNum(v)}`)],
  R.apply(R.multiply)
)

const calcPosition = (pos, comparator, def) => input => R.pipe(
  R.map(R.nth(pos)),
  R.groupBy(R.identity),
  R.map(R.length),
  v => v[0] === v[1] ? def : comparator(v[0], v[1]) ? '0' : '1',
  v => [v, input]
)(input)

const positionIs = (v, position) => val => R.nth(position, val) === v

const calcRating = (comp, def, position = 0) => R.ifElse(R.pipe(R.length, v => !(v > 1)),
  v => Number(`0b${v[0].join('')}`),
  R.pipe(
    calcPosition(position, comp, def),
    ([posValue, input]) => R.filter(positionIs(posValue, position), input),
    (arr) => calcRating(comp, def, position + 1)(arr)
  ))

const solution2 = R.converge(R.multiply, [
  calcRating(R.gt, '1'),
  calcRating(R.lt, '0')
])

module.exports = R.pipe(parseInput, solution2, console.log)
