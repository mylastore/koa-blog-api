import slugify from 'slugify'
import Tag from '../models/Tag'
import Blog from '../models/Blog'
import mongoError from '../middleware/mongoErrors'

class TagController {
    async createTag(ctx) {
        const name = ctx.request.body.name

        const tag = new Tag({
            name: name,
            slug: slugify(name).toLowerCase(),
        })
        const error = tag.validateSync()
        if (error) {
            ctx.throw(422, mongoError(error))
        }

        try {
            return (ctx.body = await tag.save())
        } catch (err) {
            ctx.throw(422, mongoError(err))
        }
    }

    async getTags(ctx) {
        try {
            return (ctx.body = await Tag.find({}))
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async getTag(ctx) {
        try {
            const slug = ctx.params.slug.toLowerCase()
            const tag = await Tag.findOne({ slug })
            const blogs = await Blog.find({ tags: tag })
                .populate('categories', '_id name slug username')
                .populate('tags', '_id name slug username')
                .populate('postedBy', '_id name username')
                .select(
                    '_id title slug excerpt categories tags postedBy avatar createdAt visited'
                )
            return (ctx.body = {
                blogs: blogs,
                tag: tag,
            })
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async deleteTag(ctx) {
        try {
            const slug = ctx.params.slug
            const delTag = await Tag.deleteOne({ slug })
            if (delTag) {
                ctx.body = {
                    status: 200,
                    message: 'Tag was deleted successfully',
                }
            }
        } catch (err) {
            ctx.throw(422, err)
        }
    }
}

export default TagController
