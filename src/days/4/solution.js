const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n\n'),
  R.converge((answers, boards) => ({ answers, boards }), [
    R.pipe(R.head, R.split(',')),
    R.tail
  ])
)

const simplifyBoard = R.pipe(
  R.split('\n'),
  R.map(R.split(' ')),
  R.flatten
)

const calculateWinningStates = board => R.pipe(
  R.converge(R.pipe(Array.of, R.unnest, states => ({ board: simplifyBoard(board), states })), [
    R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.reject(R.isEmpty)))),
    R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.reject(R.isEmpty))), R.transpose)
  ])
)(board)

const isSolved = (answers) => R.pipe(
  R.intersection(answers),
  R.length,
  R.equals(5)
)

const runSolutions = (answers, count) => boards => R.pipe(
  R.tap(() => console.log(count)),
  R.reduce((_, { board, states }) => R.pipe(
    R.filter(isSolved(answers.slice(0, count))),
    R.ifElse(R.pipe(R.length, l => l > 0),
      (bingo) => R.reduced({ bingo, board }),
      R.always(undefined)
    ))(states), undefined),
  R.ifElse(R.isNil,
    () => runSolutions(answers, count + 1)(boards),
    v => ({ ...v, answers: answers.slice(0, count) })
  )
)(boards)

const calcScore = R.converge(R.multiply, [
  R.pipe(R.prop('answers'), R.last, Number),
  R.pipe(
    ({ board, answers }) => R.difference(board, answers),
    R.reject(R.isEmpty),
    R.map(Number),
    R.sum,
    R.tap(console.log)
  )])

const solution1 = ({ answers, boards }) => R.pipe(
  R.map(calculateWinningStates),
  runSolutions(answers, 5),
  calcScore
)(boards)

const runSolutions2 = (answers, count) => boards => R.pipe(
  R.reject(R.pipe(
    R.prop('states'),
    R.filter(isSolved(answers.slice(0, count))),
    R.length,
    l => l > 0
  )),
  R.ifElse(R.pipe(R.length, l => l > 1),
    (arr) => runSolutions2(answers, count + 1)(arr),
    R.head
  )
)(boards)

const solution2 = ({ answers, boards }) => R.pipe(
  R.map(calculateWinningStates),
  runSolutions2(answers, 5),
  Array.of,
  runSolutions(answers, 5),
  calcScore
)(boards)

module.exports = R.pipe(parseInput, solution2, console.log)
