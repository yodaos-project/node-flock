# node-flock

![n-api enabled](https://img.shields.io/badge/n--api-enabled-brightgreen.svg)

A bridge of [flock(2)](https://linux.die.net/man/2/flock) to Node.js/ShadowNode in N-API.

## API Reference

### `flock.lock(path, [options], callback)`
Alias: `flock.lockAsync(path, [options]) -> Promise<lock>`

- `path`: `<string>`
- `options.wait`: `<boolean>` **Default: false** while lock is unavailable, if blocks current JavaScript execution context.
- `options.exclusive`: `<boolean>` **Default: false** if acquires exclusive lock. Defaults to shared lock.
- `callback`: `<Function>`
  - `error`: `<Error>`
  - `lock`: `<integer>` lock instance, currently it's a number.

Acquires the lock on the file.

### `flock.upgrade(lock, [options], callback)`
Alias: `flock.upgradeAsync(lock, [options]) -> Promise<lock>`

- `lock`: `<integer>`
- `options.wait`: `<boolean>` **Default: false** while lock is unavailable, if blocks current JavaScript execution context.
- `options.exclusive`: `<boolean>` **Default: false** if acquires exclusive lock. Defaults to shared lock.
- `callback`: `<Function>`
  - `error`: `<Error>`
  - `lock`: `<integer>` lock instance, currently it's a number.

Upgrades the lock previously acquired.

### `flock.unlock(lock, callback)`
Alias: `flock.unlockAsync(lock) -> Promise<void>`

- `lock`: `<integer>`
- `callback`: `<Function>`
  - `error`: `<Error>`

Unlocks previously acquired lock.
