import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema({
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
  },
  { timestamps: true })

schema.plugin(uniqueValidator, { message: '{PATH} already exist.' })
export default mongoose.model('Category', schema)
