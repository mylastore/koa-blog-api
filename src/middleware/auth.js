import jsonwebtoken from 'jsonwebtoken'
import User from '../models/User'
import Blog from '../models/Blog'

let auth = {}
let role

async function getJwtToken(ctx, next) {
    if (!ctx.header || !ctx.header.authorization) {
        return
    }
    const parts = ctx.header.authorization.split(' ')
    if (parts.length === 2) {
        const scheme = parts[0]
        const credentials = parts[1]
        if (/^Bearer$/i.test(scheme)) {
            return credentials
        }
    }
}

async function validateJWT(ctx, next) {
    const secret = process.env.JWT_SECRET
    const token = await getJwtToken(ctx)

    if (!secret || !token)
        ctx.throw(401, { message: 'Access to resource not allow' })
    //jsonwebtoken.verify also checks for expiration
    await jsonwebtoken.verify(token, secret, async (err, decoded) => {
        if (err) {
            ctx.throw(440, 'Session has expired.')
        } else {
            const user = await User.findOne({ _id: decoded._id })
            if (!user) {
                ctx.throw(404, 'User not found.')
            }
            ctx.state.user = user.toAuthJSON()
            role = decoded.role
        }
    })
}

auth.isUser = async (ctx, next) => {
    await validateJWT(ctx)
    try {
        if (role) {
            return next()
        }
        ctx.throw(401, { message: 'Not sufficient permissions' })
    } catch (error) {
        ctx.throw(error)
    }
}

auth.isAdmin = async (ctx, next) => {
    await validateJWT(ctx)
    try {
        if (role === 'admin') {
            return next()
        }
        ctx.throw(401, { message: 'Not sufficient permissions' })
    } catch (error) {
        ctx.throw(401, error)
    }
}

auth.isBlogAuthor = async (ctx, next) => {
    const slug = ctx.params.slug
    const user = await Blog.findOne({ slug: slug }).select('postedBy')
    if (!user) {
        ctx.throw(404, 'Only author can perform this operation.')
    }
    const postedById = user.postedBy._id.toString()
    const currentUserId = ctx.state.user._id.toString()
    const isAuthor = postedById === currentUserId

    if (!isAuthor) {
        ctx.throw(401, 'You are not authorize to perform this action.')
    } else {
        return next()
    }
}

export default auth
