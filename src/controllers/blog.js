import Blog from '../models/Blog'
import Category from "../models/Category"
import Tag from '../models/Tag'
import slugify from "slugify"
import stripHtml from 'string-strip-html'
import mongoError from '../middleware/mongoErrors'
import {smartTrim, isObjectEmpty} from '../middleware/utils'
import fs from 'fs'

let galID =[]

class BlogController {

  async blogImages(ctx) {
    galID.push(ctx.request.files.avatar.path.galID)
    const imgUrl = ctx.request.files.avatar.path.imgUrl
    const imgName = ctx.request.files.avatar.path.imgName
    const imgSize = ctx.request.files.avatar.path.imgSize
    ctx.body = {
      result: [
        {
          url: imgUrl,
          name: imgName,
          size: imgSize
        },
      ],
    }
  }

  async createBlog(ctx) {
    let {title, content, categories, tags} = ctx.request.body
    let excerptContent
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
      excerptContent = stripHtml(content).result
      if (excerptContent) {
        excerpt = smartTrim(excerptContent, 200, '', '...')
      }
    }
    if (title) {
      slug = slugify(title).toLowerCase()
    }

    const blog = new Blog({
      title: title,
      content: content,
      slug: slug,
      metaTitle: `${title} | ${process.env.APP_NAME}`,
      metaDescription: metaDescription,
      categories: categories,
      tags: tags,
      excerpt: excerpt,
      avatar: imageURl,
      imgID: imgID,
      galID: galID,
      postedBy: ctx.state.user._id
    })

    let error = await blog.validateSync()
    if (error) {
      ctx.throw(422, mongoError(error))
    }
    try {
      ctx.body = await blog.save()
      galID = []
    } catch (err) {
      ctx.throw(422, mongoError(err))
    }
  }

  async updateBlog(ctx, next) {
    const data = ctx.request.body
    const slug = ctx.params.slug

    if (data.title) {
      data.metaTitle = `${data.title} | ${process.env.APP_NAME}`
    }
    if (data.content) {
      data.excerpt = smartTrim(data.content, 200, '', '...')
      data.metaDescription = stripHtml(data.content.substring(0, 160)).result
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

    try {
      ctx.body = await Blog.findOneAndUpdate({slug: slug}, data, {new: true, runValidators: true, context: 'query'})
    } catch (err) {
      ctx.throw(422, mongoError(err))
    }

  }

  async deleteImg(ctx, next) {
    try{
      const blog = await Blog.findOne({slug: ctx.params.slug})

      if(blog){
        blog.avatar = 'seo-default.webp'
        const update = await blog.save()

        if(update){
          let dir = `upload/${blog.imgID}`
          await this.deleteImgDir(dir, ctx, next)
          ctx.body = {status: 200, message: 'Image was updated.'}
        }
      }
    }catch (err){
      ctx.throw(422, err)
    }
  }

  async getBlogs(ctx) {
    await Blog.find({postedBy: ctx.params.id})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select('_id title slug tags, postedBy, createdAt, updatedAt')
      .exec()
      .then(data => {
        ctx.body = data
      })
      .catch((err) => {
        ctx.throw(422, err)
      })
  }

  async getAll(ctx) {
    let blogs
    let categories
    let tags
    let body = ctx.request.body
    let limit = body.limit ? parseInt(body.limit) : 10
    let skip = body.skip ? parseInt(body.skip) : 0

    await Blog.find({})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .select('_id title avatar slug excerpt categories tags postedBy createdAt updatedAt')
      .exec()
      .then((blog) => {
        blogs = blog
      })
      .then(async () => {
        await Category.find({})
          .exec()
          .then((cat => {
            categories = cat
          }))
          .then(async () => {
            await Tag.find({})
              .exec()
              .then((tag => {
                tags = tag
              }))
              .then(async () => {
                await Blog.countDocuments({})
                  .exec()
                  .then((c => {
                    const total = c
                    ctx.body = {blogs, categories, tags, size: blogs.length, total}
                  }))
              })
          })
      })
      .catch((err) => {
        ctx.throw(422, err)
      })
  }

  async getBlog(ctx) {
    await Blog.findOne({slug: ctx.params.slug})
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name username')
      .select('_id title avatar content slug imgID metaTitle metaDescription categories tags postedBy createdAt updatedAt')
      .exec()
      .then((data) => {
        if (!data) {
          ctx.throw(422, {message: 'Blog not found.'})
        }
        ctx.body = data
      })
      .catch((err) => {
        ctx.throw(422, err)
      })
  }

  async deleteBlog(ctx, next) {
    const slug = ctx.params.slug
    try {
      const res = await Blog.findOne({slug})
      if (res && res.imgID) {
        let dir = `upload/${res.imgID}`
        await this.deleteImgDir(dir, ctx, next)
        await res.remove()
        return ctx.body = {status: 200, message: 'Success!'}
      } else {
        await res.remove()
        return ctx.body = {status: 200, message: 'Success!'}
      }
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async deleteImgDir(dir, ctx, next) {
    try {
      await fs.rmdirSync(dir, {recursive: true});
      return next()
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async getRelatedBlogs(ctx) {
    const body = ctx.request.body
    const {_id, categories} = body

    await Blog.find({_id: {$ne: _id}, categories: {$in: categories}})
      .limit(3)
      .populate('postedBy', '_id name username')
      .select('title slug avatar excerpt postedBy createdAt updatedAt')
      .exec()
      .then((data) => {
        ctx.body = data
      })
      .catch((err) => {
        ctx.throw(422, err)
      })


  }

  async search(ctx) {
    const search = ctx.request.query.q
    if (!search || search === '') {
      ctx.throw(422, 'Search query is empty.')
    }

    await Blog.find({$text: {$search: search}})
      .select('title slug excerpt postedBy')
      .exec()
      .then((res) => {
        ctx.body = res
      })
      .catch((err) => {
        ctx.throw(422, err)
      })

  }

}

export default BlogController