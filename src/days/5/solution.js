const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n'),
  R.map(R.pipe(
    R.split(' -> '),
    R.map(R.split(',')),
    R.map(R.map(Number))
  )),
  R.init
)

const buildGrid = () => R.times(() => R.repeat(0, 999), 999)
const nonDiag = ([a, b]) => a[0] === b[0] || a[1] === b[1]

const solution1 = R.pipe(
  R.filter(nonDiag),
  R.reduce((grid, [a, b]) => {
    const [x1, y1] = a
    const [x2, y2] = b

    let i = x1
    let j = y1
    const x = x1 === x2 ? 0 : x1 < x2 ? 1 : -1
    const y = y1 === y2 ? 0 : y1 < y2 ? 1 : -1

    do {
      grid[i][j] += 1
      i += x
      j += y
    } while (i !== (x2 + x) || j !== (y2 + y))

    return grid
  }, buildGrid()),
  R.flatten,
  R.filter(v => v > 1),
  R.length
)

const solution2 = R.pipe(
  R.reduce((grid, [a, b]) => {
    const [x1, y1] = a
    const [x2, y2] = b

    let i = x1
    let j = y1
    const x = x1 === x2 ? 0 : x1 < x2 ? 1 : -1
    const y = y1 === y2 ? 0 : y1 < y2 ? 1 : -1

    do {
      grid[i][j] += 1
      i += x
      j += y
    } while (i !== (x2 + x) || j !== (y2 + y))

    return grid
  }, buildGrid()),
  R.flatten,
  R.filter(v => v > 1),
  R.length
)

module.exports = R.pipe(parseInput, solution2, console.log)
