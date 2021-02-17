import Router from 'koa-router'
import InstagramController from '../controllers/instagram'

const controller = new InstagramController()
const route = new Router()

route.get('/api/insta', async (ctx, next) => {
    await controller.authorizeUser(ctx)
})

route.post('/api/insta', async (ctx, next) => {
    await controller.getUserAccessToken(ctx)
})

export default route
