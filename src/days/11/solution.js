const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n'),
  R.map(R.pipe(
    R.split(''),
    R.map(v => ({ v: Number(v), flashed: false })))),
  R.init
)

const incPos = (path, rows) =>
  R.when(R.hasPath(path), rows => { rows[path[0]][path[1]].v += 1 })(rows)

const runStep = R.pipe(
  R.map(R.map(R.evolve({ v: R.add(1) }))),
  rows => {
    let currentFlashes
    do {
      currentFlashes = 0
      for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
          const { v, flashed } = rows[y][x]
          if (v > 9 && !flashed) {
            rows[y][x].flashed = true
            currentFlashes += 1
            incPos([y - 1, x - 1], rows)
            incPos([y - 1, x], rows)
            incPos([y - 1, x + 1], rows)
            incPos([y, x - 1], rows)
            incPos([y, x + 1], rows)
            incPos([y + 1, x - 1], rows)
            incPos([y + 1, x], rows)
            incPos([y + 1, x + 1], rows)
          }
        }
      }
    } while (currentFlashes !== 0)
    return rows
  },
  R.converge(Array.of, [
    R.pipe(R.flatten, R.countBy(({ flashed }) => flashed)),
    R.map(R.map(R.evolve({ flashed: R.always(false), v: R.when(v => v > 9, R.always(0)) })))
  ])
)

const solution1 = rows => R.reduce(([total, state]) => {
  const [{ true: count }, v] = runStep(state)
  return [total + (count || 0), v]
}, [0, rows])(R.repeat(undefined, 100))[0]

const solution2 = rows => R.reduce(([total, state], step) => {
  const [{ true: count }, v] = runStep(state)
  if (count === 100) {
    return R.reduced(step + 1)
  }
  return [total + (count || 0), v]
}, [0, rows])(R.times(R.identity, 1000))

module.exports = R.pipe(parseInput, solution2, console.log)
