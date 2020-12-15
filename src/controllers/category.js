import Category from '../models/Category'
import Blog from '../models/Blog'
import slugify from 'slugify'
import mongoError from "../middleware/mongoErrors"

class CategoryController {

  async createCategory(ctx) {
    const name = ctx.request.body.name

    const category = new Category({
      name: name,
      slug: slugify(name).toLowerCase()
    })
    const error = category.validateSync()
    if(error){
      ctx.throw(422, mongoError(error))
    }

    try {
      ctx.body = await category.save()
    } catch (err) {
      ctx.throw(422, mongoError(err) )
    }
  }

  async getCategories(ctx) {
    try {
      ctx.body = await Category.find({})
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async getCategory(ctx) {
      const slug = ctx.params.slug.toLowerCase()
      let category
      let blogs
      await Category.findOne({slug})
        .exec()
        .then((cat) => {
            if(!cat){
              ctx.throw(422, 'Category does not exits.')
            }
            category = cat
        })
        .then(async ()=> {
          await Blog.find({categories: category})
            .populate('categories', '_id name username slug')
            .populate('tags', '_id name username slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug excerpt visited categories tags postedBy avatar createdAt')
            .exec()
            .then((res) => {
               blogs = res
              ctx.body = {
                blogs: res,
                category: category
              }
            })
        })
        .catch((err) => {
          ctx.throw(422, err)
        })
  }

  async deleteCategory(ctx) {
    try {
      const slug = ctx.params.slug
      const deleteCat = await Category.deleteOne({slug: slug})
      if (deleteCat) {
        ctx.body = {status: 200, message: 'Category was deleted successfully' }
      }
    } catch (err) {
      ctx.throw(422, err)
    }
  }

}

export default CategoryController