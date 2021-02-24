'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _auth = require('../middleware/auth');

var _auth2 = _interopRequireDefault(_auth);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = new _koaRouter2.default();

router.get('/', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        ctx.body = { message: 'Hi there. ' + process.env.NPM_PACKAGE_VERSION };

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

var userController = new _user2.default();

router.post('/api/user/register', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return userController.register(ctx);

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());

router.post('/api/user/login', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx, next) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return userController.login(ctx);

                    case 2:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

router.post('/api/user/logout', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx, next) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return userController.logOut(ctx);

                    case 2:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());

router.post('/api/user/forgot', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx, next) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return userController.forgot(ctx);

                    case 2:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());

router.post('/api/user/reset-password', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ctx, next) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return userController.resetPassword(ctx);

                    case 2:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}());

router.post('/api/user/update-password', _auth2.default.isUser, function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(ctx, next) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return userController.updatePassword(ctx);

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}());

router.post('/api/user/account', _auth2.default.isUser, function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(ctx, next) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return userController.account(ctx);

                    case 2:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x15, _x16) {
        return _ref8.apply(this, arguments);
    };
}());

router.get('/api/user/profile/:username', _auth2.default.isUser, function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(ctx, next) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return userController.getProfile(ctx);

                    case 2:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x17, _x18) {
        return _ref9.apply(this, arguments);
    };
}());

router.get('/api/user/account/:username', function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(ctx, next) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return userController.publicProfile(ctx);

                    case 2:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function (_x19, _x20) {
        return _ref10.apply(this, arguments);
    };
}());

router.patch('/api/user/account/:username', _auth2.default.isUser, function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(ctx, next) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.next = 2;
                        return userController.updateAccount(ctx);

                    case 2:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, _callee11, undefined);
    }));

    return function (_x21, _x22) {
        return _ref11.apply(this, arguments);
    };
}());

router.post('/api/user/delete', _auth2.default.isUser, function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(ctx, next) {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return userController.deleteUser(ctx);

                    case 2:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function (_x23, _x24) {
        return _ref12.apply(this, arguments);
    };
}());

router.post('/api/quote', function () {
    var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(ctx, next) {
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _context13.next = 2;
                        return userController.createQuote(ctx);

                    case 2:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, _callee13, undefined);
    }));

    return function (_x25, _x26) {
        return _ref13.apply(this, arguments);
    };
}());

router.post('/api/email', function () {
    var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(ctx, next) {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _context14.next = 2;
                        return userController.sendEmail(ctx);

                    case 2:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, _callee14, undefined);
    }));

    return function (_x27, _x28) {
        return _ref14.apply(this, arguments);
    };
}());

// ADMIN USER ROUTES
router.get('/api/admin/users/:page', _auth2.default.isAdmin, function () {
    var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(ctx, next) {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        _context15.next = 2;
                        return userController.adminGetUsers(ctx);

                    case 2:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, _callee15, undefined);
    }));

    return function (_x29, _x30) {
        return _ref15.apply(this, arguments);
    };
}());

router.get('/api/admin/user/:id', _auth2.default.isAdmin, function () {
    var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(ctx, next) {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        _context16.next = 2;
                        return userController.adminGetUser(ctx);

                    case 2:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, _callee16, undefined);
    }));

    return function (_x31, _x32) {
        return _ref16.apply(this, arguments);
    };
}());

router.patch('/api/admin/update-settings', _auth2.default.isAdmin, function () {
    var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(ctx, next) {
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        _context17.next = 2;
                        return userController.updateSettings(ctx);

                    case 2:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, _callee17, undefined);
    }));

    return function (_x33, _x34) {
        return _ref17.apply(this, arguments);
    };
}());

router.get('/api/admin/stats', _auth2.default.isAdmin, function () {
    var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(ctx, next) {
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        _context18.next = 2;
                        return userController.getStats(ctx);

                    case 2:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, _callee18, undefined);
    }));

    return function (_x35, _x36) {
        return _ref18.apply(this, arguments);
    };
}());

router.post('/api/user/account-activation', function () {
    var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(ctx, next) {
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _context19.next = 2;
                        return userController.accountActivation(ctx);

                    case 2:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, _callee19, undefined);
    }));

    return function (_x37, _x38) {
        return _ref19.apply(this, arguments);
    };
}());

router.post('/api/user/google-login', function () {
    var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(ctx) {
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        _context20.next = 2;
                        return userController.googleLogin(ctx);

                    case 2:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, _callee20, undefined);
    }));

    return function (_x39) {
        return _ref20.apply(this, arguments);
    };
}());

exports.default = router;