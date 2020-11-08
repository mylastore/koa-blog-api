import Router from 'koa-router'
import auth from '../middleware/auth'

import QuoteController from '../controllers/quote'

const router = new Router()

//Initial controller once for all routes
const quoteController = new QuoteController()

router.get('/api/admin/quotes/:page', auth.isAdmin, async (ctx, next) => {
    await quoteController.getQuotes(ctx)
})

router.get('/api/admin/quote/:id', auth.isAdmin, async (ctx, next) => {
    await quoteController.getQuote(ctx)
})

router.post('/api/admin/quote', async (ctx, next) => {
    await quoteController.saveQuote(ctx)
})

router.post('/api/contact-author', async (ctx, next) => {
    await quoteController.contactAuthor(ctx)
})

export default router
