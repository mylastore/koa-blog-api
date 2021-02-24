'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var getJwtToken = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        var parts, scheme, credentials;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(!ctx.header || !ctx.header.authorization)) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return');

                    case 2:
                        parts = ctx.header.authorization.split(' ');

                        if (!(parts.length === 2)) {
                            _context.next = 8;
                            break;
                        }

                        scheme = parts[0];
                        credentials = parts[1];

                        if (!/^Bearer$/i.test(scheme)) {
                            _context.next = 8;
                            break;
                        }

                        return _context.abrupt('return', credentials);

                    case 8:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getJwtToken(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var validateJWT = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx, next) {
        var _this = this;

        var secret, token;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        secret = process.env.JWT_SECRET;
                        _context3.next = 3;
                        return getJwtToken(ctx);

                    case 3:
                        token = _context3.sent;


                        if (!secret || !token) ctx.throw(401, { message: 'Access to resource not allow' });
                        //jsonwebtoken.verify also checks for expiration
                        _context3.next = 7;
                        return _jsonwebtoken2.default.verify(token, secret, function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, decoded) {
                                var user;
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                if (!err) {
                                                    _context2.next = 4;
                                                    break;
                                                }

                                                ctx.throw(440, 'Session has expired.');
                                                _context2.next = 10;
                                                break;

                                            case 4:
                                                _context2.next = 6;
                                                return _User2.default.findOne({ _id: decoded._id });

                                            case 6:
                                                user = _context2.sent;

                                                if (!user) {
                                                    ctx.throw(404, 'User not found.');
                                                }
                                                ctx.state.user = user.toAuthJSON();
                                                role = decoded.role;

                                            case 10:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this);
                            }));

                            return function (_x5, _x6) {
                                return _ref3.apply(this, arguments);
                            };
                        }());

                    case 7:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function validateJWT(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Blog = require('../models/Blog');

var _Blog2 = _interopRequireDefault(_Blog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var auth = {};
var role = void 0;

auth.isUser = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx, next) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return validateJWT(ctx);

                    case 2:
                        _context4.prev = 2;

                        if (!role) {
                            _context4.next = 5;
                            break;
                        }

                        return _context4.abrupt('return', next());

                    case 5:
                        ctx.throw(401, { message: 'Not sufficient permissions' });
                        _context4.next = 11;
                        break;

                    case 8:
                        _context4.prev = 8;
                        _context4.t0 = _context4['catch'](2);

                        ctx.throw(_context4.t0);

                    case 11:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined, [[2, 8]]);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}();

auth.isAdmin = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx, next) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return validateJWT(ctx);

                    case 2:
                        _context5.prev = 2;

                        if (!(role === 'admin')) {
                            _context5.next = 5;
                            break;
                        }

                        return _context5.abrupt('return', next());

                    case 5:
                        ctx.throw(401, { message: 'Not sufficient permissions' });
                        _context5.next = 11;
                        break;

                    case 8:
                        _context5.prev = 8;
                        _context5.t0 = _context5['catch'](2);

                        ctx.throw(401, _context5.t0);

                    case 11:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[2, 8]]);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}();

auth.isBlogAuthor = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ctx, next) {
        var slug, user, postedById, currentUserId, isAuthor;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        slug = ctx.params.slug;
                        _context6.next = 3;
                        return _Blog2.default.findOne({ slug: slug }).select('postedBy');

                    case 3:
                        user = _context6.sent;

                        if (!user) {
                            ctx.throw(404, 'Only author can perform this operation.');
                        }
                        postedById = user.postedBy._id.toString();
                        currentUserId = ctx.state.user._id.toString();
                        isAuthor = postedById === currentUserId;

                        if (isAuthor) {
                            _context6.next = 12;
                            break;
                        }

                        ctx.throw(401, 'You are not authorize to perform this action.');
                        _context6.next = 13;
                        break;

                    case 12:
                        return _context6.abrupt('return', next());

                    case 13:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}();

exports.default = auth;