import jwt from 'jsonwebtoken'
import uniqueValidator from 'mongoose-unique-validator'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [2, 'Username minimum length is 2 characters'],
    maxlength: [32, "Username maximum length is 32 characters"],
    unique: true,
    index: true
  },
  name: {
    type: String,
    trim: true,
    minlength: [2, 'Name minimum length is 2 characters'],
    maxlength: [32, 'Name maximum length is 32 characters']
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email is not valid'],
    immutable: true
  },
  role: {type: String, default: 'user', immutable: true},
  password: {
    type: String,
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,50})$/, 'Password must be at least 6 characters and must contain 1 uppercase and 1 symbol'],
  },
  passwordResetToken: String,
  emailVerified: {type: Boolean, default: false},
  google: String,
  gender: {type: String, default: ''},
  location: {
    type: String,
    default: '',
    minlength: [2, 'Location minimum length is 2 characters'],
    maxlength: [60, 'Location maximum length is 60 characters']
  },
  about: {
    type: String,
    default: '',
    minlength: [2, 'About minimum length is 2 characters'],
    maxlength: [1000, 'Location maximum length is 1000 characters']
  },
  website: {
    type: String,
    default: '',
    match: [
      /^(?:[a-zA-Z0-9]+(?:\-*[a-zA-Z0-9])*\.)+[a-zA-Z0-9]{2,63}$/
      , "Website url is not valid"
    ]
  },
  avatar: {type: String, default: 'avatar.jpg'},
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
      username: this.username,
      xsrfToken: process.env.XSRF_TOKEN,
    },
    process.env.JWT_SECRET,
    {expiresIn: process.env.EXPIRES}
  )
}

userSchema.methods.toAuthJSON = function () {
  if (this.role === 'admin') {
    return {
      settings: this.settings,
      username: this.username,
      name: this.name,
      createdAt: this.createdAt,
      role: this.role,
      avatar: this.avatar,
      _id: this._id,
      token: this.generateJWT()
    }
  }
  return {
    username: this.username,
    name: this.name,
    createdAt: this.createdAt,
    role: this.role,
    _id: this._id,
    avatar: this.avatar,
    token: this.generateJWT()
  }
}
userSchema.plugin(uniqueValidator, {message: '{PATH} already exists.'})
export default mongoose.model('User', userSchema)
