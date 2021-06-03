import Category from '../models/Category'
import Blog from '../models/Blog'
import slugify from 'slugify'
import mongoError from '../middleware/mongoErrors'

class CategoryController {
    async createCategory(ctx) {
        const name = ctx.request.body.name

        const category = new Category({
            name: name,
            slug: slugify(name).toLowerCase(),
        })
        const error = category.validateSync()
        if (error) {
            ctx.throw(422, mongoError(error))
        }

        try {
            return (ctx.body = await category.save())
        } catch (err) {
            ctx.throw(422, mongoError(err))
        }
    }

    async getCategories(ctx) {
        try {
            return (ctx.body = await Category.find({}))
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async getCategory(ctx) {
        const slug = ctx.params.slug.toLowerCase()

        try {
            const category = await Category.findOne({ slug })

            const blogs = await Blog.find({ categories: category })
                .populate('categories', '_id name username slug')
                .populate('tags', '_id name username slug')
                .populate('postedBy', '_id name username')
                .select(
                    '_id title slug excerpt visited categories tags postedBy avatar createdAt'
                )

            return (ctx.body = {
                blogs: blogs,
                category: category,
            })
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async deleteCategory(ctx) {
        try {
            await Category.deleteOne({ slug: ctx.params.slug })
            return (ctx.body = {
                status: 200,
                message: 'Category was deleted successfully',
            })
        } catch (err) {
            ctx.throw(422, err)
        }
    }
}

export default CategoryController
