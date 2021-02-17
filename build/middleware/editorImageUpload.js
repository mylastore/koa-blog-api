'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _dateFormat = require('./dateFormat');

var _dateFormat2 = _interopRequireDefault(_dateFormat);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var BASE_DIR = 'upload/';

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
        throw new Error('EACCES: permission denied, mkdir \'' + parentDir + '\'');
      }

      var caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === _path2.default.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

var uploadImages = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    var time, date, file, picReg, fileName, target, galID, filePath, fileUrl, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            time = Date.parse(new Date());
            date = _dateFormat2.default.dateFormat(time, 'yyyyMMddhhmmss');

            if (!(0, _utils.isObjectEmpty)(ctx.request.files)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', next());

          case 4:
            file = ctx.request.files.avatar;
            picReg = /\.(png|jpeg?g|gif|svg|webp|jpg)$/i;

            if (!picReg.test(file.name)) {
              ctx.throw(422, "File format not supported");
            }

            fileName = file.name.replace(/\s/g, '').split('.').slice(0, -1).join('.');
            target = BASE_DIR + 'img-' + date;
            galID = 'img-' + date;
            filePath = _path2.default.join(BASE_DIR, galID, fileName + '.webp'); //Stitching file names

            fileUrl = _path2.default.join(galID, fileName + '.webp');
            _context.prev = 12;

            mkDirByPathSync(target);
            _context.next = 16;
            return (0, _sharp2.default)(ctx.request.files.avatar.path).resize(800, 400).webp({ quality: 80 }).toFile(filePath);

          case 16:
            result = _context.sent;


            if (result) {
              ctx.request.files.avatar.path = {
                galID: galID,
                imgUrl: 'http://localhost:8000/' + fileUrl,
                imgName: fileName,
                imgSize: result.size
              };
            }
            return _context.abrupt('return', next());

          case 21:
            _context.prev = 21;
            _context.t0 = _context['catch'](12);

            ctx.throw(422, _context.t0);

          case 24:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[12, 21]]);
  }));

  return function uploadImages(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = uploadImages;