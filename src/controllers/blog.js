import Blog from '../models/Blog'
import Category from '../models/Category'
import Tag from '../models/Tag'
import slugify from 'slugify'
import stripHtml from 'string-strip-html'
import mongoError from '../middleware/mongoErrors'
import { rmdir } from '../middleware/utils'
import { isObjectEmpty } from '../middleware/validate'

class BlogController {
    constructor() {
        this.galID = []
    }

    //********* helper functions
    async getPublishBlogs(ctx) {
        const body = ctx.request.body
        const limit = body.limit ? parseInt(body.limit) : 10
        const skip = body.skip ? parseInt(body.skip) : 0

        try {
            return await Blog.find({ published: true })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select(
                    '_id title avatar slug visited excerpt categories tags postedBy createdAt'
                )
                .exec()
        } catch (err) {
            return err
        }
    }

    async getCategories() {
        try {
            return await Category.find({})
        } catch (err) {
            return err
        }
    }

    async getTags() {
        try {
            return await Tag.find({})
        } catch (err) {
            return err
        }
    }

    async getAllPublishBlogCount() {
        try {
            return await Blog.countDocuments({ published: true })
        } catch (err) {
            return err
        }
    }
    //**************

    async blogImages(ctx, next) {
        try {
            this.galID.push(ctx.request.files.avatar.path.galID)
            const imgUrl = ctx.request.files.avatar.path.imgUrl
            const imgName = ctx.request.files.avatar.path.imgName
            const imgSize = ctx.request.files.avatar.path.imgSize
            return (ctx.body = {
                result: [
                    {
                        url: imgUrl,
                        name: imgName,
                        size: imgSize,
                    },
                ],
            })
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async createBlog(ctx) {
        let { title, content, published, categories, tags } = ctx.request.body
        let slug
        let metaDescription
        let excerpt
        let imageURl = 'seo-default.webp'
        let imgID

        if (!isObjectEmpty(ctx.request.files)) {
            imageURl = ctx.request.files.avatar.path.avatarUrl
            imgID = ctx.request.files.avatar.path.imgID
        }

        if (categories) {
            categories = categories.trim().split(/\s*,\s*/)
        }
        if (tags) {
            tags = tags.trim().split(/\s*,\s*/)
        }

        if (!categories || categories.length === 0) {
            ctx.throw(400, 'At least one category is required')
        }
        if (!tags || tags.length === 0) {
            ctx.throw(400, 'At least one tag is required')
        }

        if (content) {
            metaDescription = stripHtml(content.substring(0, 160)).result
            excerpt = stripHtml(content.substring(0, 200)).result
        }
        if (title) {
            slug = slugify(title).toLowerCase()
        }

        const blog = new Blog({
            title: title,
            published: published,
            content: content,
            slug: slug,
            metaTitle: `${title} | ${process.env.APP_NAME}`,
            metaDescription: metaDescription,
            categories: categories,
            tags: tags,
            excerpt: excerpt,
            avatar: imageURl,
            imgID: imgID,
            galID: this.galID,
            postedBy: ctx.state.user._id,
        })

        let error = await blog.validateSync()
        if (error) {
            ctx.throw(422, mongoError(error))
        }
        try {
            ctx.body = await blog.save()
            this.galID = []
        } catch (err) {
            ctx.throw(422, mongoError(err))
        }
    }

    async updateBlog(ctx, next) {
        const data = ctx.request.body
        const slug = ctx.params.slug

        data.published = ctx.request.body.published

        if (data.title) {
            data.metaTitle = `${data.title} | ${process.env.APP_NAME}`
        }
        if (data.content) {
            data.excerpt = stripHtml(data.content.substring(0, 200)).result
            data.metaDescription = stripHtml(
                data.content.substring(0, 160)
            ).result
        }
        if (data.categories) {
            data.categories = data.categories.trim().split(/\s*,\s*/)
        }
        if (data.tags) {
            data.tags = data.tags.trim().split(/\s*,\s*/)
        }
        if (!isObjectEmpty(ctx.request.files)) {
            data.avatar = ctx.request.files.avatar.path.avatarUrl
            data.imgID = ctx.request.files.avatar.path.imgID
        }

        // if new image push to galID array on DB
        if (this.galID.length) {
            await Blog.findOneAndUpdate(
                {
                    slug: slug,
                },
                {
                    $push: {
                        galID: this.galID,
                    },
                }
            )
        }

        try {
            const res = await Blog.findOneAndUpdate({ slug: slug }, data, {
                new: true,
                runValidators: true,
                context: 'query',
            })
            if (res) {
                ctx.body = res
                this.galID = []
            }
        } catch (err) {
            ctx.throw(422, mongoError(err))
        }
    }

    async deleteImg(ctx, next) {
        try {
            const blog = await Blog.findOne({ slug: ctx.params.slug })
            if (blog) {
                blog.avatar = 'seo-default.webp'
                const update = await blog.save()
                if (update) {
                    await rmdir(`upload/${blog.imgID}`)
                    ctx.body = { status: 200, message: 'Image was updated.' }
                }
            }
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async getAllUserBlogs(ctx) {
        try {
            return (ctx.body = await Blog.find({ postedBy: ctx.params.id })
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name username')
                .select(
                    '_id title slug visited tags postedBy published createdAt'
                ))
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async getAllPublishedBlogs(ctx) {
        try {
            const blogs = await this.getPublishBlogs(ctx)

            return (ctx.body = {
                blogs: blogs,
                categories: await this.getCategories(),
                tags: await this.getTags(),
                size: blogs.length,
                total: await this.getAllPublishBlogCount(),
            })
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async getBlog(ctx) {
        try {
            // we are using fineOneAndUpdate to add visited +1 to DB
            return (ctx.body = await Blog.findOneAndUpdate(
                { slug: ctx.params.slug },
                { $inc: { visited: 1 } },
                { new: true, upsert: true }
            )
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name username')
                .select(
                    '_id title published avatar content slug imgID visited metaTitle metaDescription categories tags postedBy createdAt'
                ))
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async deleteBlog(ctx, next) {
        const slug = ctx.params.slug
        try {
            const res = await Blog.findOne({ slug })
            if (res && res.imgID) {
                await rmdir(`upload/${res.imgID}`)
                await res.remove()
                return (ctx.body = { status: 200, message: 'Success!' })
            }
            if (res && res.galID) {
                for (let filename of res.galID) {
                    await rmdir(`upload/${filename}`)
                }
                await res.remove()
                return (ctx.body = { status: 200, message: 'Success!' })
            }
            await res.remove()
            return (ctx.body = { status: 200, message: 'Success!' })
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async getRelatedBlogs(ctx) {
        const { _id, categories } = ctx.request.body

        try {
            return (ctx.body = await Blog.find({
                _id: { $ne: _id },
                categories: { $in: categories },
            })
                .limit(3)
                .populate('postedBy', '_id name username')
                .select(
                    'title slug avatar excerpt postedBy createdAt updatedAt'
                ))
        } catch (err) {
            ctx.throw(422, err)
        }
    }

    async search(ctx) {
        const search = ctx.request.query.q
        if (!search || search === '') {
            ctx.throw(422, 'Search query is empty.')
        }
        try {
            return (ctx.body = await Blog.find({
                $text: { $search: search },
            }).select('title slug excerpt postedBy'))
        } catch (err) {
            ctx.throw(422, err)
        }
    }
}

export default BlogController
