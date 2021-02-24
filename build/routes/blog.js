'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _auth = require('../middleware/auth');

var _auth2 = _interopRequireDefault(_auth);

var _blog = require('../controllers/blog');

var _blog2 = _interopRequireDefault(_blog);

var _upload = require('../middleware/upload');

var _upload2 = _interopRequireDefault(_upload);

var _editorImageUpload = require('../middleware/editorImageUpload');

var _editorImageUpload2 = _interopRequireDefault(_editorImageUpload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = new _koaRouter2.default();
var controller = new _blog2.default();

router.post('/api/blog/images', _auth2.default.isUser, _editorImageUpload2.default, function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return controller.blogImages(ctx, next);

                    case 2:
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

router.post('/api/blog', _auth2.default.isUser, _upload2.default, function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return controller.createBlog(ctx);

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3) {
        return _ref2.apply(this, arguments);
    };
}());

router.get('/api/blog/:id', _auth2.default.isUser, function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return controller.getAllUserBlogs(ctx);

                    case 2:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x4) {
        return _ref3.apply(this, arguments);
    };
}());

router.get('/api/getblog/:slug', function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return controller.getBlog(ctx);

                    case 2:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x5) {
        return _ref4.apply(this, arguments);
    };
}());

router.delete('/api/blog/:slug', _auth2.default.isUser, _auth2.default.isBlogAuthor, function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx, next) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return controller.deleteBlog(ctx, next);

                    case 2:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x6, _x7) {
        return _ref5.apply(this, arguments);
    };
}());

router.patch('/api/blog/:slug', _auth2.default.isUser, _auth2.default.isBlogAuthor, _upload2.default, function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ctx, next) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return controller.updateBlog(ctx, next);

                    case 2:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x8, _x9) {
        return _ref6.apply(this, arguments);
    };
}());

router.post('/api/blog/related', function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(ctx) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return controller.getRelatedBlogs(ctx);

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x10) {
        return _ref7.apply(this, arguments);
    };
}());

router.post('/api/blogs', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(ctx) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return controller.getAllPublishedBlogs(ctx);

                    case 2:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x11) {
        return _ref8.apply(this, arguments);
    };
}());

router.get('/api/blogs/search', function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(ctx) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return controller.search(ctx);

                    case 2:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x12) {
        return _ref9.apply(this, arguments);
    };
}());

router.post('/api/blogs/delete-img/:slug', _auth2.default.isUser, _auth2.default.isBlogAuthor, function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(ctx, next) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return controller.deleteImg(ctx, next);

                    case 2:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, undefined);
    }));

    return function (_x13, _x14) {
        return _ref10.apply(this, arguments);
    };
}());

exports.default = router;