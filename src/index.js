const fs = require('fs/promises')
const ee = require('events')
ee.setMaxListeners(25)

class ChangeEmitter extends ee {}

const fileChangeEmitter = new ChangeEmitter()

const buildInputName = s => s.replace('solution.js', 'input.txt')
let m
const throttle = (fn, time) => input => {
  if (m) return
  m = true
  fn(input)
  setTimeout(() => { m = false }, time)
}

fileChangeEmitter.on('change',
  dir => fs.readFile(buildInputName(dir), 'ascii')
    .then(throttle(require(dir.replace('/src', '')), 1000))
    .then(() => {
      for (const key of Object.keys(require.cache)) {
        if (key.includes(dir.slice(1))) {
          delete require.cache[key]
        }
      }
    }))

const ac = new AbortController()
const { signal } = ac

const watchers = []

const registerDirectory = async (dirName) => {
  const children = await fs.readdir(dirName, { withFileTypes: true })
  for (const child of children) {
    const isDir = child.isDirectory()
    if (isDir) {
      const fullDir = `${dirName}/${child.name}`
      watchers.push([fullDir, fs.watch(fullDir, { signal })])
      await registerDirectory(fullDir)
    }
  }
}

const emitWatcherEvents = async ([dir, watcher]) => {
  for await (const e of watcher) {
    if (e.eventType === 'change' && e.filename.includes('solution.js')) {
      fileChangeEmitter.emit('change', `${dir}/${e.filename}`)
    }
  }
}

(async () => {
  await registerDirectory('./src')
  watchers.map(emitWatcherEvents)
  process.stdin.resume()
})()
