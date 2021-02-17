'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _removeDirectory = require('../middleware/removeDirectory');

var _removeDirectory2 = _interopRequireDefault(_removeDirectory);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _Quote = require('../models/Quote');

var _Quote2 = _interopRequireDefault(_Quote);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _Tag = require('../models/Tag');

var _Tag2 = _interopRequireDefault(_Tag);

var _Blog = require('../models/Blog');

var _Blog2 = _interopRequireDefault(_Blog);

var _data = require('../seed/data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();

/**
 * Class - deletes current data and seed new one
 * @class
 * @category Seeding Data
 */
var SeedData = function () {
    /**
     * @param {Object[]} quotes quotes seed data
     * @param {Object[]} users users seed data
     * @param {Object[]} listings listings seed data
     * @param {Object[]} models Models for user, quote and listing
     */
    function SeedData() {
        _classCallCheck(this, SeedData);

        this.blogs = _data2.default.blogs;
        this.quotes = _data2.default.quotes;
        this.users = _data2.default.users;
        this.tags = _data2.default.tags;
        this.categories = _data2.default.categories;
        this.models = [_User2.default, _Quote2.default, _Blog2.default, _Tag2.default, _Category2.default];
    }

    _createClass(SeedData, [{
        key: 'cleanDb',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, model;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 3;
                                _iterator = this.models[Symbol.iterator]();

                            case 5:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 12;
                                    break;
                                }

                                model = _step.value;
                                _context.next = 9;
                                return model.deleteMany({}, function () {});

                            case 9:
                                _iteratorNormalCompletion = true;
                                _context.next = 5;
                                break;

                            case 12:
                                _context.next = 18;
                                break;

                            case 14:
                                _context.prev = 14;
                                _context.t0 = _context['catch'](3);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 18:
                                _context.prev = 18;
                                _context.prev = 19;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 21:
                                _context.prev = 21;

                                if (!_didIteratorError) {
                                    _context.next = 24;
                                    break;
                                }

                                throw _iteratorError;

                            case 24:
                                return _context.finish(21);

                            case 25:
                                return _context.finish(18);

                            case 26:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 14, 18, 26], [19,, 21, 25]]);
            }));

            function cleanDb() {
                return _ref.apply(this, arguments);
            }

            return cleanDb;
        }()
    }, {
        key: 'pushDataToDb',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.blogs.forEach(function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(blog) {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.next = 2;
                                                        return new _Blog2.default(blog).save(function () {});

                                                    case 2:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this);
                                    }));

                                    return function (_x) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }());

                            case 2:
                                _context7.next = 4;
                                return this.tags.forEach(function () {
                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tag) {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.next = 2;
                                                        return new _Tag2.default(tag).save(function () {});

                                                    case 2:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this);
                                    }));

                                    return function (_x2) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }());

                            case 4:
                                _context7.next = 6;
                                return this.categories.forEach(function () {
                                    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(cat) {
                                        return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                            while (1) {
                                                switch (_context4.prev = _context4.next) {
                                                    case 0:
                                                        _context4.next = 2;
                                                        return new _Category2.default(cat).save(function () {});

                                                    case 2:
                                                    case 'end':
                                                        return _context4.stop();
                                                }
                                            }
                                        }, _callee4, _this);
                                    }));

                                    return function (_x3) {
                                        return _ref5.apply(this, arguments);
                                    };
                                }());

                            case 6:
                                _context7.next = 8;
                                return this.quotes.forEach(function () {
                                    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(quote) {
                                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        _context5.next = 2;
                                                        return new _Quote2.default(quote).save(function () {});

                                                    case 2:
                                                    case 'end':
                                                        return _context5.stop();
                                                }
                                            }
                                        }, _callee5, _this);
                                    }));

                                    return function (_x4) {
                                        return _ref6.apply(this, arguments);
                                    };
                                }());

                            case 8:
                                _context7.next = 10;
                                return this.users.forEach(function () {
                                    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(user) {
                                        return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                            while (1) {
                                                switch (_context6.prev = _context6.next) {
                                                    case 0:
                                                        _context6.next = 2;
                                                        return new _User2.default(user).save(function () {});

                                                    case 2:
                                                    case 'end':
                                                        return _context6.stop();
                                                }
                                            }
                                        }, _callee6, _this);
                                    }));

                                    return function (_x5) {
                                        return _ref7.apply(this, arguments);
                                    };
                                }());

                            case 10:

                                console.log('Database Populated!');

                            case 11:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function pushDataToDb() {
                return _ref2.apply(this, arguments);
            }

            return pushDataToDb;
        }()
    }, {
        key: 'seedDb',
        value: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.next = 2;
                                return (0, _removeDirectory2.default)('upload', { removeContentOnly: true });

                            case 2:
                                _context8.next = 4;
                                return this.cleanDb();

                            case 4:
                                _context8.next = 6;
                                return this.pushDataToDb();

                            case 6:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function seedDb() {
                return _ref8.apply(this, arguments);
            }

            return seedDb;
        }()
    }]);

    return SeedData;
}();

var dbUri = process.env.DB_URI;
_mongoose2.default.connect(dbUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var db;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
            switch (_context9.prev = _context9.next) {
                case 0:
                    db = new SeedData();
                    _context9.next = 3;
                    return db.seedDb();

                case 3:
                    console.log('You can close connection now by pressing ctr+c');

                case 4:
                case 'end':
                    return _context9.stop();
            }
        }
    }, _callee9, undefined);
}))).catch(function (err) {
    return console.log(err);
});