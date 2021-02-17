'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Quote = require('../models/Quote');

var _Quote2 = _interopRequireDefault(_Quote);

var _utils = require('../middleware/utils');

var _utils2 = _interopRequireDefault(_utils);

var _mongoErrors = require('../middleware/mongoErrors');

var _mongoErrors2 = _interopRequireDefault(_mongoErrors);

var _validate = require('../middleware/validate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QuoteController = function () {
  function QuoteController() {
    _classCallCheck(this, QuoteController);
  }

  _createClass(QuoteController, [{
    key: 'getQuotes',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
        var perPage, page, quotes, totalItems;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                perPage = 2;
                page = ctx.params.page || 1;
                _context.prev = 2;
                _context.next = 5;
                return _Quote2.default.find({}).skip(perPage * page - perPage).limit(perPage);

              case 5:
                quotes = _context.sent;

                if (!(quotes.length <= 0)) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt('return', ctx.throw(422, 'No quotes found!'));

              case 8:
                _context.next = 10;
                return _Quote2.default.countDocuments({});

              case 10:
                totalItems = _context.sent;


                ctx.body = {
                  totalItems: totalItems,
                  perPage: perPage,
                  quotes: quotes
                };
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context['catch'](2);

                ctx.throw(422, _context.t0);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 14]]);
      }));

      function getQuotes(_x) {
        return _ref.apply(this, arguments);
      }

      return getQuotes;
    }()
  }, {
    key: 'getQuote',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
        var quoteId;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                quoteId = ctx.params.id;

                if (quoteId) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt('return', ctx.throw(422, 'Invalid data received!'));

              case 3:
                _context2.prev = 3;
                _context2.next = 6;
                return _Quote2.default.findById(quoteId);

              case 6:
                ctx.body = _context2.sent;
                _context2.next = 14;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](3);

                if (!(_context2.t0.kind === "ObjectId")) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt('return', ctx.throw(422, 'Invalid Quote ID'));

              case 13:
                ctx.throw(422, _context2.t0);

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 9]]);
      }));

      function getQuote(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getQuote;
    }()
  }, {
    key: 'saveQuote',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx) {
        var data, quote;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = ctx.request.body;


                if (!data.company) {
                  data.company = undefined;
                }
                if (!data.phone) {
                  data.phone = undefined;
                }

                _context3.prev = 3;
                _context3.next = 6;
                return new _Quote2.default(data).save();

              case 6:
                quote = _context3.sent;

                if (!quote) {
                  console.log('Could not save quote');
                }
                _context3.next = 10;
                return _utils2.default.sendQuoteEmail(data).then(function (res) {
                  ctx.body = { status: 200, message: 'Form was sent.' };
                });

              case 10:
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3['catch'](3);

                ctx.throw(422, (0, _mongoErrors2.default)(_context3.t0));

              case 15:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 12]]);
      }));

      function saveQuote(_x3) {
        return _ref3.apply(this, arguments);
      }

      return saveQuote;
    }()
  }, {
    key: 'contactAuthor',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
        var data, emailValid, authorEmailValid, validName, validMessage;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                data = ctx.request.body;
                emailValid = (0, _validate.validateEmail)(data.email);
                authorEmailValid = (0, _validate.validateEmail)(data.authorEmail);


                if (!emailValid || !authorEmailValid) {
                  ctx.throw(422, "Invalid email format");
                }
                validName = (0, _validate.validateRequired)(data.name);
                validMessage = (0, _validate.validateRequired)(data.message);

                if (!validName || !validMessage) {
                  ctx.throw(422, 'Missing required data');
                }
                _context4.next = 9;
                return _utils2.default.sendAuthorEmail(data).then(function () {
                  ctx.body = { status: 200, message: 'Email was sent.' };
                });

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function contactAuthor(_x4) {
        return _ref4.apply(this, arguments);
      }

      return contactAuthor;
    }()
  }]);

  return QuoteController;
}();

exports.default = QuoteController;