import mongoose from 'mongoose'

const schema = mongoose.Schema(
    {
        name: String,
        phoneNumber: String,
        email: String,
        address: String,
        additionalInfo: String,
        bookingDay: {
            type: String,
        },
        time: Number,
        type: String, //AM or PM,
        nextTime: Number, //next hour
        nextType: String, //AM or PM of next hour
    },
    { timestamps: true }
)

export default mongoose.model('Booking', schema)
