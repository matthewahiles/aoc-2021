const R = require('ramda')

const parseInput = R.pipe(
  R.split(','),
  R.map(Number)
)

const handleFish = R.cond([
  [R.equals(0), R.always([6, 8])],
  [R.T, R.pipe(R.add(-1), R.of)]
])
let count = 0
const solution1 = input => R.pipe(
  R.reduce(({ state }) => {
    console.log(++count)
    const gen = R.chain(handleFish, state)
    return { state: gen }
  }, { state: input }),
  R.prop('state'),
  R.length
)(R.repeat(undefined, 80))

const rotate = R.converge(R.append, [R.head, R.tail])

const solution2 = R.pipe(
  R.reduce((acc, v) => { acc[v] += 1; return acc }, R.repeat(0, 9)),
  initState => R.reduce(R.pipe(
    R.identity, // ramda breaks if I don't do this for some reason
    rotate,
    R.converge(R.adjust(6), [
      R.pipe(R.nth(8), R.add),
      R.identity
    ])
  ), initState, R.repeat(undefined, 256)),
  R.sum
)

module.exports = R.pipe(parseInput, solution2, console.log)
