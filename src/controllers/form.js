import Form from '../models/Form'

class FormController {

  async getQuotes(ctx) {
    const perPage = 2
    const page = ctx.params.page || 1

    try {
      const quotes = await Form.find({})
        .skip(perPage * page - perPage)
        .limit(perPage)

      if (quotes.length <= 0) return ctx.throw(422, 'No quotes found!')

      const totalItems = await Form.countDocuments({})

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
    if (!quoteId) return ctx.throw(422, 'Ivalid data received!')

    try {
      const quote = await Form.findById(quoteId)
      ctx.body = quote
    } catch (error) {
      if( error.kind === "ObjectId") return ctx.throw(422, 'Invalid Quote ID')
      ctx.throw(422, error)
    }
  }
}

export default FormController
