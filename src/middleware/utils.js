import crypto from 'crypto'
import sendGridMail from '@sendgrid/mail'
import path from 'path'
import fs from 'fs'

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

//sendgrid
const appEmail = process.env.APP_EMAIL
const appUrl = process.env.REQUEST_HOST
const appName = process.env.APP_NAME

export async function newAppointment(data) {
    const payload = {
        from: data.email,
        to: appEmail,
        subject: `Booking Request @ ${appName}`,
        template_id: 'd-c08d32e1cd5142048fdd91094f1d672d',
        dynamic_template_data: {
            name: data.name,
            email: data.email,
            address: data.address,
            phone: data.phone,
            additionalInfo: data.additionalInfo,
            appointmentDate: data.appointmentDate,
            time: data.time,
        },
    }
    await sendGridMail
        .send(payload)
        .then(res => {
            console.log('res', res)
        })
        .catch(err => {
            console.error(err)
        })
}

export async function accountActivationEmail(ctx, email, token) {
    const link = `${appUrl}/user/activation/${token}`
    const data = {
        to: email,
        from: appEmail,
        subject: 'Account Activation',
        html: `
            <strong>Welcome to  ${appName}.<br/><br/> Please click on the button below to activate your account. If you did not request this, please ignore this email.<br/><br/></strong>
            <a href="${link}">ACCOUNT ACTIVATION LINK</a>
          `,
    }
    await sendGridMail
        .send(data)
        .then(res => {
            console.log('res', res)
        })
        .catch(err => {
            console.error(err)
        })
}

export async function sendForgotPassword(email, token) {
    const link = `${appUrl}/user/reset/${token}`
    const msg = {
        to: email,
        from: appEmail, // Change to your verified sender
        subject: 'Password reset link',
        html: `
            <strong>You are receiving this email because you (or someone else) have requested the reset of the password for your account @${appName}.<br/><br/> Please click on the button below to complete the process. If you did not request this, please ignore this email and your password will remain unchanged.<br/><br/></strong>
            <a href="${link}">PASSWORD RESET LINK</a>
          `,
    }
    await sendGridMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch(err => {
            console.error(err)
        })
}

export async function sendNewUserEmail(name, email) {
    const msg = {
        to: appEmail,
        from: appEmail, // Change to your verified sender
        subject: `New user created @${appName}`,
        html: `
            <strong>New user was created @${appName}<br/></strong><br/>
            <p>${name}</p>    
            <p>${email}</p>    
          `,
    }
    await sendGridMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch(err => {
            console.error(err)
        })
}

export async function sendQuoteEmail(data) {
    let { name, email, message, phone, website } = data
    if (name && email && message) {
        const data = {
            to: appEmail,
            from: email,
            subject: `Quote request from ${appName}`,
            template_id: 'd-0b3e1c50e75d40efab0963a73188f77b',
            dynamic_template_data: {
                name: name,
                email: email,
                message: message,
                phone: phone,
                website: website,
                appUrl: appUrl,
                appName: appName,
            },
        }
        await sendGridMail
            .send(data)
            .then(() => {
                console.log('Quote was sent')
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export async function sendAuthorEmail(data) {
    let { name, email, message, authorEmail } = data
    const emailList = [authorEmail]

    const emailData = {
        to: emailList,
        from: email,
        subject: `Someone message you from ${appName}`,
        text: `Message received from:  \n Name: ${name} \n Email: ${email} \n Message: ${message}`,
        template_id: 'd-db32c2ca9cf94a47ac47f403a7778db2',
        dynamic_template_data: {
            name: name,
            email: email,
            message: message,
            appUrl: appUrl,
            appName: appName,
        },
    }
    await sendGridMail
        .send(emailData)
        .then(() => {
            console.log('Email to author sent')
        })
        .catch(err => {
            console.error(err)
        })
}

export function gravatar(email) {
    const size = 200
    if (!email) return `https://gravatar.com/avatar/?s=${size}&d-mp`
    const md5 = crypto
        .createHash('md5')
        .update(email)
        .digest('hex')
    return `https://gravatar.com/avatar/${md5}?S=${size}&d=mp`
}

export function parseJsonToObject(str) {
    try {
        const obj = JSON.parse(str)
        return obj
    } catch (error) {
        return {}
    }
}

export function mkDirByPathSync(targetDir, opts) {
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

export async function rmdir(dirPath, options = {}) {
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
