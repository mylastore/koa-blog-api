import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [2, 'Username must be at least 2 characters'],
    maxlength: [32, "Username can't be longer then 32 characters"],
    unique: true,
    index: true
  },
  name: {
    type: String,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [32, 'Name can not be longer then 32 characters']
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email is not valid.'],
    immutable: true
  },
  role: {type: String, default: 'user', immutable: true},
  password: {
    type: String,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,50})$/, 'Password must be at least 6 characters and must contain 1 uppercase and 1 symbol.'],
  },
  passwordResetToken: String,
  emailVerified: {type: Boolean, default: false},
  google: String,
  gender: {type: String, default: ''},
  location: {type: String, default: ''},
  about: {
    type: String,
    minlength: [5, "About must be at least 5 characters."],
    maxlength: [500, "About can't be more then 500 characters."]
  },
  website: {
    type: String,
    default: '',
    match: [
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
      , "Website url format is incorrect."
    ]
  },
  avatar: String,
  settings: {
    newUser: {type: Boolean, default: false},
    newQuote: {type: Boolean, default: false},
  },

}, {timestamps: true})

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


//Every user have aces to this methods
userSchema.methods.comparePassword = async function (rawPassword) {
  return await bcrypt.compare(rawPassword, this.password)
}

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      xsrfToken: process.env.XSRF_TOKEN,
    },
    process.env.JWT_SECRET,
    {expiresIn: process.env.EXPIRES}
  )
}

userSchema.methods.toAuthJSON = function () {
  if (this.role === 'admin') {
    return {
      _id: this._id,
      role: this.role,
      email: this.email,
      name: this.name,
      about: this.about,
      website: this.website,
      location: this.location,
      avatar: this.avatar,
      username: this.username,
      createdAt: this.createdAt,
      settings: this.settings,
      token: this.generateJWT()
    }
  }
  return {
    _id: this._id,
    role: this.role,
    email: this.email,
    name: this.name,
    about: this.about,
    website: this.website,
    location: this.location,
    avatar: this.avatar,
    username: this.username,
    createdAt: this.createdAt,
    token: this.generateJWT()
  }
}
userSchema.plugin(uniqueValidator, {message: '{PATH} already exists.'})
export default mongoose.model('User', userSchema)
