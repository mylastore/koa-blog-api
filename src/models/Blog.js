import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const { ObjectId } = mongoose.Schema
const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            minlength: [3, 'Title must be at least 3 characters.'],
            maxlength: [160, 'Title maximum number of characters is 160'],
            required: [true, 'Tile is required'],
        },
        visited: {
            type: Number,
            default: 0,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        content: {
            type: String,
            minlength: [200, 'Content minimum number of characters is 200'],
            maxlength: [
                500000,
                'Content maximum number of characters is 500,000',
            ],
            required: [true, 'Content is required'],
        },
        excerpt: {
            type: String,
            maxlength: [1000, 'Excerpt max number of characters is 1,000'],
        },
        metaTitle: {
            type: String,
        },
        metaDescription: {
            type: String,
        },
        avatar: {
            type: String,
        },
        galID: [
            {
                type: String,
            },
        ],
        imgID: String,
        categories: [
            {
                type: ObjectId,
                ref: 'Category',
                required: [true, 'Categories is required'],
            },
        ],
        tags: [
            {
                type: ObjectId,
                ref: 'Tag',
                required: [true, 'Tags is required'],
            },
        ],
        postedBy: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },
        published: { type: Boolean, default: false },
    },
    { timestamps: true }
)

schema.plugin(uniqueValidator, { message: '{PATH} already exists.' })
schema.index(
    { title: 'text', content: 'text' },
    { weights: { title: 1, content: 2 } }
)

export default mongoose.model('Blog', schema)
