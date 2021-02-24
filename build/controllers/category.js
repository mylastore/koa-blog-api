'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _Blog = require('../models/Blog');

var _Blog2 = _interopRequireDefault(_Blog);

var _slugify = require('slugify');

var _slugify2 = _interopRequireDefault(_slugify);

var _mongoErrors = require('../middleware/mongoErrors');

var _mongoErrors2 = _interopRequireDefault(_mongoErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CategoryController = function () {
    function CategoryController() {
        _classCallCheck(this, CategoryController);
    }

    _createClass(CategoryController, [{
        key: 'createCategory',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
                var name, category, error;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                name = ctx.request.body.name;
                                category = new _Category2.default({
                                    name: name,
                                    slug: (0, _slugify2.default)(name).toLowerCase()
                                });
                                error = category.validateSync();

                                if (error) {
                                    ctx.throw(422, (0, _mongoErrors2.default)(error));
                                }

                                _context.prev = 4;
                                _context.next = 7;
                                return category.save();

                            case 7:
                                ctx.body = _context.sent;
                                _context.next = 13;
                                break;

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](4);

                                ctx.throw(422, (0, _mongoErrors2.default)(_context.t0));

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[4, 10]]);
            }));

            function createCategory(_x) {
                return _ref.apply(this, arguments);
            }

            return createCategory;
        }()
    }, {
        key: 'getCategories',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                _context2.next = 3;
                                return _Category2.default.find({});

                            case 3:
                                ctx.body = _context2.sent;
                                _context2.next = 9;
                                break;

                            case 6:
                                _context2.prev = 6;
                                _context2.t0 = _context2['catch'](0);

                                ctx.throw(422, _context2.t0);

                            case 9:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 6]]);
            }));

            function getCategories(_x2) {
                return _ref2.apply(this, arguments);
            }

            return getCategories;
        }()
    }, {
        key: 'getCategory',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
                var _this = this;

                var slug, category, blogs;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                slug = ctx.params.slug.toLowerCase();
                                category = void 0;
                                blogs = void 0;
                                _context4.next = 5;
                                return _Category2.default.findOne({ slug: slug }).exec().then(function (cat) {
                                    if (!cat) {
                                        ctx.throw(422, 'Category does not exits.');
                                    }
                                    category = cat;
                                }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    _context3.next = 2;
                                                    return _Blog2.default.find({ categories: category }).populate('categories', '_id name username slug').populate('tags', '_id name username slug').populate('postedBy', '_id name username').select('_id title slug excerpt visited categories tags postedBy avatar createdAt').exec().then(function (res) {
                                                        blogs = res;
                                                        ctx.body = {
                                                            blogs: res,
                                                            category: category
                                                        };
                                                    });

                                                case 2:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this);
                                }))).catch(function (err) {
                                    ctx.throw(422, err);
                                });

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getCategory(_x3) {
                return _ref3.apply(this, arguments);
            }

            return getCategory;
        }()
    }, {
        key: 'deleteCategory',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx) {
                var slug, deleteCat;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                slug = ctx.params.slug;
                                _context5.next = 4;
                                return _Category2.default.deleteOne({ slug: slug });

                            case 4:
                                deleteCat = _context5.sent;

                                if (deleteCat) {
                                    ctx.body = {
                                        status: 200,
                                        message: 'Category was deleted successfully'
                                    };
                                }
                                _context5.next = 11;
                                break;

                            case 8:
                                _context5.prev = 8;
                                _context5.t0 = _context5['catch'](0);

                                ctx.throw(422, _context5.t0);

                            case 11:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 8]]);
            }));

            function deleteCategory(_x4) {
                return _ref5.apply(this, arguments);
            }

            return deleteCategory;
        }()
    }]);

    return CategoryController;
}();

exports.default = CategoryController;