'use strict';

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mail = require('@sendgrid/mail');

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_mail2.default.setApiKey(process.env.SENDGRID_API_KEY);

var utils = {};

//sendgrid
var appEmail = process.env.APP_EMAIL;
var appUrl = process.env.REQUEST_HOST;
var appName = process.env.APP_NAME;

utils.accountActivationEmail = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, email, token) {
        var link, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        link = appUrl + '/user/activation/' + token;
                        data = {
                            to: email,
                            from: appEmail,
                            subject: 'Account Activation',
                            html: '\n            <strong>Welcome to  ' + appName + '.<br/><br/> Please click on the button below to activate your account. If you did not request this, please ignore this email.<br/><br/></strong>\n            <a href="' + link + '">ACCOUNT ACTIVATION LINK</a>\n          '
                        };
                        _context.next = 4;
                        return _mail2.default.send(data).then(function (res) {
                            console.log('res', res);
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

utils.sendForgotPassword = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(email, token) {
        var link, msg;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        link = appUrl + '/user/reset/' + token;
                        msg = {
                            to: email,
                            from: appEmail, // Change to your verified sender
                            subject: 'Password reset link',
                            html: '\n            <strong>You are receiving this email because you (or someone else) have requested the reset of the password for your account @' + appName + '.<br/><br/> Please click on the button below to complete the process. If you did not request this, please ignore this email and your password will remain unchanged.<br/><br/></strong>\n            <a href="' + link + '">PASSWORD RESET LINK</a>\n          '
                        };
                        _context2.next = 4;
                        return _mail2.default.send(msg).then(function () {
                            console.log('Email sent');
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function (_x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}();

utils.sendNewUserEmail = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(name, email) {
        var msg;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        msg = {
                            to: appEmail,
                            from: appEmail, // Change to your verified sender
                            subject: 'New user created @' + appName,
                            html: '\n            <strong>New user was created @' + appName + '<br/></strong><br/>\n            <p>' + name + '</p>    \n            <p>' + email + '</p>    \n          '
                        };
                        _context3.next = 3;
                        return _mail2.default.send(msg).then(function () {
                            console.log('Email sent');
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 3:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function (_x6, _x7) {
        return _ref3.apply(this, arguments);
    };
}();

utils.sendQuoteEmail = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
        var name, email, message, phone, website, _data;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        name = data.name, email = data.email, message = data.message, phone = data.phone, website = data.website;

                        if (!(name && email && message)) {
                            _context4.next = 5;
                            break;
                        }

                        _data = {
                            to: appEmail,
                            from: email,
                            subject: 'Quote request from ' + appName,
                            template_id: 'd-0b3e1c50e75d40efab0963a73188f77b',
                            dynamic_template_data: {
                                name: name,
                                email: email,
                                message: message,
                                phone: phone,
                                website: website,
                                appUrl: appUrl,
                                appName: appName
                            }
                        };
                        _context4.next = 5;
                        return _mail2.default.send(_data).then(function () {
                            console.log('Quote was sent');
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function (_x8) {
        return _ref4.apply(this, arguments);
    };
}();

utils.sendAuthorEmail = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        var name, email, message, authorEmail, emailList, emailData;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        name = data.name, email = data.email, message = data.message, authorEmail = data.authorEmail;
                        emailList = [authorEmail];
                        emailData = {
                            to: emailList,
                            from: email,
                            subject: 'Someone message you from ' + appName,
                            text: 'Message received from:  \n Name: ' + name + ' \n Email: ' + email + ' \n Message: ' + message,
                            template_id: 'd-db32c2ca9cf94a47ac47f403a7778db2',
                            dynamic_template_data: {
                                name: name,
                                email: email,
                                message: message,
                                appUrl: appUrl,
                                appName: appName
                            }
                        };
                        _context5.next = 5;
                        return _mail2.default.send(emailData).then(function () {
                            console.log('Email to author sent');
                        }).catch(function (err) {
                            console.error(err);
                        });

                    case 5:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function (_x9) {
        return _ref5.apply(this, arguments);
    };
}();

utils.gravatar = function (email) {
    var size = 200;
    if (!email) return 'https://gravatar.com/avatar/?s=' + size + '&d-mp';
    var md5 = _crypto2.default.createHash('md5').update(email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?S=' + size + '&d=mp';
};

utils.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (error) {
        return {};
    }
};

utils.gravatar = function (email) {
    var size = 200;
    if (!email) return 'https://gravatar.com/avatar/?s=' + size + '%d=mp';
    var md5 = _crypto2.default.createHash('md5').update(email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=mp';
};

utils.isObjectEmpty = function (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }
    return true;
};

module.exports = utils;