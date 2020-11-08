const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quoteSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      minlength: [2, 'Name: must be at lest 3 characters'],
      maxlength: [512, 'Name: to long, max is 512 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    message: {
      type: String,
      required: [true, 'Message is required.'],
      minlength: [2, 'Content: must be at lest 3 characters'],
      maxlength: [512, 'Content: Too long, max is 512 characters'],
    },
    phone: {
      type: String,
      maxlength: [17, 'Phone Number: is to long, max is 17 characters'],
      match: [/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/]
    },
    company: {
      type: String,
      minlength: [2, 'Company Name: must be at lest 2 characters'],
      maxlength: [512, 'Phone Number: to long, max is 512 characters'],
    }

  }, {timestamps: true}
)

module.exports = mongoose.model('Quote', quoteSchema)
