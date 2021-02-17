import Router from 'koa-router'
import auth from '../middleware/auth'
import AuthController from '../controllers/auth'

const controller = new AuthController()
const router = new Router()

router.get('/api/auth', auth.isUser, async ctx => {
    await controller.auth(ctx)
})

router.get('/api/ping', auth.isUser, async ctx => {
    await controller.ping(ctx)
})

export default router
