'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseUniqueValidator = require('mongoose-unique-validator');

var _mongooseUniqueValidator2 = _interopRequireDefault(_mongooseUniqueValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = new _mongoose2.default.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Category name is required'],
    minlength: [2, 'Category must be at least 2 characters.'],
    maxlength: [32, 'Category name max characters length is 32.']
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'Slug is required'],
    index: true
  }
}, { timestamps: true });

schema.plugin(_mongooseUniqueValidator2.default, { message: '{PATH} already exist.' });
exports.default = _mongoose2.default.model('Category', schema);