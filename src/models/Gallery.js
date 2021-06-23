import mongoose from 'mongoose'

const Schema = mongoose.Schema

const gallerySchema = new Schema(
    {
        name: [{ type: String }],
        images: [{type: String}],
        thumbs: [{type: String}],
        default: {type: String}
    },
    { timestamps: true }
)

export default mongoose.model('Gallery', gallerySchema)
