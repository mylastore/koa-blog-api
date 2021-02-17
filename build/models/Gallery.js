'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var gallerySchema = new Schema({
    gallery: [{ type: String }],
    listingId: {
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }
}, { timestamps: true });

exports.default = _mongoose2.default.model('Gallery', gallerySchema);