const R = require('ramda')

const parseInput = R.pipe(
  R.split('\n'),
  R.init
)

const defI = R.defaultTo(Infinity)

const solution1 = R.pipe(
  R.map(R.pipe(
    R.split(''),
    R.map(Number)
  )),
  rows => {
    let total = 0
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const a = defI((rows[y] || [])[x - 1])
        const b = defI((rows[y] || [])[x + 1])
        const c = defI((rows[y + 1] || [])[x])
        const d = defI((rows[y - 1] || [])[x])
        const v = rows[y][x]
        if (v < a && v < b && v < c && v < d) {
          total += (v + 1)
        }
      }
    }
    return total
  })

const defInfV = R.defaultTo({ v: Infinity })
const getSets = R.pipe(R.filter(R.complement(R.isNil)), R.uniq)

const sets = []
const solution2 = R.pipe(
  R.map(R.pipe(
    R.split(''),
    R.map(v => ({ v: Number(v), set: undefined }))
  )),
  rows => {
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const { set: setA } = defInfV((rows[y] || [])[x - 1])
        const { set: setB } = defInfV((rows[y] || [])[x + 1])
        const { set: setC } = defInfV((rows[y + 1] || [])[x])
        const { set: setD } = defInfV((rows[y - 1] || [])[x])
        const { v } = rows[y][x]

        if (v !== 9) {
          const potSets = getSets([setA, setB, setC, setD])
          let potSet
          if (potSets.length > 1) {
            // merge intersecting sets
            for (let a = 1; a < potSets.length; a++) {
              sets[potSets[0]] = R.concat(sets[potSets[a]], sets[potSets[0]])
              sets[potSets[a]] = []
            }
            potSet = potSets[0]
          } else {
            [potSet] = potSets || []
          }
          if (!R.isNil(potSet)) {
            rows[y][x] = { v, set: potSet }
            sets[potSet].push(v)
          } else {
            sets.push([v])
            rows[y][x] = { v, set: sets.length - 1 }
          }
        }
      }
    }
  },
  () => sets,
  R.map(R.length),
  R.sort((a, b) => b - a),
  R.take(3),
  R.reduce(R.multiply, 1)
)

module.exports = R.pipe(parseInput, solution2, console.log)
