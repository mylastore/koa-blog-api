const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        },
        msg: {
            type: String,
            required: true,
            minlength: [2, 'Content: must be at lest 3 characters'],
            maxlength: [512, 'Content: Too long, max is 512 characters'],
        },
        name: {
            type: String,
            required: true,
            minlength: [2, 'Name: must be at lest 3 characters'],
            maxlength: [512, 'Name: to long, max is 512 characters'],
        },
        site: {
            type: String,
            required: true,
            minlength: [2, 'Company Name: must be at lest 3 characters'],
            maxlength: [512, 'Phone Number: to long, max is 512 characters'],
        },
        tel: {
            type: String,
            maxlength: [13, 'Phone Number: is to long, max is 13 characters'],
        },
    },{ timestamps: true }
)

module.exports = mongoose.model('Form', schema)
