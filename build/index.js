'use strict';
// @ts-check

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _kcors = require('kcors');

var _kcors2 = _interopRequireDefault(_kcors);

var _logs = require('./logs/logs');

var _koaUseragent = require('koa-useragent');

var _koaUseragent2 = _interopRequireDefault(_koaUseragent);

var _koaRatelimit = require('koa-ratelimit');

var _koaRatelimit2 = _interopRequireDefault(_koaRatelimit);

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _koaHelmet = require('koa-helmet');

var _koaHelmet2 = _interopRequireDefault(_koaHelmet);

var _koaJsonError = require('koa-json-error');

var _koaJsonError2 = _interopRequireDefault(_koaJsonError);

var _user = require('./routes/user');

var _user2 = _interopRequireDefault(_user);

var _quote = require('./routes/quote');

var _quote2 = _interopRequireDefault(_quote);

var _category = require('./routes/category');

var _category2 = _interopRequireDefault(_category);

var _tag = require('./routes/tag');

var _tag2 = _interopRequireDefault(_tag);

var _blog = require('./routes/blog');

var _blog2 = _interopRequireDefault(_blog);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _instagram = require('./routes/instagram');

var _instagram2 = _interopRequireDefault(_instagram);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//Routes


var mongoDB = process.env.DB_URI;

/**
 * Connection to mongo db
 * @param {object} options
 * @param {string} options.url - database url
 * @param {object} options
 * @param {Boolean} options.true - useCreateIndex true
 * @return {Promise<string>} Console log database connection
 */

_mongoose2.default.connect(mongoDB, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(function () {
  return console.log('DB: ', mongoDB);
}).catch(function (err) {
  return console.log(err);
});

//Initialize app
var app = new _koa2.default();
require('koa-qs')(app, 'extended');

app.use((0, _koaHelmet2.default)());

// //Here's the rate limiter
// app.use(
//     ratelimit({
//         db: new redis(),
//         duration: 60000,
//         errorMessage:
//             "Hmm, you seem to be doing that a bit too much - wouldn't you say?",
//         id: ctx => ctx.ip,
//         headers: {
//             remaining: 'Rate-Limit-Remaining',
//             reset: 'Rate-Limit-Reset',
//             total: 'Rate-Limit-Total',
//         },
//         max: 100,
//     })
// )


//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _logs.logger.info(ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status);
            _context.next = 8;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 6]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// Apply error json handling
var errorOptions = {
  postFormat: function postFormat(e, obj) {
    // Here's where we'll stick our error logger.
    _logs.logger.info(obj);
    if (process.env.NODE_ENV !== "production") {
      return obj;
    }
    delete obj.stack;
    delete obj.name;
    return obj;
  }
};
app.use((0, _koaJsonError2.default)(errorOptions));

// return response time in X-Response-Time header
app.use(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
    var t1, t2;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            t1 = Date.now();
            _context2.next = 3;
            return next();

          case 3:
            t2 = Date.now();

            ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms');

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function responseTime(_x3, _x4) {
    return _ref2.apply(this, arguments);
  }

  return responseTime;
}());

//For cors with options
app.use((0, _kcors2.default)({
  origins: ['' + process.env.REQUEST_HOST, '' + process.env.DEFAULTSEO_HOST]
}));

//For useragent detection
app.use(_koaUseragent2.default);

app.use((0, _koaBody2.default)({
  formLimit: '1mb',
  multipart: true, // Allow multiple files to be uploaded
  formidable: {
    maxFileSize: 5 * 1024 * 1024, // max size 5mb
    keepExtensions: true, //  Extensions to save images
    onFileBegin: function onFileBegin(name, file) {
      var fileName = file.name;
      var picReg = /\.(png|jpeg?g|gif|svg|webp|jpg)$/i;
      if (!picReg.test(fileName)) {
        new Error('File not supported');
      }
    },
    onEnd: function onEnd(name, file) {
      console.log('name? ', name);
      console.log('size.size ? ', file.size);
    }
  },
  onError: function onError(err) {
    if (err) {
      throw err;
    }
    new Error('Oops! something went wrong. Try again.');
  }

}));

// Configuring Static Resource Loading Middleware
app.use((0, _koaStatic2.default)('./public'));
app.use((0, _koaStatic2.default)('./upload'));

//For router
app.use(_user2.default.routes());
app.use(_user2.default.allowedMethods());
app.use(_quote2.default.routes());
app.use(_quote2.default.allowedMethods());
app.use(_category2.default.routes());
app.use(_category2.default.allowedMethods());
app.use(_tag2.default.routes());
app.use(_tag2.default.allowedMethods());
app.use(_blog2.default.routes());
app.use(_blog2.default.allowedMethods());
app.use(_auth2.default.routes());
app.use(_auth2.default.allowedMethods());
app.use(_instagram2.default.routes());
app.use(_instagram2.default.allowedMethods());

exports.default = app;