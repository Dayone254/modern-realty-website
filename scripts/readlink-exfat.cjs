// exFAT volumes have no symlinks: Node reports EISDIR for readlink on a regular
// file, but Next's build tolerates only POSIX's EINVAL. Map one to the other.
const fs = require("fs")

const eisdir = (error) => Boolean(error && error.code === "EISDIR")

function invalidArgument(path) {
  const error = new Error(`EINVAL: invalid argument, readlink '${path}'`)
  error.code = "EINVAL"
  error.errno = -4071
  error.syscall = "readlink"
  error.path = String(path)
  return error
}

const readlink = fs.readlink
fs.readlink = function (path, options, callback) {
  if (typeof options === "function") {
    callback = options
    options = undefined
  }
  return readlink.call(fs, path, options, (error, link) => {
    callback(eisdir(error) ? invalidArgument(path) : error, link)
  })
}

const readlinkSync = fs.readlinkSync
fs.readlinkSync = function (path, options) {
  try {
    return readlinkSync.call(fs, path, options)
  } catch (error) {
    if (eisdir(error)) throw invalidArgument(path)
    throw error
  }
}

const promiseReadlink = fs.promises.readlink
fs.promises.readlink = async function (path, options) {
  try {
    return await promiseReadlink.call(fs.promises, path, options)
  } catch (error) {
    if (eisdir(error)) throw invalidArgument(path)
    throw error
  }
}
