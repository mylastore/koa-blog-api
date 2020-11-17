import fs from 'fs'
import path from 'path'
import dateFormat from './dateFormat'
import sharp from 'sharp'
import {isObjectEmpty} from './utils'

const BASE_DIR = 'upload/'

function mkDirByPathSync(targetDir, opts) {
  const isRelativeToScript = opts && opts.isRelativeToScript;
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
}

const uploadImages = async (ctx, next) => {
  const time = Date.parse(new Date())
  let date = dateFormat.dateFormat(time, 'yyyyMMddhhmmss')
  if (isObjectEmpty(ctx.request.files)) {
    return next()
  }

  let file = ctx.request.files.avatar
  const picReg = /\.(png|jpeg?g|gif|svg|webp|jpg)$/i;
  if (!picReg.test(file.name)) {
    ctx.throw(422, "File format not supported")
  }

  let fileName = file.name.replace(/\s/g, '').split('.').slice(0, -1).join('.')
  let target = BASE_DIR + 'img-' + date
  let galID = 'img-' + date
  let filePath = path.join(BASE_DIR, galID, fileName + '.webp') //Stitching file names
  let fileUrl = path.join(galID, fileName + '.webp')

  try {
    mkDirByPathSync(target)
    const result = await sharp(ctx.request.files.avatar.path)
      .resize(800, 400)
      .webp({quality: 80})
      .toFile(filePath)

    if (result) {
      ctx.request.files.avatar.path = {
        galID: galID,
        imgUrl: `http://localhost:8000/${fileUrl}`,
        imgName: fileName,
        imgSize: result.size
      }
    }
    return next()
  } catch (err) {
    ctx.throw(422, err)
  }
}

export default uploadImages