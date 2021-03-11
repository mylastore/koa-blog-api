import User from '../models/User'
import Blog from '../models/Blog'
import Quote from '../models/Quote'
import utils from '../middleware/utils'
import _data from '../middleware/data'
import shortId from 'shortid'
import mongoError from '../middleware/mongoErrors'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import {
    validateEmail,
    validatePassword,
    validateRequired,
} from '../middleware/validate'

const passwordResetSecrete = process.env.JWT_PASSWORD_SECRET
const userActivationSecret = process.env.JWT_ACCOUNT_ACTIVATION
const sessionExpiration = process.env.EXPIRES

/**
 * User controller - Class
 * @category Api
 */
class UserController {
    async accountActivation(ctx) {
        const { name, email, password } = ctx.request.body
        const emailValid = validateEmail(email)
        const passwordValid = validatePassword(password)
        const nameValid = validateRequired(name)

        if (!emailValid || !passwordValid || !nameValid) {
            ctx.throw(422, 'Invalid data received')
        }

        try {
            const user = await User.findOne({ email })
            if (user) {
                ctx.throw(422, 'An active account already exist.')
            }
            const token = await jwt.sign(
                { name, email, password },
                userActivationSecret,
                { expiresIn: '30m' }
            )
            await utils.accountActivationEmail(ctx, email, token)
            return (ctx.body = {
                status: 200,
                message: `An email has been sent to ${email}. Please validate to activate account.`,
            })
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async register(ctx) {
        const { token } = ctx.request.body
        await jwt.verify(token, userActivationSecret, async function(
            err,
            decoded
        ) {
            if (err) {
                ctx.throw(401, {
                    message: 'Link is expired. Please signup again.',
                })
            }
            const { name, email, password } = decoded
            const avatar = utils.gravatar(email)
            const username = shortId.generate()
            const obj = {
                name,
                email,
                password,
                avatar,
                username,
                emailVerificationToken: undefined,
                emailVerified: true,
            }
            const user = new User(obj)

            try {
                const result = await user.save()
                const settingId = process.env.SETTING_ID
                const notification = process.env.SEND_MAIL

                if (result) {
                    // Here we are checking admin settings
                    // to see if we send the new user email notification to the admin ONLY
                    // this data is store in the root of this directory under .data/settings directory
                    await _data.read('settings', settingId, function(
                        err,
                        checkData
                    ) {
                        if (
                            !err &&
                            checkData &&
                            checkData.newUser === true &&
                            notification === 'yes'
                        ) {
                            utils.sendNewUserEmail(name, email)
                        }
                    })
                    ctx.body = {
                        status: 200,
                        message: 'Account is now active. Please login.',
                    }
                }
            } catch (err) {
                ctx.throw(422, err)
            }
        })
    }

    async login(ctx) {
        const { password, email } = ctx.request.body

        const passwordValid = validatePassword(password)
        const emailValid = validateEmail(email)
        if (!passwordValid || !emailValid) {
            ctx.throw(422, 'Invalid data received')
        }

        try {
            let user = await User.findOne({ email: email })
            if (!user) {
                ctx.throw(404, 'User not found.')
            }
            if (!(await user.comparePassword(password))) {
                ctx.throw(422, { message: 'Password is invalid' })
            }
            const authUser = user.toAuthJSON()
            ctx.cookies.set('token', authUser.token, {
                expiresIn: sessionExpiration,
                sameSite: 'lax',
                httpOnly: true,
            })
            return (ctx.body = authUser)
        } catch (error) {
            ctx.throw(422, error)
        }
    }

    async googleLogin(ctx) {
        const idToken = ctx.request.body.idToken
        const googleId = process.env.GOOGLE_ID
        const client = new OAuth2Client(googleId)
        try {
            const res = await client.verifyIdToken({
                idToken,
                audience: googleId,
            })
            if (!res) {
                ctx.throw(422, 'Google authentication failed. Try again.')
            }
            const { email_verified, name, email, at_hash } = res.getPayload()
            if (!email_verified) {
                ctx.throw(422, 'You have not verify this google email.')
            }
            const user = await User.findOne({ email })
            if (user) {
                const authUser = await user.toAuthJSON()
                await ctx.cookies.set('token', authUser.token, {
                    expiresIn: sessionExpiration,
                    sameSite: 'lax',
                    httpOnly: true,
                })
                return (ctx.body = authUser)
            } else {
                const avatar = await utils.gravatar(email)
                const username = await shortId.generate()
                const password = at_hash + process.env.GOOGLE_AUTH_PASSWORD_EXT
                const user = new User({
                    name,
                    email,
                    username,
                    password,
                    avatar,
                })
                const googleUser = await user.save()
                const googleAuthUser = await googleUser.toAuthJSON()
                ctx.cookies.set('token', googleAuthUser.token, {
                    expiresIn: sessionExpiration,
                    sameSite: 'lax',
                    httpOnly: true,
                })
                ctx.body = googleAuthUser
            }
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async logOut(ctx) {
        ctx.state.user = null
        ctx.cookies.set('token', null)
        ctx.body = { status: 200, message: 'Success!' }
    }

    async forgot(ctx) {
        const data = ctx.request.body
        const emailValid = validateEmail(data.email)
        if (!emailValid || !data.email) {
            ctx.throw(422, 'Email format is invalid')
        }

        try {
            const token = jwt.sign({}, passwordResetSecrete, {
                expiresIn: '30m',
            })
            let resetData = {
                passwordResetToken: token,
            }
            const user = await User.findOneAndUpdate(
                { email: data.email },
                resetData,
                { returnOriginal: false }
            )
            if (!user) {
                ctx.throw(422, 'Email not found.')
            }

            await utils.sendForgotPassword(user.email, token)
            ctx.body = { status: 200, message: `Email sent to ${user.email}` }
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async resetPassword(ctx) {
        const { passwordResetToken, password } = ctx.request.body
        const passwordValid = validatePassword(password)
        if (!passwordValid) {
            ctx.throw(
                422,
                'Password minimum length 8, must have 1 capital letter, 1 number and 1 special character.'
            )
        }

        await jwt.verify(
            passwordResetToken,
            passwordResetSecrete,
            async function(err, decoded) {
                if (err) {
                    ctx.throw(
                        401,
                        'Expired or invalid link! Please try to resetting your password again'
                    )
                }
                try {
                    let user = await User.findOne({
                        passwordResetToken: passwordResetToken,
                    })
                    if (!user) {
                        ctx.throw(
                            422,
                            'Password reset token is invalid or has expired.'
                        )
                    }
                    user.password = password
                    user.passwordResetToken = undefined

                    const res = await user.save()
                    if (res) {
                        ctx.body = {
                            status: 200,
                            message: 'Password was updated successfully.',
                        }
                    }
                } catch (err) {
                    ctx.throw(422, err)
                }
            }
        )
    }

    async updatePassword(ctx) {
        const { _id, password } = ctx.request.body
        try {
            const user = await User.findOne({ _id: _id })
            if (user) {
                user.password = password
                const res = await user.save()
                if (!res) {
                    ctx.throw(
                        422,
                        'Oops something went wrong, please try again.'
                    )
                }
                ctx.body = { status: 200, message: 'Password was updated.' }
            }
        } catch (err) {
            ctx.throw(422, mongoError(err))
        }
    }

    // if user is authorize sends the user data
    async account(ctx) {
        ctx.body = ctx.state.user
    }

    async getProfile(ctx) {
        const username = ctx.params.username
        await User.findOne({ username: username })
            .select(
                'username name email about website role location gender avatar createdAt'
            )
            .exec()
            .then(res => {
                ctx.body = res
            })
            .catch(err => {
                ctx.throw(422, err)
            })
    }

    async updateAccount(ctx) {
        const body = ctx.request.body
        if (body.username) {
            body.username.replace(/\s/g, '')
        }
        try {
            let exist = await User.exists({ username: body.username })
            if (exist) {
                ctx.throw(422, 'Username already exist, please choose another')
            }
            let user = await User.findOneAndUpdate(
                { username: ctx.params.username },
                body,
                {
                    new: true,
                    runValidators: true,
                    context: 'query',
                }
            )
            if (!user) {
                ctx.throw(404, 'User not found')
            }
            ctx.body = user.toAuthJSON()
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async deleteUser(ctx) {
        try {
            const userId = ctx.request.body._id
            const countBlogs = await Blog.countDocuments({ postedBy: userId })
            if (countBlogs > 0) {
                return (ctx.body = {
                    status: 422,
                    message:
                        'Before deleting your account you must delete all yours blogs.',
                })
            } else {
                const deleteUser = await User.deleteOne({ _id: userId })
                if (!deleteUser) {
                    ctx.throw(
                        422,
                        'Oops something went wrong, please try again.'
                    )
                }
                ctx.state.user = null
                ctx.cookies.set('token', null)
                ctx.body = { status: 200, message: 'Success!' }
            }
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async createQuote(ctx) {
        const data = ctx.request.body
        const quote = new Quote(data)
        const name = data.name
        const email = data.email
        const tel = data.tel || ''
        const site = data.site
        const msg = data.msg
        const reason = 'New Quote'
        try {
            const savedQuote = await quote.save()
            if (!savedQuote) {
                ctx.throw(
                    422,
                    'Quote could not be send. Please try again later.'
                )
            }
            utils.sendEmailQuote(name, email, tel, site, msg, reason)
            ctx.body = 'Success!'
        } catch (error) {
            ctx.throw(error)
        }
    }

    async sendEmail(ctx) {
        const data = ctx.request.body
        const name = data.name
        const email = data.email
        const tel = data.tel
        const site = data.site
        const msg = data.msg
        const reason = 'New Email'
        utils.sendEmail(name, email, tel, site, msg, reason, function(err) {
            if (err) {
                ctx.throw(422, 'Oops! something went wrong, please try again.')
            }
            ctx.body = 'Email was sent!'
        })
    }

    // ADMIN USER CONTROLLER
    async adminGetUsers(ctx) {
        const perPage = 2
        const page = ctx.params.page || 1
        try {
            const users = await User.find({})
                .select('-password')
                .skip(perPage * page - perPage)
                .limit(perPage)
            if (!users) {
                ctx.throw(422, 'Something went wrong, please try again.')
            }
            if (users.length <= 0) {
                ctx.throw(422, 'No users found!')
            }
            const totalItems = await User.countDocuments({})
            return (ctx.body = {
                totalItems: totalItems,
                perPage: perPage,
                users: users,
            })
        } catch (error) {
            ctx.throw(error)
        }
    }

    async adminGetUser(ctx) {
        try {
            const user = await User.findById({ _id: ctx.params.id }).select({
                profile: 1,
                email: 1,
                role: 1,
                avatar: 1,
                settings: 1,
                createdAt: 1,
                username: 1,
            })
            if (!user) {
                ctx.throw(422, 'Something went wrong, please try again.')
            }
            return (ctx.body = user)
        } catch (error) {
            return ctx.throw(error)
        }
    }

    async getStats(ctx) {
        try {
            ctx.body = await User.count({})
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    /**
     * update setting function
     * @param {number} userId user id
     * @param {boolean} newUser new user email true or false
     * @param {boolean} newQuote new quote email true or false
     *  @throws {Object} error
     *  @return {Object} user object
     */
    async updateSettings(ctx) {
        try {
            const userData = ctx.request.body
            const userId = userData.userId
            if (!userData) ctx.throw(422, 'Invalid data!')
            const obj = {
                settings: {
                    newUser: userData.newUser,
                    newQuote: userData.newQuote,
                },
            }
            const user = await User.findByIdAndUpdate({ _id: userId }, obj, {
                new: true,
            })
            if (!user) ctx.throw(422, 'User not found!')
            const settingId = process.env.SETTING_ID

            if (user && settingId) {
                const settingsObject = {
                    settingId: settingId,
                    newUser: userData.newUser,
                    newQuote: userData.newQuote,
                }
                // Update local settings file
                _data.update('settings', settingId, settingsObject, function(
                    err
                ) {
                    if (err) {
                        ctx.throw(422, 'Could not update settings.')
                    }
                })
                ctx.body = user.toAuthJSON(ctx)
            }
        } catch (error) {
            ctx.throw(error)
        }
    }

    // public users
    async publicProfile(ctx) {
        const username = ctx.params.username
        let user
        let blogs

        await User.findOne({ username })
            .select('_id username name email avatar createdAt')
            .exec()
            .then(res => {
                if (!res) {
                    ctx.throw(422, 'Oops! something is wrong. Try later.')
                }
                user = res
            })
            .then(async () => {
                await Blog.find({ postedBy: user._id })
                    .populate('categories', 'name slug')
                    .populate('tags', 'name slug')
                    .populate('postedBy', 'id name')
                    .select(
                        'title slug excerpt categories avatar tags postedBy createdAt'
                    )
                    .exec()
                    .then(res => {
                        blogs = res
                        ctx.body = { user, blogs }
                    })
            })
            .catch(err => {
                ctx.throw(422, err)
            })
    }
}

export default UserController
