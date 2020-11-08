/*
    File upload
 */
const fs = require('fs');
const path = require('path');
const dateFormat = require('../middleware/dateFormat.js')
const sharp = require('sharp')
const conf = {
  BASE_DIR: 'upload/',
  MAXFILESIZE: 200 * 1024 * 1024, //Upload file size
}
const { isObjectEmpty } = require('../middleware/utils')

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


//Save file
const saveFile = (file, path) => {
  return new Promise((resolve, reject) => {
    let render = fs.createReadStream(file);
    // Create a write stream
    let upStream = fs.createWriteStream(path);
    render.pipe(upStream);
    upStream.on('finish', () => {
      resolve(path)
    });
    upStream.on('error', (err) => {
      reject(err)
    });
  })
}
/**
 * File upload
 * ps Generate file name
 * File paths are stored according date and time
 */
const uploadImg = async (ctx, next) => {
  const time = Date.parse(new Date())
  let date = dateFormat.dateFormat(time, 'yyyyMMddhhmmss');
  if(isObjectEmpty(ctx.request.files) ){
    return next()
  }

  let file = ctx.request.files.avatar


  let fileName = file.name.replace(/\s/g, '').split('.').slice(0, -1).join('.')
  let target = conf.BASE_DIR + date
  let filePath = path.join(conf.BASE_DIR, date, fileName + '.webp') //Stitching file names
  let imgID = path.join(date)
  let avatarUrl = path.join(date, fileName + '.webp')

  try{
    await mkDirByPathSync(target) //Create a file directory
    const output = await saveFile(file.path, filePath)

    await sharp(ctx.request.files.avatar.path)
      .resize(1080, 200)
      .toFile(output, (err, info) => {
        if(err){
          ctx.throw(422, err)
        }
        console.log('image was resize and converted to webp')
      })

    let imgObj = {
      imgID: imgID,
      avatarUrl: avatarUrl
    }
    ctx.request.files.avatar.path = imgObj
    return next()
  }catch (e){
    ctx.throw(422, {message: 'Failed to upload file'})
  }
}

module.exports = {
  uploadImg
};