const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quoteSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [2, 'Name minimum character is 2'],
            maxlength: [60, 'Name maximum character is 60'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Email is invalid',
            ],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            minlength: [2, 'Message minimum 2 characters'],
            maxlength: [1000, 'Message maximum characters is 1000'],
        },
        phone: {
            type: String,
            match: [
                /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
                'Phone is not valid',
            ],
        },
        website: {
            type: String,
            match: [
                /^(?:[a-zA-Z0-9]+(?:\-*[a-zA-Z0-9])*\.)+[a-zA-Z0-9]{2,63}$/,
                'Website url is not valid',
            ],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Quote', quoteSchema)
