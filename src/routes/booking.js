import Router from 'koa-router'
import BookingController from '../controllers/booking'

const router = new Router()
const controller = new BookingController()

router.get('/api/booking/:date', async ctx => {
    await controller.getBookingByDate(ctx)
})

router.post('/api/booking', async ctx => {
    await controller.bookingPost(ctx)
})

export default router
