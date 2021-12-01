const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n'),
  R.map(R.split(' ')),
  R.map(R.evolve({ 1: Number })),
  R.init
)

const directionIs = direction => (state, [d]) => d === direction
const processStep = R.cond([
  [directionIs('forward'), (state, [, n]) => R.evolve({ x: R.add(n) }, state)],
  [directionIs('up'), (state, [, n]) => R.evolve({ y: R.add(n * -1) }, state)],
  [directionIs('down'), (state, [, n]) => R.evolve({ y: R.add(n) }, state)],
  [R.T, console.log]
])

const solution1 = R.pipe(
  R.reduce(processStep, { x: 0, y: 0 }),
  v => v.x * v.y
)

const processStep2 = R.cond([
  [directionIs('forward'), ({ x, y, aim }, [, n]) => ({ x: x + n, y: y + (aim * n), aim })],
  [directionIs('up'), ({ x, y, aim }, [, n]) => ({ x, y, aim: aim - n })],
  [directionIs('down'), ({ x, y, aim }, [, n]) => ({ x, y, aim: aim + n })]
])

const solution2 = R.pipe(
  R.reduce(processStep2, { x: 0, y: 0, aim: 0 }),
  v => v.x * v.y
)
module.exports = R.pipe(parseInput, solution2, console.log)
