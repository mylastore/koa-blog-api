import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Category name is required'],
            minlength: [2, 'Tag must be at least 2 characters.'],
            maxlength: [32, 'Tag name max characters length is 32.'],
        },
        slug: {
            type: String,
            unique: true,
            index: true,
            required: [true, 'Slug is required'],
        },
    },
    { timestamps: true }
)

schema.plugin(uniqueValidator, { message: '{PATH} already exist.' })
export default mongoose.model('Tag', schema)
