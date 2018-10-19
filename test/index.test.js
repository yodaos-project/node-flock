var test = require('tape')
var path = require('path')
var flock = require('../')

var target = path.join(__dirname, 'proc.lock')

test('exclusive lock shall be exclusive', t => {
  flock.lock(target, { exclusive: true }, (err, lock) => {
    t.error(err)
    flock.lock(target, { exclusive: true }, err => {
      t.notLooseEqual(err, null, 'try lock on an already locked file shall throw an error')
      flock.unlock(lock, err => {
        t.error(err)
        t.end()
      })
    })
  })
})

test('unlocked exclusive lock shall be available to next lock', t => {
  flock.lock(target, { exclusive: true }, (err, lock) => {
    t.error(err)
    flock.unlock(lock, (err) => {
      t.error(err)
      flock.lock(target, { exclusive: true }, err => {
        t.error(err)
        t.end()
      })
    })
  })
})
