'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var userSchema = new _mongoose2.default.Schema({
  username: {
    type: String,
    required: true,
    minlength: [2, 'Username minimum length is 2 characters'],
    maxlength: [32, 'Username maximum length is 32 characters'],
    unique: true,
    index: true
  },
  name: {
    type: String,
    trim: true,
    minlength: [2, 'Name minimum length is 2 characters'],
    maxlength: [32, 'Name maximum length is 32 characters']
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email is not valid'],
    immutable: true
  },
  role: { type: String, default: 'user', immutable: true },
  password: {
    type: String,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,50})$/, 'Password must be at least 6 characters and must contain 1 uppercase and 1 symbol']
  },
  passwordResetToken: String,
  emailVerified: { type: Boolean, default: false },
  google: String,
  gender: { type: String, default: '' },
  location: {
    type: String,
    required: false,
    default: '',
    maxlength: [60, 'Location maximum length is 60 characters']
  },
  about: {
    type: String,
    required: false,
    default: '',
    maxlength: [1000, 'Location maximum length is 1000 characters']
  },
  website: {
    type: String,
    default: '',
    match: [/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/, 'Website url is not valid']
  },
  avatar: { type: String, default: 'avatar.jpg' },
  settings: {
    newUser: { type: Boolean, default: false },
    newQuote: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.pre('save', function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcrypt2.default.hash(this.password, 10);

          case 2:
            this.password = _context.sent;

            next();

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

//Every user have aces to this methods
userSchema.methods.comparePassword = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(rawPassword) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _bcrypt2.default.compare(rawPassword, this.password);

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

userSchema.methods.generateJWT = function () {
  return _jsonwebtoken2.default.sign({
    _id: this._id,
    role: this.role,
    username: this.username,
    xsrfToken: process.env.XSRF_TOKEN
  }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES });
};

userSchema.methods.toAuthJSON = function () {
  return {
    user: {
      username: this.username,
      name: this.name,
      createdAt: this.createdAt,
      role: this.role,
      _id: this._id,
      avatar: this.avatar
    },
    token: this.generateJWT()
  };
};
userSchema.plugin(_mongooseUniqueValidator2.default, { message: '{PATH} already exists.' });
exports.default = _mongoose2.default.model('User', userSchema);