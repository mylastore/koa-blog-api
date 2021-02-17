"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mkDirByPathSync;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mkDirByPathSync(targetDir, opts) {
  var isRelativeToScript = opts && opts.isRelativeToScript;
  var sep = _path2.default.sep;
  var initDir = _path2.default.isAbsolute(targetDir) ? sep : '';
  var baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce(function (parentDir, childDir) {
    var curDir = _path2.default.resolve(baseDir, parentDir, childDir);
    try {
      _fs2.default.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') {
        // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows
      if (err.code === 'ENOENT') {
        // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error("EACCES: permission denied, mkdir '" + parentDir + "'");
      }

      var caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === _path2.default.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }
    return curDir;
  }, initDir);
}