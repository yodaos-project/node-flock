var fs = require('fs')
var promisify = require('util').promisify
var native = bindings(['./build/Release/flock.node', './flock.node'])

function bindings (paths) {
  for (var i = 0; i < paths.length; ++i) {
    try {
      return require(paths[i])
    } catch (err) {
      continue
    }
  }
  throw new Error('Could not locate the bindings file. Tried:\n' +
    paths.map(it => `  =>${it}`).join('\n'))
}

function normalizeOptionsToMode (options) {
  if (options == null) {
    options = {}
  }
  if (typeof options !== 'object') {
    throw new TypeError('Expect an object to be second argument of flock')
  }
  var mode = 0
  if (!options.wait) {
    mode = mode | native.LOCK_NB
  }
  if (options.exclusive) {
    mode = mode | native.LOCK_EX
  } else {
    mode = mode | native.LOCK_SH
  }
  return mode
}

module.exports.lock = lock
module.exports.lockAsync = promisify(lock)
function lock (path, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Expect argument callback of flock.lock to be a function')
  }
  var mode = normalizeOptionsToMode(options)
  fs.open(path, 'w', (err, fd) => {
    if (err) {
      callback(err)
      return
    }
    native.flock(fd, mode, ret => {
      if (ret !== 0) {
        var msg = native.stdErr(ret)
        callback(new Error(msg))
        return
      }
      callback(null, fd)
    })
  })
}

module.exports.upgrade = upgrade
module.exports.upgradeAsync = promisify(upgrade)
function upgrade (fd, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  if (typeof callback !== 'function') {
    throw new TypeError('Expect argument callback of flock.upgrade to be a function')
  }
  var mode = normalizeOptionsToMode(options)
  native.flock(fd, mode, (ret) => {
    if (ret !== 0) {
      var msg = native.stdErr(ret)
      callback(new Error(msg))
      return
    }
    callback(null, fd)
  })
}

module.exports.unlock = unlock
module.exports.unlockAsync = promisify(unlock)
function unlock (fd, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Expect a function to be second argument of flock.unlock')
  }
  native.flock(fd, native.LOCK_UN, (ret) => {
    if (ret !== 0) {
      var msg = native.stdErr(ret)
      callback(new Error(msg))
      return
    }
    fs.close(fd, callback)
  })
}
