import fs from 'fs'
import path from 'path'
import dateFormat from './dateFormat'
import sharp from 'sharp'
import { isObjectEmpty } from './validate'

const BASE_DIR = 'upload/'

function mkDirByPathSync(targetDir, opts) {
    const isRelativeToScript = opts && opts.isRelativeToScript
    const sep = path.sep
    const initDir = path.isAbsolute(targetDir) ? sep : ''
    const baseDir = isRelativeToScript ? __dirname : '.'

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir)
        try {
            fs.mkdirSync(curDir)
        } catch (err) {
            if (err.code === 'EEXIST') {
                // curDir already exists!
                return curDir
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows
            if (err.code === 'ENOENT') {
                // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(
                    `EACCES: permission denied, mkdir '${parentDir}'`
                )
            }

            const caughtErr =
                ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1
            if (
                !caughtErr ||
                (caughtErr && curDir === path.resolve(targetDir))
            ) {
                throw err // Throw if it's just the last created dir.
            }
        }

        return curDir
    }, initDir)
}

const uploadImages = async (ctx, next) => {
    const time = Date.parse(new Date())
    let date = dateFormat.dateFormat(time, 'yyyyMMddhhmmss')
    if (isObjectEmpty(ctx.request.files)) {
        return next()
    }

    let target = BASE_DIR + 'img-' + date
    let galID = 'img-' + date
 

    ctx.request.body.images = []

    try {
        mkDirByPathSync(target)

        await Promise.all(
            ctx.request.files.avatar.map(async (file, i) => {
                let filePath = path.join(BASE_DIR, galID, file.name + '.webp') //Stitching file names
                let fileUrl = path.join(galID, file.name + '.webp')    
       
          
             await sharp(file.path)
              .resize(700, 800)
              .toFormat('jpeg')
              .jpeg({ quality: 90 })
              .toFile(filePath);
          
             ctx.request.body.images.push(fileUrl);
            })
           );
          

        // const result = await sharp(ctx.request.files.avatar.path)
        //     .resize(800, 400)
        //     .webp({ quality: 80 })
        //     .toFile(filePath)

        // if (result) {
        //     ctx.request.files.avatar.path = {
        //         galID: galID,
        //         imgUrl: `http://localhost:8000/${fileUrl}`,
        //         imgName: fileName,
        //         imgSize: result.size,
        //     }
        // }
        return next()
    } catch (err) {
        ctx.throw(422, err)
    }
}

export default uploadImages
