import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        token: { type: String, required: true },
    },
    { timestamps: true }
)

module.exports = mongoose.model('InstagramToken', schema)
