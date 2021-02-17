'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
  token: { type: String, required: true }
}, { timestamps: true });

module.exports = _mongoose2.default.model('InstagramToken', schema);