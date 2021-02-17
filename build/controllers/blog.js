'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Blog = require('../models/Blog');

var _Blog2 = _interopRequireDefault(_Blog);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _Tag = require('../models/Tag');

var _Tag2 = _interopRequireDefault(_Tag);

var _slugify = require('slugify');

var _slugify2 = _interopRequireDefault(_slugify);

var _stringStripHtml = require('string-strip-html');

var _stringStripHtml2 = _interopRequireDefault(_stringStripHtml);

var _mongoErrors = require('../middleware/mongoErrors');

var _mongoErrors2 = _interopRequireDefault(_mongoErrors);

var _utils = require('../middleware/utils');

var _removeDirectory = require('../middleware/removeDirectory');

var _removeDirectory2 = _interopRequireDefault(_removeDirectory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BlogController = function () {
  function BlogController() {
    _classCallCheck(this, BlogController);

    this.galID = [];
  }

  _createClass(BlogController, [{
    key: 'blogImages',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        var imgUrl, imgName, imgSize;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                this.galID.push(ctx.request.files.avatar.path.galID);
                imgUrl = ctx.request.files.avatar.path.imgUrl;
                imgName = ctx.request.files.avatar.path.imgName;
                imgSize = ctx.request.files.avatar.path.imgSize;
                return _context.abrupt('return', ctx.body = {
                  result: [{
                    url: imgUrl,
                    name: imgName,
                    size: imgSize
                  }]
                });

              case 8:
                _context.prev = 8;
                _context.t0 = _context['catch'](0);

                ctx.throw(422, _context.t0);

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function blogImages(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return blogImages;
    }()
  }, {
    key: 'createBlog',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
        var _ctx$request$body, title, content, published, categories, tags, slug, metaDescription, excerpt, imageURl, imgID, blog, error;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ctx$request$body = ctx.request.body, title = _ctx$request$body.title, content = _ctx$request$body.content, published = _ctx$request$body.published, categories = _ctx$request$body.categories, tags = _ctx$request$body.tags;
                slug = void 0;
                metaDescription = void 0;
                excerpt = void 0;
                imageURl = 'seo-default.webp';
                imgID = void 0;


                if (!(0, _utils.isObjectEmpty)(ctx.request.files)) {
                  imageURl = ctx.request.files.avatar.path.avatarUrl;
                  imgID = ctx.request.files.avatar.path.imgID;
                }

                if (categories) {
                  categories = categories.trim().split(/\s*,\s*/);
                }
                if (tags) {
                  tags = tags.trim().split(/\s*,\s*/);
                }

                if (!categories || categories.length === 0) {
                  ctx.throw(400, 'At least one category is required');
                }
                if (!tags || tags.length === 0) {
                  ctx.throw(400, 'At least one tag is required');
                }

                if (content) {
                  metaDescription = (0, _stringStripHtml2.default)(content.substring(0, 160)).result;
                  excerpt = (0, _stringStripHtml2.default)(content.substring(0, 200)).result;
                }
                if (title) {
                  slug = (0, _slugify2.default)(title).toLowerCase();
                }

                blog = new _Blog2.default({
                  title: title,
                  published: published,
                  content: content,
                  slug: slug,
                  metaTitle: title + ' | ' + process.env.APP_NAME,
                  metaDescription: metaDescription,
                  categories: categories,
                  tags: tags,
                  excerpt: excerpt,
                  avatar: imageURl,
                  imgID: imgID,
                  galID: this.galID,
                  postedBy: ctx.state.user._id
                });
                _context2.next = 16;
                return blog.validateSync();

              case 16:
                error = _context2.sent;

                if (error) {
                  ctx.throw(422, (0, _mongoErrors2.default)(error));
                }
                _context2.prev = 18;
                _context2.next = 21;
                return blog.save();

              case 21:
                ctx.body = _context2.sent;

                this.galID = [];
                _context2.next = 28;
                break;

              case 25:
                _context2.prev = 25;
                _context2.t0 = _context2['catch'](18);

                ctx.throw(422, (0, _mongoErrors2.default)(_context2.t0));

              case 28:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[18, 25]]);
      }));

      function createBlog(_x3) {
        return _ref2.apply(this, arguments);
      }

      return createBlog;
    }()
  }, {
    key: 'updateBlog',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx, next) {
        var data, slug, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = ctx.request.body;
                slug = ctx.params.slug;


                data.published = ctx.request.body.published;

                if (data.title) {
                  data.metaTitle = data.title + ' | ' + process.env.APP_NAME;
                }
                if (data.content) {
                  data.excerpt = (0, _stringStripHtml2.default)(data.content.substring(0, 200)).result;
                  data.metaDescription = (0, _stringStripHtml2.default)(data.content.substring(0, 160)).result;
                }
                if (data.categories) {
                  data.categories = data.categories.trim().split(/\s*,\s*/);
                }
                if (data.tags) {
                  data.tags = data.tags.trim().split(/\s*,\s*/);
                }
                if (!(0, _utils.isObjectEmpty)(ctx.request.files)) {
                  data.avatar = ctx.request.files.avatar.path.avatarUrl;
                  data.imgID = ctx.request.files.avatar.path.imgID;
                }

                // if new image push to galID array on DB

                if (!this.galID.length) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 11;
                return _Blog2.default.findOneAndUpdate({
                  slug: slug
                }, {
                  $push: {
                    galID: this.galID
                  }
                });

              case 11:
                _context3.prev = 11;
                _context3.next = 14;
                return _Blog2.default.findOneAndUpdate({ slug: slug }, data, { new: true, runValidators: true, context: 'query' });

              case 14:
                res = _context3.sent;

                if (res) {
                  ctx.body = res;
                  this.galID = [];
                }

                _context3.next = 21;
                break;

              case 18:
                _context3.prev = 18;
                _context3.t0 = _context3['catch'](11);

                ctx.throw(422, (0, _mongoErrors2.default)(_context3.t0));

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[11, 18]]);
      }));

      function updateBlog(_x4, _x5) {
        return _ref3.apply(this, arguments);
      }

      return updateBlog;
    }()
  }, {
    key: 'deleteImg',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx, next) {
        var blog, update;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return _Blog2.default.findOne({ slug: ctx.params.slug });

              case 3:
                blog = _context4.sent;

                if (!blog) {
                  _context4.next = 13;
                  break;
                }

                blog.avatar = 'seo-default.webp';
                _context4.next = 8;
                return blog.save();

              case 8:
                update = _context4.sent;

                if (!update) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 12;
                return (0, _removeDirectory2.default)('upload/' + blog.imgID);

              case 12:
                ctx.body = { status: 200, message: 'Image was updated.' };

              case 13:
                _context4.next = 18;
                break;

              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4['catch'](0);

                ctx.throw(422, _context4.t0);

              case 18:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 15]]);
      }));

      function deleteImg(_x6, _x7) {
        return _ref4.apply(this, arguments);
      }

      return deleteImg;
    }()
  }, {
    key: 'getAllUserBlogs',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _Blog2.default.find({ postedBy: ctx.params.id }).populate('categories', '_id name slug').populate('tags', '_id name slug').populate('postedBy', '_id name username').select('_id title slug visited tags postedBy published createdAt').exec().then(function (data) {
                  ctx.body = data;
                }).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getAllUserBlogs(_x8) {
        return _ref5.apply(this, arguments);
      }

      return getAllUserBlogs;
    }()
  }, {
    key: 'getAllPublishedBlogs',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(ctx) {
        var _this = this;

        var blogs, categories, tags, body, limit, skip;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                blogs = void 0;
                categories = void 0;
                tags = void 0;
                body = ctx.request.body;
                limit = body.limit ? parseInt(body.limit) : 10;
                skip = body.skip ? parseInt(body.skip) : 0;
                _context9.next = 8;
                return _Blog2.default.find({ published: true }).populate('categories', '_id name slug').populate('tags', '_id name slug').populate('postedBy', '_id name username').sort({ createdAt: -1 }).skip(skip).limit(limit).select('_id title avatar slug visited excerpt categories tags postedBy createdAt').exec().then(function (blog) {
                  blogs = blog;
                }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                  return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          _context8.next = 2;
                          return _Category2.default.find({}).exec().then(function (cat) {
                            categories = cat;
                          }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                              while (1) {
                                switch (_context7.prev = _context7.next) {
                                  case 0:
                                    _context7.next = 2;
                                    return _Tag2.default.find({}).exec().then(function (tag) {
                                      tags = tag;
                                    }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                                      return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                        while (1) {
                                          switch (_context6.prev = _context6.next) {
                                            case 0:
                                              _context6.next = 2;
                                              return _Blog2.default.countDocuments({ published: true }).exec().then(function (c) {
                                                var total = c;
                                                ctx.body = { blogs: blogs, categories: categories, tags: tags, size: blogs.length, total: total };
                                              });

                                            case 2:
                                            case 'end':
                                              return _context6.stop();
                                          }
                                        }
                                      }, _callee6, _this);
                                    })));

                                  case 2:
                                  case 'end':
                                    return _context7.stop();
                                }
                              }
                            }, _callee7, _this);
                          })));

                        case 2:
                        case 'end':
                          return _context8.stop();
                      }
                    }
                  }, _callee8, _this);
                }))).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 8:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getAllPublishedBlogs(_x9) {
        return _ref6.apply(this, arguments);
      }

      return getAllPublishedBlogs;
    }()
  }, {
    key: 'getBlog',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(ctx) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return _Blog2.default.findOneAndUpdate({ slug: ctx.params.slug }, { $inc: { visited: 1 } }, { new: true, upsert: true }).populate('categories', '_id name slug').populate('tags', '_id name slug').populate('postedBy', '_id name username').select('_id title published avatar content slug imgID visited metaTitle metaDescription categories tags postedBy createdAt').exec().then(function (data) {
                  if (!data) {
                    ctx.throw(422, { message: 'Blog not found.' });
                  }
                  ctx.body = data;
                }).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 2:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getBlog(_x10) {
        return _ref10.apply(this, arguments);
      }

      return getBlog;
    }()
  }, {
    key: 'deleteBlog',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(ctx, next) {
        var slug, res, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, filename;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                slug = ctx.params.slug;
                _context11.prev = 1;
                _context11.next = 4;
                return _Blog2.default.findOne({ slug: slug });

              case 4:
                res = _context11.sent;

                if (!(res && res.imgID)) {
                  _context11.next = 11;
                  break;
                }

                _context11.next = 8;
                return (0, _removeDirectory2.default)('upload/' + res.imgID);

              case 8:
                _context11.next = 10;
                return res.remove();

              case 10:
                return _context11.abrupt('return', ctx.body = { status: 200, message: 'Success!' });

              case 11:
                if (!(res && res.galID)) {
                  _context11.next = 41;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context11.prev = 15;
                _iterator = res.galID[Symbol.iterator]();

              case 17:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context11.next = 24;
                  break;
                }

                filename = _step.value;
                _context11.next = 21;
                return (0, _removeDirectory2.default)('upload/' + filename);

              case 21:
                _iteratorNormalCompletion = true;
                _context11.next = 17;
                break;

              case 24:
                _context11.next = 30;
                break;

              case 26:
                _context11.prev = 26;
                _context11.t0 = _context11['catch'](15);
                _didIteratorError = true;
                _iteratorError = _context11.t0;

              case 30:
                _context11.prev = 30;
                _context11.prev = 31;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 33:
                _context11.prev = 33;

                if (!_didIteratorError) {
                  _context11.next = 36;
                  break;
                }

                throw _iteratorError;

              case 36:
                return _context11.finish(33);

              case 37:
                return _context11.finish(30);

              case 38:
                _context11.next = 40;
                return res.remove();

              case 40:
                return _context11.abrupt('return', ctx.body = { status: 200, message: 'Success!' });

              case 41:
                _context11.next = 43;
                return res.remove();

              case 43:
                return _context11.abrupt('return', ctx.body = { status: 200, message: 'Success!' });

              case 46:
                _context11.prev = 46;
                _context11.t1 = _context11['catch'](1);

                ctx.throw(422, _context11.t1);

              case 49:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this, [[1, 46], [15, 26, 30, 38], [31,, 33, 37]]);
      }));

      function deleteBlog(_x11, _x12) {
        return _ref11.apply(this, arguments);
      }

      return deleteBlog;
    }()
  }, {
    key: 'getRelatedBlogs',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(ctx) {
        var body, _id, categories;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                body = ctx.request.body;
                _id = body._id, categories = body.categories;
                _context12.next = 4;
                return _Blog2.default.find({ _id: { $ne: _id }, categories: { $in: categories } }).limit(3).populate('postedBy', '_id name username').select('title slug avatar excerpt postedBy createdAt updatedAt').exec().then(function (data) {
                  ctx.body = data;
                }).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getRelatedBlogs(_x13) {
        return _ref12.apply(this, arguments);
      }

      return getRelatedBlogs;
    }()
  }, {
    key: 'search',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(ctx) {
        var search;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                search = ctx.request.query.q;

                if (!search || search === '') {
                  ctx.throw(422, 'Search query is empty.');
                }

                _context13.next = 4;
                return _Blog2.default.find({ $text: { $search: search } }).select('title slug excerpt postedBy').exec().then(function (res) {
                  ctx.body = res;
                }).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 4:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function search(_x14) {
        return _ref13.apply(this, arguments);
      }

      return search;
    }()
  }]);

  return BlogController;
}();

exports.default = BlogController;