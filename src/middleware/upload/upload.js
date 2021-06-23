import path from 'path'
import sharp from 'sharp'
import { isObjectEmpty } from '../validate'
import makeDir from '../upload/makeDir'
import {nanoid} from 'nanoid'

const BASE_DIR = 'upload/'

/**
 * Single image upload
 * Image name nanoid(10) plus file name
 * Image directory are stored according year and month
 */
const uploadImg = async (ctx, next) => {
    if (isObjectEmpty(ctx.request.files)) {
        return next()
    }

    const date = new Date()
    const year = date.getFullYear() + '/'
    const month = date.getMonth() + 1 + '/'

    let file = ctx.request.files.image
    let fileName = nanoid(10) + "-" + file.name.replace(/\.[^.$]+$/, '');
    let target = BASE_DIR + year + month
    let filePath = path.join(target, fileName + '.jpg') //Stitching file names
    let imgURL = target + fileName + '.jpg'

    try {
        await makeDir(target)
        await sharp(ctx.request.files.image.path)
            .resize(900)
            .jpeg({ quality: 80 })
            .toFile(filePath)

        ctx.request.body.imgURL = imgURL
        return next()
    } catch (err) {
        ctx.throw(422, err)
    }
}

export default uploadImg
