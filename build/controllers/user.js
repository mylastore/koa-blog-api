'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Blog = require('../models/Blog');

var _Blog2 = _interopRequireDefault(_Blog);

var _Quote = require('../models/Quote');

var _Quote2 = _interopRequireDefault(_Quote);

var _utils = require('../middleware/utils');

var _utils2 = _interopRequireDefault(_utils);

var _data2 = require('../middleware/data');

var _data3 = _interopRequireDefault(_data2);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _mongoErrors = require('../middleware/mongoErrors');

var _mongoErrors2 = _interopRequireDefault(_mongoErrors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _googleAuthLibrary = require('google-auth-library');

var _validate = require('../middleware/validate');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var passwordResetSecrete = process.env.JWT_PASSWORD_SECRET;
var userActivationSecret = process.env.JWT_ACCOUNT_ACTIVATION;
var sessionExpiration = process.env.EXPIRES;

/**
 * User controller - Class
 * @category Api
 */

var UserController = function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, [{
    key: 'accountActivation',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
        var _ctx$request$body, name, email, password, emailValid, passwordValid, nameValid, user, token;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ctx$request$body = ctx.request.body, name = _ctx$request$body.name, email = _ctx$request$body.email, password = _ctx$request$body.password;
                emailValid = (0, _validate.validateEmail)(email);
                passwordValid = (0, _validate.validatePassword)(password);
                nameValid = (0, _validate.validateRequired)(name);


                if (!emailValid || !passwordValid || !nameValid) {
                  ctx.throw(422, 'Invalid data received');
                }

                _context.prev = 5;
                _context.next = 8;
                return _User2.default.findOne({ email: email });

              case 8:
                user = _context.sent;

                if (user) {
                  ctx.throw(422, 'An active account already exist.');
                }
                _context.next = 12;
                return _jsonwebtoken2.default.sign({ name: name, email: email, password: password }, userActivationSecret, { expiresIn: '30m' });

              case 12:
                token = _context.sent;
                _context.next = 15;
                return _utils2.default.accountActivationEmail(ctx, email, token);

              case 15:
                return _context.abrupt('return', ctx.body = {
                  status: 200,
                  message: 'An email has been sent to ' + email + '. Please validate to activate account.'
                });

              case 18:
                _context.prev = 18;
                _context.t0 = _context['catch'](5);

                ctx.throw(422, _context.t0);

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 18]]);
      }));

      function accountActivation(_x) {
        return _ref.apply(this, arguments);
      }

      return accountActivation;
    }()
  }, {
    key: 'register',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx) {
        var token;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                token = ctx.request.body.token;
                _context3.next = 3;
                return _jsonwebtoken2.default.verify(token, userActivationSecret, function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, decoded) {
                    var name, email, password, avatar, username, obj, user, result, settingId, notification;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (err) {
                              ctx.throw(401, {
                                message: 'Link is expired. Please signup again.'
                              });
                            }
                            name = decoded.name, email = decoded.email, password = decoded.password;
                            avatar = _utils2.default.gravatar(email);
                            username = _shortid2.default.generate();
                            obj = {
                              name: name,
                              email: email,
                              password: password,
                              avatar: avatar,
                              username: username,
                              emailVerificationToken: undefined,
                              emailVerified: true
                            };
                            user = new _User2.default(obj);
                            _context2.prev = 6;
                            _context2.next = 9;
                            return user.save();

                          case 9:
                            result = _context2.sent;
                            settingId = process.env.SETTING_ID;
                            notification = process.env.SEND_MAIL;

                            if (!result) {
                              _context2.next = 16;
                              break;
                            }

                            _context2.next = 15;
                            return _data3.default.read('settings', settingId, function (err, checkData) {
                              if (!err && checkData && checkData.newUser === true && notification === 'yes') {
                                _utils2.default.sendNewUserEmail(name, email);
                              }
                            });

                          case 15:
                            ctx.body = {
                              status: 200,
                              message: 'Account is now active. Please login.'
                            };

                          case 16:
                            _context2.next = 21;
                            break;

                          case 18:
                            _context2.prev = 18;
                            _context2.t0 = _context2['catch'](6);

                            ctx.throw(422, _context2.t0);

                          case 21:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this, [[6, 18]]);
                  }));

                  return function (_x3, _x4) {
                    return _ref3.apply(this, arguments);
                  };
                }());

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function register(_x2) {
        return _ref2.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: 'login',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
        var _ctx$request$body2, password, email, passwordValid, emailValid, user, authUser;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _ctx$request$body2 = ctx.request.body, password = _ctx$request$body2.password, email = _ctx$request$body2.email;
                passwordValid = (0, _validate.validatePassword)(password);
                emailValid = (0, _validate.validateEmail)(email);

                if (!passwordValid || !emailValid) {
                  ctx.throw(422, 'Invalid data received');
                }

                _context4.prev = 4;
                _context4.next = 7;
                return _User2.default.findOne({ email: email });

              case 7:
                user = _context4.sent;

                if (!user) {
                  ctx.throw(404, 'User not found.');
                }
                _context4.next = 11;
                return user.comparePassword(password);

              case 11:
                if (_context4.sent) {
                  _context4.next = 13;
                  break;
                }

                ctx.throw(422, { message: 'Password is invalid' });

              case 13:
                authUser = user.toAuthJSON();

                ctx.cookies.set('token', authUser.token, {
                  expiresIn: sessionExpiration,
                  sameSite: 'lax',
                  httpOnly: true
                });
                return _context4.abrupt('return', ctx.body = authUser);

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4['catch'](4);

                ctx.throw(422, _context4.t0);

              case 21:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[4, 18]]);
      }));

      function login(_x5) {
        return _ref4.apply(this, arguments);
      }

      return login;
    }()
  }, {
    key: 'googleLogin',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx) {
        var idToken, googleId, client, res, _res$getPayload, email_verified, name, email, at_hash, user, authUser, avatar, username, password, _user, googleUser, googleAuthUser;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                idToken = ctx.request.body.idToken;
                googleId = process.env.GOOGLE_ID;
                client = new _googleAuthLibrary.OAuth2Client(googleId);
                _context5.prev = 3;
                _context5.next = 6;
                return client.verifyIdToken({
                  idToken: idToken,
                  audience: googleId
                });

              case 6:
                res = _context5.sent;

                if (!res) {
                  ctx.throw(422, 'Google authentication failed. Try again.');
                }
                _res$getPayload = res.getPayload(), email_verified = _res$getPayload.email_verified, name = _res$getPayload.name, email = _res$getPayload.email, at_hash = _res$getPayload.at_hash;

                if (!email_verified) {
                  ctx.throw(422, 'You have not verify this google email.');
                }
                _context5.next = 12;
                return _User2.default.findOne({ email: email });

              case 12:
                user = _context5.sent;

                if (!user) {
                  _context5.next = 22;
                  break;
                }

                _context5.next = 16;
                return user.toAuthJSON();

              case 16:
                authUser = _context5.sent;
                _context5.next = 19;
                return ctx.cookies.set('token', authUser.token, {
                  expiresIn: sessionExpiration,
                  sameSite: 'lax',
                  httpOnly: true
                });

              case 19:
                return _context5.abrupt('return', ctx.body = authUser);

              case 22:
                _context5.next = 24;
                return _utils2.default.gravatar(email);

              case 24:
                avatar = _context5.sent;
                _context5.next = 27;
                return _shortid2.default.generate();

              case 27:
                username = _context5.sent;
                password = at_hash + process.env.GOOGLE_AUTH_PASSWORD_EXT;
                _user = new _User2.default({
                  name: name,
                  email: email,
                  username: username,
                  password: password,
                  avatar: avatar
                });
                _context5.next = 32;
                return _user.save();

              case 32:
                googleUser = _context5.sent;
                _context5.next = 35;
                return googleUser.toAuthJSON();

              case 35:
                googleAuthUser = _context5.sent;

                ctx.cookies.set('token', googleAuthUser.token, {
                  expiresIn: sessionExpiration,
                  sameSite: 'lax',
                  httpOnly: true
                });
                ctx.body = googleAuthUser;

              case 38:
                _context5.next = 43;
                break;

              case 40:
                _context5.prev = 40;
                _context5.t0 = _context5['catch'](3);

                ctx.throw(422, _context5.t0);

              case 43:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 40]]);
      }));

      function googleLogin(_x6) {
        return _ref5.apply(this, arguments);
      }

      return googleLogin;
    }()
  }, {
    key: 'logOut',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ctx) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                ctx.state.user = null;
                ctx.cookies.set('token', null);
                ctx.body = { status: 200, message: 'Success!' };

              case 3:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function logOut(_x7) {
        return _ref6.apply(this, arguments);
      }

      return logOut;
    }()
  }, {
    key: 'forgot',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(ctx) {
        var data, emailValid, token, resetData, user;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                data = ctx.request.body;
                emailValid = (0, _validate.validateEmail)(data.email);

                if (!emailValid || !data.email) {
                  ctx.throw(422, 'Email format is invalid');
                }

                _context7.prev = 3;
                token = _jsonwebtoken2.default.sign({}, passwordResetSecrete, {
                  expiresIn: '30m'
                });
                resetData = {
                  passwordResetToken: token
                };
                _context7.next = 8;
                return _User2.default.findOneAndUpdate({ email: data.email }, resetData, { returnOriginal: false });

              case 8:
                user = _context7.sent;

                if (!user) {
                  ctx.throw(422, 'Email not found.');
                }

                _context7.next = 12;
                return _utils2.default.sendForgotPassword(user.email, token);

              case 12:
                ctx.body = { status: 200, message: 'Email sent to ' + user.email };
                _context7.next = 18;
                break;

              case 15:
                _context7.prev = 15;
                _context7.t0 = _context7['catch'](3);

                ctx.throw(422, _context7.t0);

              case 18:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[3, 15]]);
      }));

      function forgot(_x8) {
        return _ref7.apply(this, arguments);
      }

      return forgot;
    }()
  }, {
    key: 'resetPassword',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(ctx) {
        var _ctx$request$body3, passwordResetToken, password, passwordValid;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _ctx$request$body3 = ctx.request.body, passwordResetToken = _ctx$request$body3.passwordResetToken, password = _ctx$request$body3.password;
                passwordValid = (0, _validate.validatePassword)(password);

                if (!passwordValid) {
                  ctx.throw(422, 'Password minimum length 8, must have 1 capital letter, 1 number and 1 special character.');
                }

                _context9.next = 5;
                return _jsonwebtoken2.default.verify(passwordResetToken, passwordResetSecrete, function () {
                  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(err, decoded) {
                    var user, res;
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            if (err) {
                              ctx.throw(401, 'Expired or invalid link! Please try to resetting your password again');
                            }
                            _context8.prev = 1;
                            _context8.next = 4;
                            return _User2.default.findOne({
                              passwordResetToken: passwordResetToken
                            });

                          case 4:
                            user = _context8.sent;

                            if (!user) {
                              ctx.throw(422, 'Password reset token is invalid or has expired.');
                            }
                            user.password = password;
                            user.passwordResetToken = undefined;

                            _context8.next = 10;
                            return user.save();

                          case 10:
                            res = _context8.sent;

                            if (res) {
                              ctx.body = {
                                status: 200,
                                message: 'Password was updated successfully.'
                              };
                            }
                            _context8.next = 17;
                            break;

                          case 14:
                            _context8.prev = 14;
                            _context8.t0 = _context8['catch'](1);

                            ctx.throw(422, _context8.t0);

                          case 17:
                          case 'end':
                            return _context8.stop();
                        }
                      }
                    }, _callee8, this, [[1, 14]]);
                  }));

                  return function (_x10, _x11) {
                    return _ref9.apply(this, arguments);
                  };
                }());

              case 5:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function resetPassword(_x9) {
        return _ref8.apply(this, arguments);
      }

      return resetPassword;
    }()
  }, {
    key: 'updatePassword',
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(ctx) {
        var _ctx$request$body4, _id, password, user, res;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _ctx$request$body4 = ctx.request.body, _id = _ctx$request$body4._id, password = _ctx$request$body4.password;
                _context10.prev = 1;
                _context10.next = 4;
                return _User2.default.findOne({ _id: _id });

              case 4:
                user = _context10.sent;

                if (!user) {
                  _context10.next = 12;
                  break;
                }

                user.password = password;
                _context10.next = 9;
                return user.save();

              case 9:
                res = _context10.sent;

                if (!res) {
                  ctx.throw(422, 'Oops something went wrong, please try again.');
                }
                ctx.body = { status: 200, message: 'Password was updated.' };

              case 12:
                _context10.next = 17;
                break;

              case 14:
                _context10.prev = 14;
                _context10.t0 = _context10['catch'](1);

                ctx.throw(422, (0, _mongoErrors2.default)(_context10.t0));

              case 17:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this, [[1, 14]]);
      }));

      function updatePassword(_x12) {
        return _ref10.apply(this, arguments);
      }

      return updatePassword;
    }()

    // if user is authorize sends the user data

  }, {
    key: 'account',
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(ctx) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                ctx.body = ctx.state.user;

              case 1:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function account(_x13) {
        return _ref11.apply(this, arguments);
      }

      return account;
    }()
  }, {
    key: 'getProfile',
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(ctx) {
        var username;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                username = ctx.params.username;
                _context12.next = 3;
                return _User2.default.findOne({ username: username }).select('username name email about website location gender avatar createdAt').exec().then(function (res) {
                  ctx.body = res;
                }).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 3:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getProfile(_x14) {
        return _ref12.apply(this, arguments);
      }

      return getProfile;
    }()
  }, {
    key: 'updateAccount',
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(ctx) {
        var body, user;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                body = ctx.request.body;

                if (body.username) {
                  body.username.replace(/\s/g, '');
                }
                _context13.prev = 2;
                _context13.next = 5;
                return _User2.default.findOneAndUpdate({ username: ctx.params.username }, body, {
                  new: true,
                  runValidators: true,
                  context: 'query'
                });

              case 5:
                user = _context13.sent;

                if (!user) {
                  ctx.throw(404, 'User not found');
                }
                ctx.body = user.toAuthJSON();
                _context13.next = 13;
                break;

              case 10:
                _context13.prev = 10;
                _context13.t0 = _context13['catch'](2);

                ctx.throw(422, _context13.t0);

              case 13:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[2, 10]]);
      }));

      function updateAccount(_x15) {
        return _ref13.apply(this, arguments);
      }

      return updateAccount;
    }()
  }, {
    key: 'deleteUser',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(ctx) {
        var userId, countBlogs, _deleteUser;

        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                userId = ctx.request.body._id;
                _context14.next = 4;
                return _Blog2.default.countDocuments({ postedBy: userId });

              case 4:
                countBlogs = _context14.sent;

                if (!(countBlogs > 0)) {
                  _context14.next = 9;
                  break;
                }

                return _context14.abrupt('return', ctx.body = {
                  status: 422,
                  message: 'Before deleting your account you must delete all yours blogs.'
                });

              case 9:
                _context14.next = 11;
                return _User2.default.deleteOne({ _id: userId });

              case 11:
                _deleteUser = _context14.sent;

                if (!_deleteUser) {
                  ctx.throw(422, 'Oops something went wrong, please try again.');
                }
                ctx.state.user = null;
                ctx.cookies.set('token', null);
                ctx.body = { status: 200, message: 'Success!' };

              case 16:
                _context14.next = 21;
                break;

              case 18:
                _context14.prev = 18;
                _context14.t0 = _context14['catch'](0);

                ctx.throw(422, _context14.t0);

              case 21:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 18]]);
      }));

      function deleteUser(_x16) {
        return _ref14.apply(this, arguments);
      }

      return deleteUser;
    }()
  }, {
    key: 'createQuote',
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(ctx) {
        var data, quote, name, email, tel, site, msg, reason, savedQuote;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                data = ctx.request.body;
                quote = new _Quote2.default(data);
                name = data.name;
                email = data.email;
                tel = data.tel || '';
                site = data.site;
                msg = data.msg;
                reason = 'New Quote';
                _context15.prev = 8;
                _context15.next = 11;
                return quote.save();

              case 11:
                savedQuote = _context15.sent;

                if (!savedQuote) {
                  ctx.throw(422, 'Quote could not be send. Please try again later.');
                }
                _utils2.default.sendEmailQuote(name, email, tel, site, msg, reason);
                ctx.body = 'Success!';
                _context15.next = 20;
                break;

              case 17:
                _context15.prev = 17;
                _context15.t0 = _context15['catch'](8);

                ctx.throw(_context15.t0);

              case 20:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this, [[8, 17]]);
      }));

      function createQuote(_x17) {
        return _ref15.apply(this, arguments);
      }

      return createQuote;
    }()
  }, {
    key: 'sendEmail',
    value: function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(ctx) {
        var data, name, email, tel, site, msg, reason;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                data = ctx.request.body;
                name = data.name;
                email = data.email;
                tel = data.tel;
                site = data.site;
                msg = data.msg;
                reason = 'New Email';

                _utils2.default.sendEmail(name, email, tel, site, msg, reason, function (err) {
                  if (err) {
                    ctx.throw(422, 'Oops! something went wrong, please try again.');
                  }
                  ctx.body = 'Email was sent!';
                });

              case 8:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function sendEmail(_x18) {
        return _ref16.apply(this, arguments);
      }

      return sendEmail;
    }()

    // ADMIN USER CONTROLLER

  }, {
    key: 'adminGetUsers',
    value: function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(ctx) {
        var perPage, page, users, totalItems;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                perPage = 2;
                page = ctx.params.page || 1;
                _context17.prev = 2;
                _context17.next = 5;
                return _User2.default.find({}).select('-password').skip(perPage * page - perPage).limit(perPage);

              case 5:
                users = _context17.sent;

                if (!users) {
                  ctx.throw(422, 'Something went wrong, please try again.');
                }
                if (users.length <= 0) {
                  ctx.throw(422, 'No users found!');
                }
                _context17.next = 10;
                return _User2.default.countDocuments({});

              case 10:
                totalItems = _context17.sent;
                return _context17.abrupt('return', ctx.body = {
                  totalItems: totalItems,
                  perPage: perPage,
                  users: users
                });

              case 14:
                _context17.prev = 14;
                _context17.t0 = _context17['catch'](2);

                ctx.throw(_context17.t0);

              case 17:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this, [[2, 14]]);
      }));

      function adminGetUsers(_x19) {
        return _ref17.apply(this, arguments);
      }

      return adminGetUsers;
    }()
  }, {
    key: 'adminGetUser',
    value: function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(ctx) {
        var user;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                _context18.next = 3;
                return _User2.default.findById({ _id: ctx.params.id }).select({
                  profile: 1,
                  email: 1,
                  role: 1,
                  avatar: 1,
                  settings: 1,
                  createdAt: 1,
                  username: 1
                });

              case 3:
                user = _context18.sent;

                if (!user) {
                  ctx.throw(422, 'Something went wrong, please try again.');
                }
                return _context18.abrupt('return', ctx.body = user);

              case 8:
                _context18.prev = 8;
                _context18.t0 = _context18['catch'](0);
                return _context18.abrupt('return', ctx.throw(_context18.t0));

              case 11:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[0, 8]]);
      }));

      function adminGetUser(_x20) {
        return _ref18.apply(this, arguments);
      }

      return adminGetUser;
    }()
  }, {
    key: 'getStats',
    value: function () {
      var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(ctx) {
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                _context19.next = 3;
                return _User2.default.count({});

              case 3:
                ctx.body = _context19.sent;
                _context19.next = 9;
                break;

              case 6:
                _context19.prev = 6;
                _context19.t0 = _context19['catch'](0);

                ctx.throw(422, _context19.t0);

              case 9:
              case 'end':
                return _context19.stop();
            }
          }
        }, _callee19, this, [[0, 6]]);
      }));

      function getStats(_x21) {
        return _ref19.apply(this, arguments);
      }

      return getStats;
    }()

    /**
     * update setting function
     * @param {number} userId user id
     * @param {boolean} newUser new user email true or false
     * @param {boolean} newQuote new quote email true or false
     *  @throws {Object} error
     *  @return {Object} user object
     */

  }, {
    key: 'updateSettings',
    value: function () {
      var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(ctx) {
        var userData, userId, obj, user, settingId, settingsObject;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0;
                userData = ctx.request.body;
                userId = userData.userId;

                if (!userData) ctx.throw(422, 'Invalid data!');
                obj = {
                  settings: {
                    newUser: userData.newUser,
                    newQuote: userData.newQuote
                  }
                };
                _context20.next = 7;
                return _User2.default.findByIdAndUpdate({ _id: userId }, obj, {
                  new: true
                });

              case 7:
                user = _context20.sent;

                if (!user) ctx.throw(422, 'User not found!');
                settingId = process.env.SETTING_ID;


                if (user && settingId) {
                  settingsObject = {
                    settingId: settingId,
                    newUser: userData.newUser,
                    newQuote: userData.newQuote
                    // Update local settings file
                  };
                  _data3.default.update('settings', settingId, settingsObject, function (err) {
                    if (err) {
                      ctx.throw(422, 'Could not update settings.');
                    }
                  });
                  ctx.body = user.toAuthJSON(ctx);
                }
                _context20.next = 16;
                break;

              case 13:
                _context20.prev = 13;
                _context20.t0 = _context20['catch'](0);

                ctx.throw(_context20.t0);

              case 16:
              case 'end':
                return _context20.stop();
            }
          }
        }, _callee20, this, [[0, 13]]);
      }));

      function updateSettings(_x22) {
        return _ref20.apply(this, arguments);
      }

      return updateSettings;
    }()

    // public users

  }, {
    key: 'publicProfile',
    value: function () {
      var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(ctx) {
        var _this = this;

        var username, user, blogs;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                username = ctx.params.username;
                user = void 0;
                blogs = void 0;
                _context22.next = 5;
                return _User2.default.findOne({ username: username }).select('_id username name email avatar createdAt').exec().then(function (res) {
                  if (!res) {
                    ctx.throw(422, 'Oops! something is wrong. Try later.');
                  }
                  user = res;
                }).then(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
                  return regeneratorRuntime.wrap(function _callee21$(_context21) {
                    while (1) {
                      switch (_context21.prev = _context21.next) {
                        case 0:
                          _context21.next = 2;
                          return _Blog2.default.find({ postedBy: user._id }).populate('categories', 'name slug').populate('tags', 'name slug').populate('postedBy', 'id name').select('title slug excerpt categories avatar tags postedBy createdAt').exec().then(function (res) {
                            blogs = res;
                            ctx.body = { user: user, blogs: blogs };
                          });

                        case 2:
                        case 'end':
                          return _context21.stop();
                      }
                    }
                  }, _callee21, _this);
                }))).catch(function (err) {
                  ctx.throw(422, err);
                });

              case 5:
              case 'end':
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function publicProfile(_x23) {
        return _ref21.apply(this, arguments);
      }

      return publicProfile;
    }()
  }]);

  return UserController;
}();

exports.default = UserController;