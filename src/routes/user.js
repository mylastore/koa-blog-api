import Router from 'koa-router'
import auth from '../middleware/auth'
import UserController from '../controllers/user'

const router = new Router()

router.get('/', async (ctx, next) => {
    ctx.body = { message: 'Hi there. ' + process.env.NPM_PACKAGE_VERSION }
})

const userController = new UserController()

router.post('/api/user/register', async (ctx, next) => {
    await userController.register(ctx)
})

router.post('/api/user/login', async (ctx, next) => {
    await userController.login(ctx)
})

router.post('/api/user/logout', async (ctx, next) => {
    await userController.logOut(ctx)
})

router.post('/api/user/forgot', async (ctx, next) => {
    await userController.forgot(ctx)
})

router.post('/api/user/reset-password', async (ctx, next) => {
    await userController.resetPassword(ctx)
})

router.post('/api/user/update-password', auth.isUser, async (ctx, next) => {
    await userController.updatePassword(ctx)
})

router.post('/api/user/account', auth.isUser, async (ctx, next) => {
    await userController.account(ctx)
})

router.get('/api/user/profile/:username', auth.isUser, async (ctx, next) => {
    await userController.getProfile(ctx)
})

router.get('/api/user/account/:username', async (ctx, next) => {
    await userController.publicProfile(ctx)
})

router.patch('/api/user/account/:username', auth.isUser, async (ctx, next) => {
    await userController.updateAccount(ctx)
})

router.post('/api/user/username/:username', auth.isUser, async ctx => {
    await userController.updateUserName(ctx)
})

router.post('/api/user/delete', auth.isUser, async (ctx, next) => {
    await userController.deleteUser(ctx)
})

router.post('/api/quote', async (ctx, next) => {
    await userController.createQuote(ctx)
})

// ADMIN USER ROUTES
router.post('/api/user/settings/:username', auth.isAdmin, async (ctx, next) => {
    await userController.getAdminSettings(ctx)
})

router.get('/api/admin/users/:page', auth.isAdmin, async (ctx, next) => {
    await userController.adminGetUsers(ctx)
})

router.get('/api/admin/user/:id', auth.isAdmin, async (ctx, next) => {
    await userController.adminGetUser(ctx)
})

router.patch('/api/admin/update-settings', auth.isAdmin, async (ctx, next) => {
    await userController.updateSettings(ctx)
})

router.get('/api/admin/stats', auth.isAdmin, async (ctx, next) => {
    await userController.getStats(ctx)
})

router.post('/api/user/account-activation', async (ctx, next) => {
    await userController.accountActivation(ctx)
})

router.post('/api/user/google-login', async ctx => {
    await userController.googleLogin(ctx)
})

export default router
