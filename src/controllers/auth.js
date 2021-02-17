class AuthController {
    async auth(ctx) {
        ctx.body = { status: 200, message: 'All clear' }
    }

    async ping(ctx) {
        ctx.body = { status: 200, message: 'Pong' }
    }
}

export default AuthController
