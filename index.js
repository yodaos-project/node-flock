var fs = require('fs')
var native = require('./build/Release/flock.node')

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
function lock (path, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = null
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
function upgrade (fd, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = null
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
function unlock (fd, callback) {
  native.flock(fd, native.LOCK_UN, (ret) => {
    if (ret !== 0) {
      var msg = native.stdErr(ret)
      callback(new Error(msg))
      return
    }
    fs.close(fd, callback)
  })
}
