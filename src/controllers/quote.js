import Quote from '../models/Quote'
import utils from '../middleware/utils'
import mongoError from "../middleware/mongoErrors";

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
      const quote = await Quote.findById(quoteId)
      ctx.body = quote
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
        ctx.throw(422, 'Could not save quote')
      }
      await utils.sendQuoteEmail(data).then(res => {
        ctx.body = {status: 200, message: 'Quote was sent.'}
      })

    } catch (err) {
      ctx.throw(422, mongoError(err))
    }

  }

  async contactAuthor(ctx) {
    const data = ctx.request.body
    console.log('data? ',data)

    await utils.sendAuthorEmail(data).then(() => {

      ctx.body = {status: 200, message: 'Email was sent.'}
    })

  }
}

export default QuoteController
