
class UploadController {

    async upload(ctx) {
        console.log(ctx.request.body)
        ctx.body = { status: 200, message: 'Uploaded' }
    }

    async imageUpload(ctx) {
        console.log(ctx.request.body)
        ctx.body = { status: 200, message: 'Uploaded' }
    }


}

export default UploadController