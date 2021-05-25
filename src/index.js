'use strict'
// @ts-check

import Koa from 'koa'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import cors from 'kcors'
import { logger } from './logs/logs'
import userAgent from 'koa-useragent'
import ratelimit from 'koa-ratelimit'
import redis from 'ioredis'
import mongoose from 'mongoose'
import helmet from 'koa-helmet'
import koaJsonError from 'koa-json-error'

//Routes
import userRouter from './routes/user'
import quoteRouter from './routes/quote'
import categoryRouter from './routes/category'
import tagRouter from './routes/tag'
import blogRouter from './routes/blog'
import authRouter from './routes/auth'
import instaRouter from './routes/instagram'

const mongoDB = process.env.DB_URI

/**
 * Connection to mongo db
 * @param {object} options
 * @param {string} options.url - database url
 * @param {object} options
 * @param {Boolean} options.true - useCreateIndex true
 * @return {Promise<string>} Console log database connection
 */

mongoose
    .connect(
        mongoDB,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    )
    .then(() => console.log('DB: ', mongoDB))
    .catch(err => console.log(err))

//Initialize app
const app = new Koa()
require('koa-qs')(app, 'extended')

app.use(helmet())

// //Here's the rate limiter
// app.use(
//     ratelimit({
//         db: new redis(),
//         duration: 60000,
//         errorMessage:
//             "Hmm, you seem to be doing that a bit too much - wouldn't you say?",
//         id: ctx => ctx.ip,
//         headers: {
//             remaining: 'Rate-Limit-Remaining',
//             reset: 'Rate-Limit-Reset',
//             total: 'Rate-Limit-Total',
//         },
//         max: 100,
//     })
// )

//Let's log each successful interaction. We'll also log each error - but not here,
//that's be done in the json error-handling middleware
app.use(async (ctx, next) => {
    try {
        await next()
        logger.info(
            ctx.method + ' ' + ctx.url + ' RESPONSE: ' + ctx.response.status
        )
    } catch (error) {}
})

// Apply error json handling
const errorOptions = {
    postFormat: (e, obj) => {
        // Here's where we'll stick our error logger.
        logger.info(obj)
        if (process.env.NODE_ENV !== 'production') {
            return obj
        }
        delete obj.stack
        delete obj.name
        return obj
    },
}
app.use(koaJsonError(errorOptions))

// return response time in X-Response-Time header
app.use(async function responseTime(ctx, next) {
    const t1 = Date.now()
    await next()
    const t2 = Date.now()
    ctx.set('X-Response-Time', Math.ceil(t2 - t1) + 'ms')
})

//For cors with options
app.use(
    cors({
        origins: [
            `${process.env.REQUEST_HOST}`,
        ],
    })
)

//For useragent detection
app.use(userAgent)

app.use(
    koaBody({
        formLimit: '1mb',
        multipart: true, // Allow multiple files to be uploaded
        formidable: {
            maxFileSize: 5 * 1024 * 1024, // max size 5mb
            keepExtensions: true, //  Extensions to save images
            onFileBegin: (name, file) => {
                const fileName = file.name
                const picReg = /\.(png|jpeg?g|gif|svg|webp|jpg)$/i
                if (!picReg.test(fileName)) {
                    new Error('File not supported')
                }
            },
            onEnd: (name, file) => {
                console.log('name? ', name)
                console.log('size.size ? ', file.size)
            },
        },
        onError: err => {
            if (err) {
                throw err
            }
            new Error('Oops! something went wrong. Try again.')
        },
    })
)

// Configuring Static Resource Loading Middleware
app.use(koaStatic('./public'))
app.use(koaStatic('./upload'))

//For router
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.use(quoteRouter.routes())
app.use(quoteRouter.allowedMethods())
app.use(categoryRouter.routes())
app.use(categoryRouter.allowedMethods())
app.use(tagRouter.routes())
app.use(tagRouter.allowedMethods())
app.use(blogRouter.routes())
app.use(blogRouter.allowedMethods())
app.use(authRouter.routes())
app.use(authRouter.allowedMethods())
app.use(instaRouter.routes())
app.use(instaRouter.allowedMethods())

export default app
