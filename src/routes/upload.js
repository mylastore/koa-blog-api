import Router from 'koa-router'
import UploadController from '../controllers/upload'
import galleryUpload from '../middleware/upload/galleryUpload'
import imageUpload from '../middleware/upload/upload'

const router = new Router()

const uploadController = new UploadController()

router.post('/api/upload', galleryUpload, async (ctx, next) => {
    await uploadController.upload(ctx)
})

router.post('/api/upload/image', imageUpload, async (ctx, next) => {
    await uploadController.imageUpload(ctx)
})


export default router
