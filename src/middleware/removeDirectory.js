let rmdir = async (dirPath, options = {}) => {
    const { removeContentOnly = false, drillDownSymlinks = false } = options,
        { promisify } = require('util'),
        path = require('path'),
        fs = require('fs'),
        readdirAsync = promisify(fs.readdir),
        unlinkAsync = promisify(fs.unlink),
        rmdirAsync = promisify(fs.rmdir),
        lstatAsync = promisify(fs.lstat) // fs.lstat can detect symlinks, fs.stat can't
    let files

    try {
        files = await readdirAsync(dirPath)
    } catch (e) {
        throw new Error(e)
    }

    if (files.length) {
        for (let fileName of files) {
            let filePath = path.join(dirPath, fileName),
                fileStat = await lstatAsync(filePath),
                isSymlink = fileStat.isSymbolicLink(),
                isDir = fileStat.isDirectory()

            if (isDir || (isSymlink && drillDownSymlinks)) {
                await rmdir(filePath)
            } else {
                await unlinkAsync(filePath)
            }
        }
    }

    if (!removeContentOnly) await rmdirAsync(dirPath)
}

export default rmdir
