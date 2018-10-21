var test = require('tape')
var path = require('path')
var flock = require('../')

var syn = 0

test('exclusive lock shall be exclusive', t => {
  var target = path.join(__dirname, `proc${++syn}.lock`)
  flock.lockAsync(target, { exclusive: true })
    .then(lock => {
      t.strictEqual(typeof lock, 'number', 'lock shall be an fd')
      return flock.lockAsync(target, { exclusive: true })
        .then(() => {
          t.fail('not reachable path')
        })
        .catch(err => {
          t.notLooseEqual(err, null, 'try lock on an already locked file shall throw an error')
          return flock.unlockAsync(lock)
        })
        .then(() => {
          t.end()
        })
    })
    .catch(err => {
      t.error(err)
      t.end()
    })
})

test('unlocked exclusive lock shall be available to next lock', t => {
  var target = path.join(__dirname, `proc${++syn}.lock`)
  t.plan()
  flock.lockAsync(target, { exclusive: true })
    .then(lock => {
      return flock.unlockAsync(lock)
    })
    .then(() => {
      return flock.lockAsync(target, { exclusive: true })
    })
    .then(lock => {
      return flock.unlockAsync(lock)
    })
    .then(() => {
      t.pass('succeeded without error')
      t.end()
    })
    .catch(err => {
      t.error(err)
      t.end()
    })
})

test('shared lock shall coexist', t => {
  var target = path.join(__dirname, `proc${++syn}.lock`)
  flock.lockAsync(target, { exclusive: false })
    .then(lock => {
      return flock.lockAsync(target, { exclusive: false })
        .then(lockB => {
          return Promise.all([lock, lockB].map(it => flock.unlockAsync(it)))
        })
    })
    .then(() => {
      t.pass('succeeded without error')
      t.end()
    })
    .catch(err => {
      t.error(err)
      t.end()
    })
})
