import sharp from 'sharp'
import {isObjectEmpty} from '../validate'
import makeDir from './makeDir'
import path from 'path'

const BASE_DIR = 'upload/'
const APP_URL = process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.PRODUCTION_URL

const uploadImages = async (ctx, next) => {
  if (isObjectEmpty(ctx.request.files)) {
    return next()
  }
  const body = ctx.request.body

  let galleryID = body.galleryID
  let defaultImg = body.defaultImg
  
  let target = BASE_DIR + galleryID
  let thumbTarget = BASE_DIR + galleryID + "/thumbs/"

  ctx.request.body.images = []
  ctx.request.body.thumbs = []

  try {
    await makeDir(target)
    await makeDir(thumbTarget)

    await Promise.all(
      ctx.request.files.images.map(async (file, i) => {
        let fileName = file.name.replace(/\.[^.$]+$/, '');

        let filePath = path.join(BASE_DIR, galleryID + "/" + fileName + '.jpg')
        let fileUrl = APP_URL + BASE_DIR + galleryID + "/" + fileName + '.jpg'

        let thumbPath = path.join(thumbTarget, "thumb-" + fileName + '.jpg')
        let thumbUrl = thumbTarget + "/thumb-" + fileName + '.jpg'

        ctx.request.body.images.push(fileUrl)
        ctx.request.body.thumbs.push(thumbUrl)
        
        if (defaultImg === file.name) {
            ctx.request.body.defaultImg = APP_URL + fileUrl
        } 

        await sharp(file.path).resize(800).jpeg({quality: 90}).toFile(filePath)
        await sharp(file.path).resize(200).jpeg({quality: 80}).toFile(thumbPath)
          
      })
    )

    return next()
  } catch (err) {
    ctx.throw(422, err)
  }
}

export default uploadImages
