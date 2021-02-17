"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slugify = require("slugify");

var _slugify2 = _interopRequireDefault(_slugify);

var _Tag = require("../models/Tag");

var _Tag2 = _interopRequireDefault(_Tag);

var _Blog = require("../models/Blog");

var _Blog2 = _interopRequireDefault(_Blog);

var _mongoErrors = require("../middleware/mongoErrors");

var _mongoErrors2 = _interopRequireDefault(_mongoErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagController = function () {
  function TagController() {
    _classCallCheck(this, TagController);
  }

  _createClass(TagController, [{
    key: "createTag",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
        var name, tag, error;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                name = ctx.request.body.name;
                tag = new _Tag2.default({
                  name: name,
                  slug: (0, _slugify2.default)(name).toLowerCase()
                });
                error = tag.validateSync();

                if (error) {
                  ctx.throw(422, (0, _mongoErrors2.default)(error));
                }

                _context.prev = 4;
                _context.next = 7;
                return tag.save();

              case 7:
                ctx.body = _context.sent;
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](4);

                ctx.throw(422, (0, _mongoErrors2.default)(_context.t0));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 10]]);
      }));

      function createTag(_x) {
        return _ref.apply(this, arguments);
      }

      return createTag;
    }()
  }, {
    key: "getTags",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _Tag2.default.find({});

              case 3:
                ctx.body = _context2.sent;
                _context2.next = 9;
                break;

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2["catch"](0);

                ctx.throw(422, _context2.t0);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 6]]);
      }));

      function getTags(_x2) {
        return _ref2.apply(this, arguments);
      }

      return getTags;
    }()
  }, {
    key: "getTag",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
        var _this = this;

        var slug, tag, blogs;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                slug = ctx.params.slug.toLowerCase();
                tag = void 0;
                blogs = void 0;
                _context4.next = 5;
                return _Tag2.default.findOne({ slug: slug }).exec().then(function (t) {
                  if (!t) {
                    ctx.throw('Tag does not exist.');
                  }
                  tag = t;
                }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return _Blog2.default.find({ tags: tag }).populate('categories', '_id name slug username').populate('tags', '_id name slug username').populate('postedBy', '_id name username').select('_id title slug excerpt categories tags postedBy avatar createdAt visited').exec().then(function (res) {
                            blogs = res;
                            ctx.body = {
                              blogs: res,
                              tag: tag
                            };
                          });

                        case 2:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this);
                }))).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getTag(_x3) {
        return _ref3.apply(this, arguments);
      }

      return getTag;
    }()
  }, {
    key: "deleteTag",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx) {
        var slug, delTag;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                slug = ctx.params.slug;
                _context5.next = 4;
                return _Tag2.default.deleteOne({ slug: slug });

              case 4:
                delTag = _context5.sent;

                if (delTag) {
                  ctx.body = { status: 200, message: 'Tag was deleted successfully' };
                }
                _context5.next = 11;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);

                ctx.throw(422, _context5.t0);

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 8]]);
      }));

      function deleteTag(_x4) {
        return _ref5.apply(this, arguments);
      }

      return deleteTag;
    }()
  }]);

  return TagController;
}();

exports.default = TagController;