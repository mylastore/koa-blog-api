'use strict'

import rmdir from "../middleware/removeDirectory"

require('dotenv').config()

import mongoose from 'mongoose'
import Quote from '../models/Quote'
import User from '../models/User'
import Category from "../models/Category"
import Tag from "../models/Tag"
import Blog from "../models/Blog"
import data from '../seed/data'

/**
 * Class - deletes current data and seed new one
 * @class
 * @category Seeding Data
 */
class SeedData {
    /**
     * @param {Object[]} quotes quotes seed data
     * @param {Object[]} users users seed data
     * @param {Object[]} listings listings seed data
     * @param {Object[]} models Models for user, quote and listing
     */
    constructor() {
        this.blogs = data.blogs
        this.quotes = data.quotes
        this.users = data.users
        this.tags = data.tags
        this.categories = data.categories
        this.models = [User, Quote, Blog, Tag, Category]
    }

    async cleanDb() {
        for (let model of this.models) {
            await model.deleteMany({}, () => {})
        }
    }

    async pushDataToDb() {
        await this.blogs.forEach(async blog => {
            await new Blog(blog).save(() => {})
        })

        await this.tags.forEach(async tag => {
            await new Tag(tag).save(() => {})
        })

        await this.categories.forEach(async cat => {
            await new Category(cat).save(() => {})
        })

        await this.quotes.forEach(async quote => {
            await new Quote(quote).save(() => {})
        })

        await this.users.forEach(async user => {
            await new User(user).save(() => {})
        })

        console.log('Database Populated!')
    }

    async seedDb() {
        // remove all uploaded images 'upload' directory
        await rmdir('upload', { removeContentOnly: true })
        await this.cleanDb()
        await this.pushDataToDb()
    }
}

const dbUri = process.env.DB_URI
mongoose
    .connect(dbUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        const db = new SeedData()
        await db.seedDb()
        console.log('You can close connection now by pressing ctr+c')
    })
    .catch(err => console.log(err))
