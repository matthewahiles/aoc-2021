const R = require('ramda')
const P = require('parsimmon')

const parseInput = R.pipe(
  R.split('\n'),
  R.init
)

const chunk = P.lazy(() => P.alt(
  P.string('{').then(chunk).then(P.string('}')),
  P.string('[').then(chunk).then(P.string(']')),
  P.string('<').then(chunk).then(P.string('>')),
  P.string('(').then(chunk).then(P.string(')'))
).many())

const scoreMap = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

const solution1 = R.pipe(
  R.map(v => [chunk.parse(v), v.length, v]),
  R.chain(([{ expected, index: { offset } }, l, v]) => offset !== l ? [{ v, expected, c: v[offset] }] : []),
  R.reduce((total, { c }) => total + scoreMap[c], 0)
)
const starts = ['{', '[', '<', '(']
const stripQuotes = R.map(R.nth(1))

const buildCompleteLine = (expected, v) => {
  const [next] = R.difference(stripQuotes(expected), starts)
  const newV = `${v}${next}`
  const result = chunk.parse(newV)
  if (!result.status) {
    return buildCompleteLine(result.expected, newV)
  }
  return newV
}

const scoreMap2 = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
}

const solution2 = R.pipe(
  R.map(v => [chunk.parse(v), v.length, v]),
  R.chain(([{ expected, index: { offset } }, l, v]) => offset === l ? [{ v, expected }] : []),
  R.map(({ expected, v }) => [v, buildCompleteLine(expected, v)]),
  R.map(([v, complete]) => R.drop(v.length, complete)),
  R.map(R.reduce((total, v) => total * 5 + scoreMap2[v], 0)),
  R.median
)

module.exports = R.pipe(parseInput, solution2, console.log)
