import Router from 'koa-router'
import auth from '../middleware/auth'
import CategoryController from '../controllers/category'

//Initial controller once for all routes
const controller = new CategoryController()

// const jwtMiddleware = jwt()
const router = new Router()

router.post('/api/category', auth.isUser, async (ctx, next) => {
    await controller.createCategory(ctx)
})

router.get('/api/category', async (ctx, next) => {
    await controller.getCategories(ctx)
})

router.get('/api/category/:slug', async (ctx, next) => {
    await controller.getCategory(ctx)
})

router.delete('/api/category/:slug', auth.isAdmin, async (ctx, next) => {
    await controller.deleteCategory(ctx)
})

export default router
