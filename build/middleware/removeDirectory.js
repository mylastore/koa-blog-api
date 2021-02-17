'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var rmdir = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dirPath) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _options$removeConten, removeContentOnly, _options$drillDownSym, drillDownSymlinks, _require, promisify, path, fs, readdirAsync, unlinkAsync, rmdirAsync, lstatAsync, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fileName, filePath, fileStat, isSymlink, isDir;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _options$removeConten = options.removeContentOnly, removeContentOnly = _options$removeConten === undefined ? false : _options$removeConten, _options$drillDownSym = options.drillDownSymlinks, drillDownSymlinks = _options$drillDownSym === undefined ? false : _options$drillDownSym, _require = require('util'), promisify = _require.promisify, path = require('path'), fs = require('fs'), readdirAsync = promisify(fs.readdir), unlinkAsync = promisify(fs.unlink), rmdirAsync = promisify(fs.rmdir), lstatAsync = promisify(fs.lstat); // fs.lstat can detect symlinks, fs.stat can't

            files = void 0;
            _context.prev = 2;
            _context.next = 5;
            return readdirAsync(dirPath);

          case 5:
            files = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](2);
            throw new Error(_context.t0);

          case 11:
            if (!files.length) {
              _context.next = 49;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 15;
            _iterator = files[Symbol.iterator]();

          case 17:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 35;
              break;
            }

            fileName = _step.value;
            filePath = path.join(dirPath, fileName);
            _context.next = 22;
            return lstatAsync(filePath);

          case 22:
            fileStat = _context.sent;
            isSymlink = fileStat.isSymbolicLink();
            isDir = fileStat.isDirectory();

            if (!(isDir || isSymlink && drillDownSymlinks)) {
              _context.next = 30;
              break;
            }

            _context.next = 28;
            return rmdir(filePath);

          case 28:
            _context.next = 32;
            break;

          case 30:
            _context.next = 32;
            return unlinkAsync(filePath);

          case 32:
            _iteratorNormalCompletion = true;
            _context.next = 17;
            break;

          case 35:
            _context.next = 41;
            break;

          case 37:
            _context.prev = 37;
            _context.t1 = _context['catch'](15);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 41:
            _context.prev = 41;
            _context.prev = 42;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 44:
            _context.prev = 44;

            if (!_didIteratorError) {
              _context.next = 47;
              break;
            }

            throw _iteratorError;

          case 47:
            return _context.finish(44);

          case 48:
            return _context.finish(41);

          case 49:
            if (removeContentOnly) {
              _context.next = 52;
              break;
            }

            _context.next = 52;
            return rmdirAsync(dirPath);

          case 52:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[2, 8], [15, 37, 41, 49], [42,, 44, 48]]);
  }));

  return function rmdir(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = rmdir;