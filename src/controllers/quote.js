import Quote from '../models/Quote'
import utils from '../middleware/utils'
import mongoError from "../middleware/mongoErrors"
import {validateEmail, validateRequired} from "../middleware/validate"

class QuoteController {

  async getQuotes(ctx) {
    const perPage = 2
    const page = ctx.params.page || 1

    try {
      const quotes = await Quote.find({})
        .skip(perPage * page - perPage)
        .limit(perPage)

      if (quotes.length <= 0) return ctx.throw(422, 'No quotes found!')

      const totalItems = await Quote.countDocuments({})

      ctx.body = {
        totalItems: totalItems,
        perPage: perPage,
        quotes: quotes,
      }
    } catch (error) {
      ctx.throw(422, error)
    }
  }

  async getQuote(ctx) {
    const quoteId = ctx.params.id
    if (!quoteId) return ctx.throw(422, 'Invalid data received!')
    try {
      ctx.body = await Quote.findById(quoteId)
    } catch (error) {
      if (error.kind === "ObjectId") return ctx.throw(422, 'Invalid Quote ID')
      ctx.throw(422, error)
    }
  }

  async saveQuote(ctx) {
    const data = ctx.request.body

    if (!data.company) {
      data.company = undefined
    }
    if (!data.phone) {
      data.phone = undefined
    }

    try {
      const quote = await new Quote(data).save()
      if (!quote) {
        console.log('Could not save quote')
      }
      await utils.sendQuoteEmail(data).then(res => {
        ctx.body = {status: 200, message: 'Form was sent.'}
      })
    } catch (err) {
      ctx.throw(422, mongoError(err))
    }

  }

  async contactAuthor(ctx) {
    const data = ctx.request.body
    const emailValid = validateEmail(data.email)
    const authorEmailValid = validateEmail(data.authorEmail)

    if(!emailValid || !authorEmailValid){
      ctx.throw(422, "Invalid email format")
    }
    const validName = validateRequired(data.name)
    const validMessage = validateRequired(data.message)
    if(!validName || !validMessage){
      ctx.throw(422, 'Missing required data')
    }
    await utils.sendAuthorEmail(data).then(() => {
      ctx.body = {status: 200, message: 'Email was sent.'}
    })
  }

}

export default QuoteController
