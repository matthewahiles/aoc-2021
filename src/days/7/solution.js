const R = require('ramda')

const parseInput = R.pipe(
  R.split(','),
  R.map(Number)
)

const solution1 = R.pipe(
  R.converge(R.reduce(
    ([med, total], val) => [med, total + Math.abs(val - med)]), [
    R.pipe(R.median, v => [v, 0]),
    R.identity
  ])
)

const calcFuel = R.memoizeWith(R.identity, (n) => {
  if (n === 0 || n === 1) { return 1 }
  for (let i = n - 1; i >= 1; i--) {
    n += i
  }
  return n
})

const solution2 = input => R.reduce((acc, val) => R.pipe(
  R.map(v => calcFuel(Math.abs(v - val))),
  R.sum,
  R.append(R.__, acc)
)(input), [], R.times(R.identity, 2000)).sort((a, b) => a - b)

module.exports = R.pipe(parseInput, solution2, console.log)
