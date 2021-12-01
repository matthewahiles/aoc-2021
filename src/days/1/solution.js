const fs = require('fs')
const R = require('ramda')

const solutionOne = R.pipe(
  R.reduce(([previous, count], val) => val > previous ? [val, count + 1] : [val, count], [0, 0]),
  R.last,
  n => n - 1
)
const solutionTwo = R.pipe(
  R.aperture(3),
  R.map(R.sum), solutionOne
)

const parseInput = R.pipe(
  R.split('\n'),
  R.map(Number)
)

module.exports = R.pipe(parseInput, solutionTwo, console.log)
