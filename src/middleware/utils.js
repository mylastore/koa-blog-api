import crypto from 'crypto'
import sendGridMail from '@sendgrid/mail'

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

var utils = {}

//sendgrid
const appEmail = process.env.APP_EMAIL
const appUrl = process.env.REQUEST_HOST
const appName = process.env.APP_NAME


utils.accountActivationEmail = async function(ctx, email, token) {
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

utils.sendForgotPassword = async function(email, token) {
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

utils.sendNewUserEmail = async function(name, email) {
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

utils.sendQuoteEmail = async function(data) {
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

utils.sendAuthorEmail = async function(data) {
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

utils.gravatar = email => {
    const size = 200
    if (!email) return `https://gravatar.com/avatar/?s=${size}&d-mp`
    const md5 = crypto
        .createHash('md5')
        .update(email)
        .digest('hex')
    return `https://gravatar.com/avatar/${md5}?S=${size}&d=mp`
}

utils.parseJsonToObject = str => {
    try {
        const obj = JSON.parse(str)
        return obj
    } catch (error) {
        return {}
    }
}

utils.gravatar = email => {
    const size = 200
    if (!email) return `https://gravatar.com/avatar/?s=${size}%d=mp`
    const md5 = crypto
        .createHash('md5')
        .update(email)
        .digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=mp`
}

utils.isObjectEmpty = obj => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false
    }
    return true
}

module.exports = utils
